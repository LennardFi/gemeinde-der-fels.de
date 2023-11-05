"use client"

import Banner from "@/components/Feedback/Banner"
import Button from "@/components/inputs/Button"
import ButtonLink from "@/components/inputs/ButtonLink"
import TextField from "@/components/inputs/TextField"
import Card from "@/components/surfaces/cards/Card"
import CardContent from "@/components/surfaces/cards/CardContent"
import CardHeader from "@/components/surfaces/cards/CardHeader"
import { returnToPathParamName } from "@/lib/frontend/urlParams"
import { WebsiteError } from "@/lib/shared/errors"
import useAuthZustand from "@/zustand/useAuthZustand"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { FaAngleRight, FaKey, FaTimesCircle } from "react-icons/fa"
import styles from "./page.module.scss"

export default function Page() {
    const searchParams = useSearchParams()
    const returnToParam = searchParams.get(returnToPathParamName)

    const jwt = useAuthZustand((state) => state.jwt)
    const login = useAuthZustand((state) => state.login)
    const router = useRouter()
    const [locked, setLocked] = useState(false)
    const [emailOrUsername, setEmailOrUsername] = useState("")
    const [password, setPassword] = useState("")
    const [invalidAuth, setInvalidAuth] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (jwt !== undefined) {
            router.replace(returnToParam ?? "/intern")
            return
        }
    }, [jwt])

    const onLogin = async (
        e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault()
        e.stopPropagation()

        setLocked(true)

        try {
            await login(emailOrUsername, password)

            setLocked(false)
            router.push(returnToParam ?? "/intern")
        } catch (e) {
            setLocked(false)
            if (e instanceof WebsiteError) {
                if (e.options.httpStatusCode === 401) {
                    setInvalidAuth(true)
                    return
                }
            }
        }
    }

    return (
        <Card breakpoint="small" className={styles.card}>
            <CardHeader icon={<FaKey />} title="Anmelden" />
            <CardContent>
                <form className={styles.form} onSubmit={onLogin}>
                    <fieldset className={styles.inputs}>
                        <TextField
                            autoComplete="username"
                            error={invalidAuth}
                            id="email"
                            name="E-Mail oder Benutzername"
                            onChange={(e) => {
                                if (locked) {
                                    return
                                }
                                setEmailOrUsername(e.target.value)
                                setInvalidAuth(false)
                            }}
                            value={emailOrUsername}
                        />
                        <TextField
                            autoComplete="current-password"
                            error={invalidAuth}
                            id="password"
                            name="Passwort"
                            onChange={(e) => {
                                if (locked) {
                                    return
                                }
                                setPassword(e.target.value)
                                setInvalidAuth(false)
                            }}
                            password
                            value={password}
                        />
                        <ButtonLink
                            className={styles.resetPassword}
                            href="/reset-password"
                            variant="outlined"
                        >
                            Passwort zurücksetzen
                        </ButtonLink>
                    </fieldset>
                    <fieldset className={styles.banners}>
                        {invalidAuth && (
                            <Banner
                                error
                                icon={<FaTimesCircle />}
                                label="Ungültige Anmeldedaten"
                            />
                        )}
                    </fieldset>
                    <fieldset className={styles.actions}>
                        <Button
                            rightSegment={<FaAngleRight />}
                            onClick={onLogin}
                            type="submit"
                            variant="contained"
                        >
                            Anmelden
                        </Button>
                    </fieldset>
                </form>
            </CardContent>
        </Card>
    )
}
