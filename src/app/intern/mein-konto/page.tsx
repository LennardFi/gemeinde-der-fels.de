"use client"

import Flex from "@/components/containers/Flex"
import RequiresDevMode from "@/components/dev/RequiresDevMode"
import Button from "@/components/inputs/Button"
import ButtonLink from "@/components/inputs/ButtonLink"
import Accordion from "@/components/surfaces/accordion/Accordion"
import Window from "@/components/surfaces/window/Window"
import WindowContent from "@/components/surfaces/window/WindowContent"
import WindowHeader from "@/components/surfaces/window/WindowHeader"
import { tooltipOpenDelay } from "@/lib/frontend/constants"
import theme from "@/lib/frontend/theme"
import { returnToPathParamName } from "@/lib/shared/urlParams"
import Website, { Maybe } from "@/typings"
import useAuthZustand from "@/zustand/useAuthZustand"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useId, useState } from "react"
import {
    FaCheckSquare,
    FaMinusSquare,
    FaSignOutAlt,
    FaTh,
    FaUserEdit,
} from "react-icons/fa"
import { Tooltip } from "react-tooltip"
import styles from "./page.module.scss"

const userFlagLabelContentDictionary: Record<
    keyof Website.Users.UserFlags,
    { label: string; description: string }
> = {
    ManageCalendar: {
        label: "Kalender bearbeiten",
        description:
            "Nur Benutzer mit dieser Berechtigung können den Kalender bearbeiten.",
    },
    ManageNews: {
        label: "News erstellen und bearbeiten",
        description:
            "Diese Berechtigung ermöglicht es, neue Einträge auf der News-Seite zu erstellen, bearbeiten und vorhandene zu löschen. ",
    },
    ManageRooms: {
        label: "Räume verwalten",
        description:
            "Ermöglicht Benutzern die Verwaltung von Räumen. Dazu zählt die Erstellung, Bearbeitung und Löschung von Räumen.",
    },
    ManageSermons: {
        label: "Predigten verwalten",
        description:
            "Ermöglicht Benutzern den Upload, die Bearbeitung und Löschung von Predigten.",
    },
    ManageUser: {
        label: "Benutzer verwalten",
        description:
            "Benutzer mit dieser Berechtigung können neue Benutzer erstellen, vorhandene bearbeiten oder sperren. Außerdem können hiermit Benutzer gelöscht werden und die Berechtigungen von Benutzern verwaltet werden. Diese Berechtigung reicht nicht aus, um Benutzern Administratoren-Rechte zu geben.",
    },
    Admin: {
        label: "Administrator-Rechte",
        description:
            "Benutzer mit dieser Berechtigung können anderen Benutzern Administratoren-Rechte geben und diverse sensible Einstellungen der Website ändern. Diese Berechtigung sollten nur sehr wenige Benutzer haben.",
    },
}

export default function Page() {
    const tooltipId = useId()
    const pathname = usePathname()
    const user = useAuthZustand((state) => state.user)
    const router = useRouter()

    const [openedUserFlag, setOpenedUserFlag] =
        useState<Maybe<keyof Website.Users.UserFlags>>(undefined)

    const redirectToInternPage = useCallback(() => {
        router.push("/intern")
    }, [])

    const logout = useCallback(() => {
        router.push("/logout")
    }, [])

    return (
        <>
            <Window breakpoint="normal" className={styles.card} pageContainer>
                <WindowHeader
                    title="Mein Konto"
                    leftSegment={<FaTh />}
                    leftSegmentAction={redirectToInternPage}
                    leftSegmentToolTip="Zum Mitgliederbereich"
                    rightSegment={<FaSignOutAlt />}
                    rightSegmentToolTip="Abmelden"
                    rightSegmentAction={logout}
                />
                <WindowContent className={styles.container}>
                    <Flex
                        direction="column"
                        justify="flex-start"
                        alignItems="stretch"
                        gap={5}
                    >
                        <Flex direction="column" justify="flex-start">
                            <h2>Mein Konto</h2>
                            <Flex
                                direction="column"
                                justify="flex-start"
                                gap={1}
                                breakpoint="tiny"
                            >
                                <Button
                                    leftSegment={<FaUserEdit />}
                                    variant="outlined"
                                >
                                    Konto-Daten ändern
                                </Button>
                                <ButtonLink
                                    href={`/change-password?${new URLSearchParams(
                                        {
                                            [returnToPathParamName]: pathname,
                                        },
                                    ).toString()}`}
                                    variant="outlined"
                                >
                                    Passwort ändern
                                </ButtonLink>
                            </Flex>
                        </Flex>
                        <RequiresDevMode>
                            <Flex direction="column" justify="flex-start">
                                <h2>Berechtigungen</h2>
                                <Flex
                                    direction="column"
                                    justify="flex-start"
                                    alignItems="stretch"
                                    breakpoint="small"
                                    max
                                >
                                    {(
                                        Object.keys(
                                            userFlagLabelContentDictionary,
                                        ) as (keyof Website.Users.UserFlags)[]
                                    ).map((userFlag) => (
                                        <Accordion
                                            themeColor="accent"
                                            key={userFlag}
                                            icon={
                                                user?.flags[userFlag] ? (
                                                    <FaCheckSquare
                                                        color={
                                                            theme.primary
                                                                .default
                                                        }
                                                        data-tooltip-id={
                                                            tooltipId
                                                        }
                                                        data-tooltip-content="Aktiv"
                                                    />
                                                ) : (
                                                    <FaMinusSquare
                                                        color={
                                                            theme.secondary
                                                                .default
                                                        }
                                                        data-tooltip-id={
                                                            tooltipId
                                                        }
                                                        data-tooltip-content="Nicht aktiv"
                                                    />
                                                )
                                            }
                                            open={openedUserFlag === userFlag}
                                            onOpen={(open) =>
                                                setOpenedUserFlag(
                                                    open ? userFlag : undefined,
                                                )
                                            }
                                            summary={
                                                userFlagLabelContentDictionary[
                                                    userFlag
                                                ].label
                                            }
                                        >
                                            {
                                                userFlagLabelContentDictionary[
                                                    userFlag
                                                ].description
                                            }
                                        </Accordion>
                                    ))}
                                </Flex>
                            </Flex>
                        </RequiresDevMode>
                    </Flex>
                </WindowContent>
            </Window>

            <Tooltip
                delayShow={tooltipOpenDelay}
                id={tooltipId}
                place="top"
                variant="dark"
            />
        </>
    )
}
