"use client"

import RequiresFeatureFlag from "@/components/dev/RequiresDevFeatureFlag"
import Banner from "@/components/feedback/Banner"
import Skeleton from "@/components/feedback/Skeleton"
import Button from "@/components/inputs/Button"
import ButtonLink from "@/components/inputs/ButtonLink"
import TextField from "@/components/inputs/TextField"
import Window from "@/components/surfaces/window/Window"
import WindowContent from "@/components/surfaces/window/WindowContent"
import WindowHeader from "@/components/surfaces/window/WindowHeader"
import { WebsiteError } from "@/lib/shared/errors"
import { returnToPathParamName } from "@/lib/shared/urlParams"
import { Maybe } from "@/typings"
import useAuthZustand from "@/zustand/useAuthZustand"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, Suspense, useEffect, useState } from "react"
import { FaAngleRight, FaKey, FaTimesCircle } from "react-icons/fa"
import styles from "./page.module.scss"

export const dynamic = "force-dynamic"

function ClientSideContent() {
    const searchParams = useSearchParams()
    const returnToParam = searchParams.get(returnToPathParamName)

    const jwt = useAuthZustand((state) => state.jwt)
    const login = useAuthZustand((state) => state.login)
    const router = useRouter()
    const [processing, setProcessing] = useState(false)
    const [emailOrUsername, setEmailOrUsername] = useState("")
    const [password, setPassword] = useState("")
    const [invalidAuth, setInvalidAuth] = useState(false)
    const [error, setError] = useState<Maybe<string>>(undefined) // FIXME: Show error

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

        setProcessing(true)

        try {
            await login(emailOrUsername, password)

            setProcessing(false)
            router.push(returnToParam ?? "/intern")
        } catch (e) {
            setProcessing(false)
            if (e instanceof WebsiteError) {
                setError(e.message)

                if (e.options.httpStatusCode === 401) {
                    setInvalidAuth(true)
                    return
                }
            }
        }
    }

    return (
        <RequiresFeatureFlag flags={["internArea"]} redirectTo="/">
            <Window breakpoint="small" className={styles.card} pageContainer>
                <WindowHeader leftSegment={<FaKey />} title="Anmelden" />
                <WindowContent>
                    <form className={styles.form} onSubmit={onLogin}>
                        <fieldset className={styles.inputs}>
                            <TextField
                                autoComplete="username"
                                disabled={processing}
                                error={invalidAuth}
                                id="email"
                                name="E-Mail oder Benutzername"
                                onChange={(e) => {
                                    if (processing) {
                                        return
                                    }
                                    setEmailOrUsername(e.target.value)
                                    setInvalidAuth(false)
                                }}
                                value={emailOrUsername}
                            />
                            <TextField
                                autoComplete="current-password"
                                disabled={processing}
                                error={invalidAuth}
                                id="password"
                                name="Passwort"
                                onChange={(e) => {
                                    if (processing) {
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
                                loading={processing}
                                variant="text"
                            >
                                Passwort zurücksetzen
                            </ButtonLink>
                        </fieldset>
                        <fieldset className={styles.banners}>
                            {invalidAuth ? (
                                <Banner
                                    error
                                    icon={<FaTimesCircle />}
                                    label="Ungültige Anmeldedaten"
                                />
                            ) : error !== undefined ? (
                                <Banner
                                    error
                                    icon={<FaTimesCircle />}
                                    label="Unbekannter Fehler"
                                    description={error}
                                    onClose={() => setError(undefined)}
                                />
                            ) : null}
                        </fieldset>
                        <fieldset className={styles.actions}>
                            <Button
                                disabled={processing}
                                loading={processing}
                                rightSegment={<FaAngleRight />}
                                onClick={onLogin}
                                type="submit"
                                variant="contained"
                            >
                                Anmelden
                            </Button>
                        </fieldset>
                    </form>
                </WindowContent>
            </Window>
        </RequiresFeatureFlag>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<Skeleton />}>
            <ClientSideContent />
        </Suspense>
    )
}
