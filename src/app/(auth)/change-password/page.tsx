"use client"

import Banner from "@/components/feedback/Banner"
import Skeleton from "@/components/feedback/Skeleton"
import Button from "@/components/inputs/Button"
import ButtonLink from "@/components/inputs/ButtonLink"
import TextField from "@/components/inputs/TextField"
import Window from "@/components/surfaces/window/Window"
import WindowContent from "@/components/surfaces/window/WindowContent"
import WindowHeader from "@/components/surfaces/window/WindowHeader"
import {
    resetPasswordTokenParamName,
    returnToPathParamName,
} from "@/lib/shared/urlParams"
import useAuthZustand from "@/zustand/useAuthZustand"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, Suspense, useEffect, useState } from "react"
import { FaKey } from "react-icons/fa"
import styles from "./page.module.scss"

function ClientSideContent() {
    const searchParams = useSearchParams()
    const resetPasswordToken = searchParams.get(resetPasswordTokenParamName)
    const returnToPath = searchParams.get(returnToPathParamName)
    const initialLoadDone = useAuthZustand((state) => state.initialLoadDone)
    const jwt = useAuthZustand((state) => state.jwt)
    const changePassword = useAuthZustand((state) => state.changePassword)
    const router = useRouter()
    const [locked, setLocked] = useState(false)
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordsNotEqual, setPasswordsNotEqual] = useState(false)
    const [passwortEmpty, setPasswortEmpty] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (
            initialLoadDone &&
            jwt !== undefined &&
            resetPasswordToken === null
        ) {
            router.replace("/login")
        }
    }, [initialLoadDone, jwt, resetPasswordToken])

    const validatePasswordEquality = (forSubmit?: boolean) => {
        if (newPassword === "" || confirmPassword === "") {
            if (forSubmit) {
                setPasswortEmpty(true)
            }
            return false
        }

        if (newPassword !== confirmPassword) {
            setPasswordsNotEqual(true)
            return false
        }
        return true
    }

    const onSubmit = async (
        e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault()
        e.stopPropagation()
        if (!validatePasswordEquality(true)) {
            return
        }

        setLocked(true)

        try {
            if (resetPasswordToken !== null) {
                await changePassword(
                    newPassword,
                    confirmPassword,
                    "token",
                    resetPasswordToken,
                )

                router.push("/login")
            } else {
                await changePassword(
                    newPassword,
                    confirmPassword,
                    "password",
                    oldPassword,
                )
                router.push(returnToPath ?? "/intern/mein-konto")
            }
        } catch (e) {
            setError("Unbekannter Fehler")
            setLocked(false)
        }
    }

    return (
        <Window breakpoint="small" className={styles.card} pageContainer>
            <WindowHeader
                leftSegment={<FaKey />}
                title={
                    !resetPasswordToken
                        ? "Passwort ändern"
                        : "Passwort zurücksetzen"
                }
            />
            <WindowContent className={styles.container}>
                <form className={styles.form} onSubmit={onSubmit}>
                    <fieldset className={styles.inputs}>
                        {!resetPasswordToken && (
                            <TextField
                                autoComplete="current-password"
                                error={passwortEmpty && oldPassword === ""}
                                id="currentPassword"
                                name="Aktuelles Passwort"
                                onChange={(e) => {
                                    if (locked) {
                                        return
                                    }
                                    setOldPassword(e.target.value)
                                    setError("")
                                }}
                                password
                                value={oldPassword}
                            />
                        )}
                        <TextField
                            autoComplete="new-password"
                            error={
                                (passwortEmpty && oldPassword === "") ||
                                passwordsNotEqual
                            }
                            id="newPassword"
                            name="Neues Passwort"
                            onChange={(e) => {
                                if (locked) {
                                    return
                                }
                                setPasswordsNotEqual(false)
                                setNewPassword(e.target.value)
                                setPasswortEmpty(false)
                                setError("")
                            }}
                            onBlur={() => validatePasswordEquality(false)}
                            password
                            value={newPassword}
                        />
                        <TextField
                            autoComplete="new-password"
                            error={
                                (passwortEmpty && oldPassword === "") ||
                                passwordsNotEqual
                            }
                            id="confirmPassword"
                            name="Passwort wiederholen"
                            onChange={(e) => {
                                if (locked) {
                                    return
                                }
                                setPasswordsNotEqual(false)
                                setPasswortEmpty(false)
                                setConfirmPassword(e.target.value)
                                setError("")
                            }}
                            onBlur={() => validatePasswordEquality(false)}
                            password
                            value={confirmPassword}
                        />
                    </fieldset>
                    <fieldset className={styles.banners}>
                        {passwordsNotEqual && (
                            <>
                                <Banner
                                    error
                                    label="Neue Passwörter stimmen nicht überein"
                                    onClose={() => setPasswordsNotEqual(false)}
                                />
                            </>
                        )}
                        {passwortEmpty && (
                            <>
                                <Banner
                                    error
                                    label="Alle Felder müssen ausgefüllt werden"
                                    onClose={() => setPasswortEmpty(false)}
                                />
                            </>
                        )}
                        {error && (
                            <Banner
                                error
                                label={error}
                                onClose={() => setError("")}
                            />
                        )}
                    </fieldset>
                    <fieldset className={styles.actions}>
                        {returnToPath && (
                            <ButtonLink href={returnToPath}>Zurück</ButtonLink>
                        )}
                        <Button onClick={onSubmit} type="submit">
                            Passwort ändern
                        </Button>
                    </fieldset>
                </form>
            </WindowContent>
        </Window>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<Skeleton />}>
            <ClientSideContent />
        </Suspense>
    )
}
