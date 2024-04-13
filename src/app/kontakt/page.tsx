"use client"
import PageContainer from "@/components/containers/PageContainer"
import Button from "@/components/inputs/Button"
import MultilineTextField from "@/components/inputs/MultilineTextField"
import TextField from "@/components/inputs/TextField"
import Divider from "@/components/surfaces/Divider"
import Paper from "@/components/surfaces/Paper"
import { ContactBanner } from "@/components/templates/ContactBanner/ContactBanner"
import { FormEventHandler, useEffect, useState } from "react"
import useIsMounted from "../../hooks/useIsMounted"
import Website, { Maybe } from "../../typings"
import styles from "./page.module.scss"

export default function Contact() {
    const isMountedRef = useIsMounted()
    const [requestSent, setRequestSent] = useState(false)
    const [response, setResponse] = useState<Maybe<boolean>>(undefined)
    const [description, setDescription] = useState("")
    const [name, setName] = useState("")
    const [mail, setMail] = useState("")
    const [phone, setPhone] = useState("")
    const [honeypot, setHoneypot] = useState("")

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setRequestSent(true)
    }

    const resetSendButton = () => {
        setRequestSent(false)
        setResponse(undefined)
    }

    useEffect(() => {
        if (requestSent) {
            fetch("/api/contact", {
                headers: new Headers({
                    contentType: "application/json",
                }),
                method: "POST",
                body: JSON.stringify({
                    description,
                    mail,
                    name,
                    phone,
                    // honeypot entry
                    newPassword: honeypot === "" ? undefined : honeypot,
                } as Website.Api.Endpoints.ContactRequestBody),
            })
                .then((res) => {
                    if (isMountedRef.current) {
                        setRequestSent(false)
                        setResponse(res.status === 200 ? true : false)
                    }
                })
                .catch(() => {
                    if (isMountedRef.current) {
                        setRequestSent(false)
                        setResponse(false)
                    }
                })
                .finally(() => {
                    setTimeout(() => {
                        if (isMountedRef.current) {
                            resetSendButton()
                        }
                    }, 2000)
                })
        }
    }, [requestSent])

    return (
        <PageContainer
            breakpoint="normal"
            title="Kontakt"
            themeColor="primary"
            themeColorVariant="font"
        >
            <Paper breakpoint="small">
                <form className={styles.form} onSubmit={submit}>
                    <TextField
                        name="Name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                    <p>Wie können wir dich erreichen?</p>
                    <TextField
                        name="E-Mail"
                        onChange={(e) => setMail(e.target.value)}
                        value={mail}
                    />
                    <Divider themeColor="transparent" />
                    <TextField
                        name="Telefon-Nr."
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone}
                    />
                    <p>Was ist dein Anliegen?</p>
                    <MultilineTextField
                        onChange={(e) => setDescription(e.target.value)}
                        name={"Anliegen"}
                        rows="small"
                        value={description}
                    />
                    <Divider themeColor="transparent" />
                    {/**
                     * This field is only working as a honeypot field.
                     */}
                    <TextField
                        autoComplete="new-password"
                        containerProps={{
                            className: styles.newPasswordTextField,
                        }}
                        name="Neues Passwort"
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        value={honeypot}
                    />
                    <Divider themeColor="transparent" />
                    {response === undefined ? (
                        <Button
                            className={styles.send}
                            disabled={requestSent}
                            type="submit"
                        >
                            Senden
                        </Button>
                    ) : response ? (
                        <p
                            className={`${styles.responseMsg} ${styles.success}`}
                        >
                            Anfrage versendet
                        </p>
                    ) : (
                        <p className={`${styles.responseMsg} ${styles.error}`}>
                            Fehler beim Versenden der Anfrage
                        </p>
                    )}
                </form>
            </Paper>
            <Divider themeColor="transparent" variant="section" />
            <Paper breakpoint="small">
                <p style={{ textAlign: "center" }}>
                    Oder versuch es auf direktem Weg:
                </p>
                <Divider themeColor="transparent" />
                <ContactBanner />
            </Paper>
        </PageContainer>
    )
}
