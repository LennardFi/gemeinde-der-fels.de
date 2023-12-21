"use client"

import Flex from "@/components/containers/Flex"
import Button from "@/components/inputs/Button"
import ButtonLink from "@/components/inputs/ButtonLink"
import Checkbox from "@/components/inputs/Checkbox"
import Paper from "@/components/surfaces/Paper"
import Dialog, { DialogProps } from "@/components/surfaces/dialog/Dialog"
import Website, { Maybe } from "@/typings"
import useUserPreferencesZustand from "@/zustand/useUserPreferencesZustand"
import { useEffect, useState } from "react"
import { Temporal } from "temporal-polyfill"
import styles from "./PrivacyConsentDialog.module.scss"

export type PrivacyConsentDialogProps = Omit<DialogProps, "title">

export default function PrivacyConsentDialog({
    onClose,
    ...rest
}: PrivacyConsentDialogProps) {
    const { loaded, loadPreferences, privacy, updatePreferences } =
        useUserPreferencesZustand((state) => ({
            loaded: state.loaded,
            loadPreferences: state.loadPreferences,
            privacy: state.privacy,
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

    if (!loaded) {
        return null
    }

    const onReset = () => {
        setNewPrivacyPreferences(privacy)
    }

    const onSave = () => {
        updatePreferences({
            privacy: {
                acceptedPrivacyNotesOn:
                    newPrivacyPreferences?.acceptedPrivacyNotesOn,
                allowCookies: newPrivacyPreferences?.allowCookies,
                enabledCookies: !newPrivacyPreferences?.allowCookies
                    ? {
                          preferences: false,
                          session: false,
                      }
                    : newPrivacyPreferences.enabledCookies,
            },
        })
        onClose?.()
    }

    const onAllowAll = () =>
        setNewPrivacyPreferences((prev) => ({
            ...prev,
            acceptedPrivacyNotesOn:
                Temporal.Now.zonedDateTimeISO("UTC").epochMilliseconds,
            allowCookies: true,
            enabledCookies: {
                preferences: true,
                session: true,
            },
        }))

    const onDisallowAll = () =>
        setNewPrivacyPreferences((prev) => ({
            ...prev,
            acceptedPrivacyNotesOn: undefined,
            allowCookies: false,
            enabledCookies: {
                preferences: false,
                session: false,
            },
        }))

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
                <Flex>
                    <Button fontColor onClick={onAllowAll} variant="contained">
                        Alle erlauben
                    </Button>
                    <Button
                        fontColor
                        onClick={onDisallowAll}
                        variant="contained"
                    >
                        Alle verbieten
                    </Button>
                </Flex>
                <h4>Datenschutzerklärung</h4>
                <fieldset>
                    <Paper noPadding>
                        <Checkbox
                            checked={
                                newPrivacyPreferences?.acceptedPrivacyNotesOn !==
                                undefined
                            }
                            className={styles.checkboxLabel}
                            label="Datenschutzbestimmung erlauben"
                            description="Erlaubt der Website Cookies auf dem Gerät zu speichern."
                            onChange={(e) => {
                                setNewPrivacyPreferences((prev) => ({
                                    ...prev,
                                    acceptedPrivacyNotesOn: e.target.checked
                                        ? Temporal.Now.zonedDateTimeISO("UTC")
                                              .epochMilliseconds
                                        : undefined,
                                }))
                            }}
                        />
                        <Paper>
                            <Flex justify="flex-start">
                                <ButtonLink
                                    href="/datenschutz"
                                    variant="contained"
                                >
                                    Datenschutzerklärung anzeigen
                                </ButtonLink>
                            </Flex>
                        </Paper>
                    </Paper>
                </fieldset>
                {/* <Divider variant="container" themeColor="transparent" /> */}
                <h4>Cookies</h4>
                <h5>Erforderliche Cookies</h5>
                <Flex direction="column">
                    <fieldset>
                        <Paper noPadding>
                            <Checkbox
                                checked={
                                    newPrivacyPreferences?.allowCookies ?? false
                                }
                                className={styles.checkboxLabel}
                                label="Cookies erlauben"
                                description="Erlaubt der Website Cookies auf dem Gerät zu speichern."
                                onChange={(e) => {
                                    setNewPrivacyPreferences((prev) => ({
                                        ...prev,
                                        allowCookies: e.target.checked,
                                    }))
                                }}
                            />
                        </Paper>
                    </fieldset>
                    <fieldset>
                        <Paper>
                            <Checkbox
                                checked={
                                    newPrivacyPreferences?.enabledCookies
                                        ?.preferences ?? false
                                }
                                className={styles.checkboxLabel}
                                disabled={!newPrivacyPreferences?.allowCookies}
                                label="Einstellungen"
                                description="Erlaubt der Website Benutzereinstellungen auf dem Gerät zu speichern."
                                onChange={(e) => {
                                    setNewPrivacyPreferences((prev) => ({
                                        ...prev,
                                        enabledCookies: {
                                            ...prev?.enabledCookies,
                                            preferences: e.target.checked,
                                        },
                                    }))
                                }}
                            />
                        </Paper>
                    </fieldset>
                    <fieldset>
                        <Paper>
                            <Checkbox
                                checked={
                                    newPrivacyPreferences?.enabledCookies
                                        ?.session ?? false
                                }
                                className={styles.checkboxLabel}
                                disabled={!newPrivacyPreferences?.allowCookies}
                                label="Sitzung"
                                description="Sitzungsdaten für angemeldete Benutzer speichern."
                                onChange={(e) => {
                                    setNewPrivacyPreferences((prev) => ({
                                        ...prev,
                                        enabledCookies: {
                                            ...prev?.enabledCookies,
                                            session: e.target.checked,
                                        },
                                    }))
                                }}
                            />
                        </Paper>
                    </fieldset>
                </Flex>
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
