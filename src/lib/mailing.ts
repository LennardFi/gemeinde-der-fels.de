import { readFile } from "fs/promises"
import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import Website from "../typings"

/**
 * The name of the configuration file
 */
const configFile = "mailing-config.json"

export const readMailConfig =
    async (): Promise<Website.Config.MailingConfig> => {
        const file = await readFile(`./${configFile}`, {
            encoding: "utf8",
        })

        const config = JSON.parse(file) as Website.Config.MailingConfig

        return config
    }

export const createClient = (config: Website.Config.MailingConfig) => {
    const smtpTransport = new SMTPTransport({
        host: config.host,
        port: config.port,
        auth: {
            type: "login",
            user: config.user,
            pass: config.password,
        },
        secure: true,
        logger: true,
    })
    return nodemailer.createTransport(smtpTransport)
}

export const sendMail = async (
    contactName: string,
    contactMail: string,
    contactPhone: string,
    contactDescription: string
): Promise<void> => {
    const config = await readMailConfig()
    const client = createClient(config)

    client.sendMail(
        {
            to: config.toMailAddress,
            cc: contactMail,
            from: {
                address: config.fromMailAddress,
                name: "Website Kontaktformular",
            },
            subject: config.dev
                ? `Test-Mail`
                : `Foto-Anfrage per Mail von ${contactName}`,
            html: `
<style>
* {
    font-family: Raleway, "Open Sans", "Fira Code", "Fira Code VF", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
</style>
<h1>Neue ${
                config.dev ? "Test-" : ""
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
            if (err === null || err === undefined) {
                console.error("Error while sending e-mail:", err)
            }
            client.close()
        }
    )
}
