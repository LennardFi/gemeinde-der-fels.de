"use client"

import Card from "@/components/surfaces/cards/Card"
import CardContent from "@/components/surfaces/cards/CardContent"
import CardHeader from "@/components/surfaces/cards/CardHeader"
import NextAppointmentsCalendar from "@/components/templates/Calendar/NextAppointmentsCalendar"
import useAuthZustand from "@/zustand/useAuthZustand"
import Link from "next/link"
import { useRouter } from "next/navigation"
import styles from "./page.module.scss"

export default function Page() {
    const router = useRouter()
    const logout = useAuthZustand((state) => state.logout)
    const user = useAuthZustand((state) => state.user)

    const logoutAndReload = async () => {
        await logout()
        router.refresh()
    }

    return (
        <div className={styles.container}>
            {/* <h2>Mitgliederbereich</h2> */}
            {/* {user !== undefined ? <p>Hallo {user.userName}.</p> : null} */}
            <Card breakpoint="normal" className={styles.card}>
                <CardHeader title="Mitgliederbereich" />
                <CardContent className={styles.container}>
                    <div className={styles.navigation}>
                        <h3>Navigation</h3>
                        <Link href="/intern/mein-konto">Mein Konto</Link>
                        <Link href="/intern/content/news">News</Link>
                        {/* <Button onClick={logoutAndReload} variant="contained">
                            Logout
                        </Button> */}
                    </div>
                    <div>
                        <h2>Termine</h2>
                        <NextAppointmentsCalendar />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
