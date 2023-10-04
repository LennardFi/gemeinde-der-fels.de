"use client"

import Card from "@/components/surfaces/cards/Card"
import CardContent from "@/components/surfaces/cards/CardContent"
import CardHeader from "@/components/surfaces/cards/CardHeader"
import styles from "./page.module.scss"

export default function Page() {
    return (
        <Card breakpoint="normal" className={styles.card}>
            <CardHeader title="Mitgliederbereich" />
            <CardContent className={styles.container}>
                <h2>Mein Konto</h2>
            </CardContent>
        </Card>
    )
}
