"use client"

import Dialog, { DialogProps } from "@/components/containers/Dialog"
import Flex from "@/components/containers/Flex"
import Button from "@/components/inputs/Button"
import Checkbox from "@/components/inputs/Checkbox"
import Paper from "@/components/surfaces/Paper"
import Accordion from "@/components/surfaces/accordion/Accordion"
import Website, { Maybe } from "@/typings"
import useUserPreferencesZustand from "@/zustand/useUserPreferencesZustand"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { Temporal } from "temporal-polyfill"
import styles from "./PrivacyConsentDialog.module.scss"

export type PrivacyConsentDialogProps = Omit<DialogProps, "title">

export default function PrivacyConsentDialog({
    onClose,
    ...rest
}: PrivacyConsentDialogProps) {
    const [openedAccordion, setOpenedAccordion] = useState(0)
    const pathName = usePathname()
    const initialPathNameRef = useRef(pathName)
    const {
        loaded,
        loadPreferences,
        privacy,
        setShowPreferencesDialog,
        updatePreferences,
    } = useUserPreferencesZustand((state) => ({
        loaded: state.loaded,
        loadPreferences: state.loadPreferences,
        privacy: state.privacy,
        setShowPreferencesDialog: state.setShowPreferencesDialog,
        updatePreferences: state.updatePreferences,
    }))
    const [newPrivacyPreferences, setNewPrivacyPreferences] =
        useState<Maybe<Website.UserPreferences.PrivacyPreferences>>(privacy)

    useEffect(() => {
        if (!loaded) {
            loadPreferences()
            return
        }

        setNewPrivacyPreferences(privacy)
    }, [loaded])

    useEffect(() => {
        if (initialPathNameRef.current !== pathName) {
            setShowPreferencesDialog(false)
        }
    }, [pathName])

    if (!loaded) {
        return null
    }

    const onAllowAll = useCallback(
        () =>
            setNewPrivacyPreferences((prev) => ({
                ...prev,
                acceptedPrivacyNotesOn:
                    Temporal.Now.zonedDateTimeISO("UTC").epochMilliseconds,
                allowCookies: true,
                enabledCookies: {
                    preferences: true,
                    session: true,
                },
            })),
        [],
    )

    const onDisallowAll = useCallback(
        () =>
            setNewPrivacyPreferences((prev) => ({
                ...prev,
                acceptedPrivacyNotesOn: undefined,
                allowCookies: false,
                enabledCookies: {
                    preferences: false,
                    session: false,
                },
            })),
        [],
    )

    const onReset = useCallback(() => {
        setNewPrivacyPreferences(privacy)
    }, [])

    const onSave = useCallback(() => {
        updatePreferences({
            privacy: {
                acceptedPrivacyNotesOn:
                    newPrivacyPreferences?.acceptedPrivacyNotesOn,
                enabledCookies:
                    newPrivacyPreferences?.acceptedPrivacyNotesOn === undefined
                        ? {
                              session: false,
                          }
                        : newPrivacyPreferences.enabledCookies,
            },
        })
        onClose?.()
    }, [])

    return (
        <Dialog
            className={`${styles.dialog}`}
            onClose={onClose}
            title="Datenschutz-Einstellungen"
            {...rest}
        >
            <form
                onReset={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onReset()
                }}
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onSave()
                }}
            >
                <Paper>
                    <Accordion
                        icon={<Checkbox checked disabled />}
                        open={openedAccordion === 0}
                        onOpen={(open) => setOpenedAccordion(open ? 0 : -1)}
                        summary="Erforderliche Zwecke"
                    >
                        <p>
                            Verwendet Cookies und speichert Daten auf dem
                            Server, die für die Funktionalität der Website
                            notwendig sind. Welche Cookies und Daten dabei
                            gespeichert werden können Sie in unserer{" "}
                            <Link
                                href="/datenschutz"
                                onClick={() => {
                                    setShowPreferencesDialog(false)
                                }}
                            >
                                Datenschutzerklärung
                            </Link>{" "}
                            nachlesen.
                        </p>
                    </Accordion>
                </Paper>
                <Flex justify="flex-end" columnGap={1}>
                    <Button onClick={onClose} variant="text">
                        Abbrechen
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onSave()
                        }}
                        type="submit"
                    >
                        Speichern
                    </Button>
                </Flex>
            </form>
        </Dialog>
    )
}
