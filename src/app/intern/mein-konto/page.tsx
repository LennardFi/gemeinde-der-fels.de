"use client"

import RequiresDevMode from "@/components/dev/RequiresDevMode"
import ButtonLink from "@/components/inputs/ButtonLink"
import Window from "@/components/surfaces/window/Window"
import WindowContent from "@/components/surfaces/window/WindowContent"
import WindowHeader from "@/components/surfaces/window/WindowHeader"
import { returnToPathParamName } from "@/lib/frontend/urlParams"
import useAuthZustand from "@/zustand/useAuthZustand"
import { usePathname } from "next/navigation"
import { FaCheckSquare, FaMinusSquare } from "react-icons/fa"
import styles from "./page.module.scss"

export default function Page() {
    const pathname = usePathname()
    const user = useAuthZustand((state) => state.user)

    return (
        <Window breakpoint="normal" className={styles.card} pageContainer>
            <WindowHeader title="Mitgliederbereich" />
            <WindowContent className={styles.container}>
                <h2>Mein Konto</h2>
                <ButtonLink
                    href={`/change-password?${new URLSearchParams({
                        [returnToPathParamName]: pathname,
                    }).toString()}`}
                    variant="contained"
                >
                    Passwort zurücksetzen
                </ButtonLink>
                <RequiresDevMode>
                    <h3>User Flags:</h3>
                    <table className={`${styles.flagTable}`}>
                        <thead>
                            <tr>
                                <th>Flag</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(user?.flags ?? {}).map(
                                ([flag, value]) => (
                                    <tr key={flag}>
                                        <td>{flag}</td>
                                        <td>
                                            {value ? (
                                                <FaCheckSquare color="teal" />
                                            ) : (
                                                <FaMinusSquare color="red" />
                                            )}
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                </RequiresDevMode>
            </WindowContent>
        </Window>
    )
}
