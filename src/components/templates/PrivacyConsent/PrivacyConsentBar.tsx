"use client"

import Flex from "@/components/containers/Flex"
import RequiresFeatureFlag from "@/components/dev/RequiresDevFeatureFlag"
import Button from "@/components/inputs/Button"
import Paper from "@/components/surfaces/Paper"
import Website from "@/typings"
import useUserPreferencesZustand from "@/zustand/useUserPreferencesZustand"
import Link from "next/link"
import { useCallback, useEffect } from "react"
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

export default function PrivacyConsentBar({
    sticky,
    themeColor = "primary",
    themeColorVariant,
}: PrivacyConsentBarProps) {
    const {
        loaded,
        loadPreferences,
        setShowPreferencesDialog,
        showPreferencesDialog,
        privacy,
        updatePreferences,
    } = useUserPreferencesZustand((state) => ({
        loaded: state.loaded,
        loadPreferences: state.loadPreferences,
        setShowPreferencesDialog: state.setShowPreferencesDialog,
        showPreferencesDialog: state.showPreferencesDialog,
        privacy: state.privacy,
        updatePreferences: state.updatePreferences,
    }))

    useEffect(() => {
        if (!loaded) {
            loadPreferences()
        }
    }, [loaded])

    const onAccept = useCallback(() => {
        updatePreferences({
            privacy: {
                acceptedPrivacyNotesOn:
                    Temporal.Now.zonedDateTimeISO("UTC").epochMilliseconds,
                enabledCookies: {
                    session: true,
                },
            },
        })
    }, [])

    const onOpenDialog = useCallback(() => {
        setShowPreferencesDialog(true)
    }, [showPreferencesDialog])

    const onCloseDialog = useCallback(() => {
        setShowPreferencesDialog(false)
    }, [showPreferencesDialog])

    const onDecline = useCallback(() => {
        updatePreferences({
            privacy: {
                acceptedPrivacyNotesOn: false,
                enabledCookies: {
                    session: false,
                },
            },
        })
    }, [])

    if (!loaded) {
        return null
    }

    if (showPreferencesDialog) {
        return <PrivacyConsentDialog onClose={onCloseDialog} />
    }

    if (
        privacy?.acceptedPrivacyNotesOn !== undefined &&
        (privacy?.acceptedPrivacyNotesOn === false ||
            privacyLastUpdate <= privacy.acceptedPrivacyNotesOn)
    ) {
        // Already decided
        return null
    }

    return (
        <Paper
            className={`${styles.consentBar} ${sticky ? styles.sticky : ""}`}
            noPadding
            themeColor={themeColor}
            themeColorVariant={themeColorVariant}
        >
            <Paper breakpoint="normal" noPadding>
                <Flex
                    breakpoint="small"
                    direction="column"
                    justify="space-between"
                    gap={1}
                    normal={{
                        breakpoint: undefined,
                        direction: "row",
                    }}
                >
                    <p>
                        Wenn Sie unsere Website besuchen, stimmen Sie unserer{" "}
                        <Link href="/datenschutz">
                            Datenschutz-
                            <wbr />
                            Erklärung
                        </Link>{" "}
                        zu.
                        <RequiresFeatureFlag flags={["optional-cookies"]}>
                            {" "}
                            Außerdem verwenden wir Cookies.
                        </RequiresFeatureFlag>
                    </p>
                    <Flex
                        breakpoint="tiny"
                        direction="column"
                        justify="flex-start"
                        alignItems="stretch"
                        columnGap={1}
                        small={{
                            direction: "row",
                            justify: "flex-end",
                            alignItems: "center",
                        }}
                    >
                        <RequiresFeatureFlag
                            flags={["optional-cookies"]}
                            fallback={
                                <Button
                                    onClick={onAccept}
                                    themeColor={
                                        themeColor === "primary"
                                            ? "secondary"
                                            : themeColor === "secondary"
                                              ? "primary"
                                              : "accent"
                                    }
                                    type="submit"
                                >
                                    Ok
                                </Button>
                            }
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
                                Alle&nbsp;akzeptieren
                            </Button>
                            <Button
                                onClick={onOpenDialog}
                                themeColor={themeColor}
                                variant="contained"
                            >
                                Konfigurieren
                            </Button>
                            <Button
                                onClick={onDecline}
                                themeColor={themeColor}
                                variant="contained"
                            >
                                Ablehnen
                            </Button>
                        </RequiresFeatureFlag>
                    </Flex>
                </Flex>
            </Paper>
        </Paper>
    )
}
