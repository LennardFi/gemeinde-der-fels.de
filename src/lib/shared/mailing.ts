import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import { isDevMode } from "./develop"
import { readRequiredEnvValueSafely } from "./env"

export const createClient = () => {
    const smtpTransport = new SMTPTransport({
        host: readRequiredEnvValueSafely("MAILING_HOST", "string"),
        port: readRequiredEnvValueSafely("MAILING_PORT", "number", true),
        auth: {
            type: "login",
            user: readRequiredEnvValueSafely("MAILING_USER", "string"),
            pass: readRequiredEnvValueSafely("MAILING_PASSWORD", "string"),
        },
        requireTLS: true,
        secure: true,
        logger: true,
    })
    return nodemailer.createTransport(smtpTransport)
}

export const sendMail = async (
    contactName: string,
    contactMail: string,
    contactPhone: string,
    contactDescription: string,
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const client = createClient()

        client.sendMail(
            {
                to: readRequiredEnvValueSafely(
                    "MAILING_TO_MAIL_ADDRESS",
                    "string",
                ),
                // cc: contactMail,
                from: {
                    address: readRequiredEnvValueSafely(
                        "MAILING_FROM_MAIL_ADDRESS",
                        "string",
                    ),
                    name: "Website Kontaktformular",
                },
                subject: `Kontakt-Anfrage per Mail von ${contactName}`,
                html: `
<style>
* {
    font-family: Raleway, "Open Sans", "Fira Code", "Fira Code VF", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
</style>
<h1>Neue ${
                    isDevMode ? "Test-" : ""
                }Kontaktaufnahme über das Kontaktformular:<h1>
<h2>Name</h2>
<p>${contactName}</p>
<h2>Mail</h2>
<p>${contactMail}</p>
<h2>Telefon-Nr.</h2>
<p>${contactPhone}</p>
<h2>Beschreibung</h2>
<p>${contactDescription}</p>
`,
            },
            (err) => {
                if (err !== null && err !== undefined) {
                    console.error("Error while sending e-mail:", err)
                    reject(err)
                }
                client.close()
                resolve()
            },
        )
    })
}
