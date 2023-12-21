"use client"

import Flex from "@/components/containers/Flex"
import Button from "@/components/inputs/Button"
import Paper from "@/components/surfaces/Paper"
import Website from "@/typings"
import useUserPreferencesZustand from "@/zustand/useUserPreferencesZustand"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Temporal } from "temporal-polyfill"
import styles from "./PrivacyConsentBar.module.scss"
import PrivacyConsentDialog from "./PrivacyConsentDialog"

export interface PrivacyConsentBarProps {
    inRootLayout?: boolean
    sticky?: boolean
    themeColor?: Website.Design.ThemeColor
    themeColorVariant?: Website.Design.ThemeColorVariant
}

export const privacyLastUpdate = Temporal.Now.zonedDateTimeISO("UTC").subtract({
    hours: 12,
}).epochMilliseconds

const disabledOnRoutes: string[] = ["/"]

export default function PrivacyConsentBar({
    inRootLayout,
    sticky,
    themeColor = "secondary",
    themeColorVariant,
}: PrivacyConsentBarProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const pathName = usePathname()
    const { loaded, loadPreferences, privacy, updatePreferences } =
        useUserPreferencesZustand((state) => ({
            loaded: state.loaded,
            loadPreferences: state.loadPreferences,
            privacy: state.privacy,
            updatePreferences: state.updatePreferences,
        }))

    useEffect(() => {
        if (!loaded) {
            loadPreferences()
        }
    }, [loaded])

    if (!loaded) {
        return null
    }

    if (inRootLayout && disabledOnRoutes.includes(pathName)) {
        return null
    }

    if (
        privacy?.acceptedPrivacyNotesOn !== undefined &&
        privacyLastUpdate <= privacy.acceptedPrivacyNotesOn
    ) {
        // Already accepted
        return null
    }

    if (privacy?.allowCookies === false) {
        return null
    }

    const onAccept = () => {
        updatePreferences({
            privacy: {
                acceptedPrivacyNotesOn:
                    Temporal.Now.zonedDateTimeISO("UTC").epochMilliseconds,
                allowCookies: true,
                enabledCookies: {
                    preferences: true,
                    session: true,
                },
            },
        })
    }

    const onSetup = () => {
        setDialogOpen(true)
    }

    const onDecline = () => {
        updatePreferences({
            privacy: {
                acceptedPrivacyNotesOn: undefined,
                allowCookies: false,
                enabledCookies: {
                    preferences: false,
                    session: false,
                },
            },
        })
    }

    return (
        <>
            <Paper
                className={`${styles.consentBar} ${
                    sticky ? styles.sticky : ""
                }`}
                noPadding
                themeColor={themeColor}
                themeColorVariant={themeColorVariant}
            >
                <Paper breakpoint="normal" noPadding>
                    <Flex
                        direction="column"
                        justify="space-between"
                        gap={1}
                        normal={{
                            direction: "row",
                        }}
                    >
                        <p>
                            Wenn Sie unsere Website besuchen, stimmen Sie
                            unserer{" "}
                            <Link href="/datenschutz">
                                Datenschutzerklärung
                            </Link>{" "}
                            zu. Außerdem verwenden wir Cookies.
                        </p>
                        <Flex
                            autoResize
                            breakpoint="tiny"
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            columnGap={1}
                        >
                            <Button
                                onClick={onAccept}
                                themeColor={
                                    themeColor === "primary"
                                        ? "secondary"
                                        : themeColor === "secondary"
                                          ? "primary"
                                          : "accent"
                                }
                                // variant="contained"
                                type="submit"
                            >
                                Zustimmen
                            </Button>
                            <Button
                                onClick={onSetup}
                                themeColor={themeColor}
                                variant="contained"
                            >
                                Einstellungen
                            </Button>
                            <Button
                                onClick={onDecline}
                                themeColor={themeColor}
                                variant="contained"
                            >
                                Ablehnen
                            </Button>
                        </Flex>
                    </Flex>
                </Paper>
            </Paper>
            {dialogOpen ? (
                <PrivacyConsentDialog onClose={() => setDialogOpen(false)} />
            ) : null}
        </>
    )
}
