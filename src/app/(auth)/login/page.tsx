"use client"

import Button from "@/components/inputs/Button"
import TextField from "@/components/inputs/TextField"
import Card from "@/components/surfaces/cards/Card"
import CardContent from "@/components/surfaces/cards/CardContent"
import CardHeader from "@/components/surfaces/cards/CardHeader"
import { returnToPathParamName } from "@/lib/frontend/urlParams"
import useAuthZustand from "@/zustand/useAuthZustand"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { FaKey, FaTimesCircle } from "react-icons/fa"
import styles from "./page.module.scss"

export default function Page() {
    const searchParams = useSearchParams()
    const returnToParam = searchParams.get(returnToPathParamName)

    const { jwt, login } = useAuthZustand((state) => ({
        jwt: state.jwt,
        login: state.login,
    }))
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [invalidAuth, setInvalidAuth] = useState(false)
    const [error, setError] = useState(false)

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

        const result = await login(email, password)

        if (result === "invalidAuth") {
            setInvalidAuth(true)
            return
        }

        router.push(returnToParam ?? "/intern")
    }

    return (
        <Card breakpoint="small" className={styles.card}>
            <CardHeader
                icon={<FaKey />}
                title="Anmelden"
                // subTitle={
                //     <>
                //         Stattdessen ein{" "}
                //         <Link href="/sign-up">Konto erstellen</Link>
                //     </>
                // }
            />
            <CardContent>
                <form className={styles.form} onSubmit={onLogin}>
                    <fieldset className={styles.inputs}>
                        <TextField
                            autoComplete="username"
                            id="email"
                            name="E-Mail"
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setInvalidAuth(false)
                            }}
                            value={email}
                        />
                        <TextField
                            autoComplete="current-password"
                            id="password"
                            name="Passwort"
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setInvalidAuth(false)
                            }}
                            password
                            value={password}
                        />
                        <Link
                            className={styles.resetPassword}
                            href="/reset-password"
                        >
                            Passwort zurücksetzen
                        </Link>
                    </fieldset>
                    {invalidAuth && (
                        <div className={`${styles.msg} ${styles.error}`}>
                            <FaTimesCircle />
                            <p>Ungültige Anmeldedaten</p>
                            <FaTimesCircle />
                        </div>
                    )}
                    <fieldset className={styles.actions}>
                        <Button type="submit" onClick={onLogin}>
                            Anmelden
                        </Button>
                    </fieldset>
                </form>
            </CardContent>
        </Card>
    )
}
