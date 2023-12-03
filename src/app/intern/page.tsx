"use client"

import RequiresFeatureFlag from "@/components/dev/RequiresDevFeatureFlag"
import Window from "@/components/surfaces/window/Window"
import WindowContent from "@/components/surfaces/window/WindowContent"
import WindowHeader from "@/components/surfaces/window/WindowHeader"
import NextAppointmentsCalendar from "@/components/templates/Calendar/NextAppointmentsCalendar"
import Link from "next/link"
import styles from "./page.module.scss"

export default function Page() {
    return (
        <>
            {/* <div className={styles.container}> */}
            {/* <h2>Mitgliederbereich</h2> */}
            {/* {user !== undefined ? <p>Hallo {user.userName}.</p> : null} */}
            <Window breakpoint="normal" className={styles.card} pageContainer>
                <WindowHeader title="Mitgliederbereich" />
                <WindowContent className={styles.container}>
                    <div className={styles.navigation}>
                        <h3>Navigation</h3>
                        <Link href="/intern/mein-konto">Mein Konto</Link>
                        <RequiresFeatureFlag flags={["internArea", "news"]}>
                            <Link href="/intern/content/news">News</Link>
                        </RequiresFeatureFlag>
                    </div>
                    <RequiresFeatureFlag flags={["calendar"]}>
                        <div>
                            <h2>Termine</h2>
                            <NextAppointmentsCalendar />
                        </div>
                    </RequiresFeatureFlag>
                </WindowContent>
            </Window>
            {/* </div> */}
        </>
    )
}
