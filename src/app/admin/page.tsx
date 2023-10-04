import Card from "@/components/surfaces/cards/Card"
import CardContent from "@/components/surfaces/cards/CardContent"
import CardHeader from "@/components/surfaces/cards/CardHeader"
import Link from "next/link"
import styles from "./page.module.scss"

export default function Page() {
    return (
        <Card breakpoint="normal" className={styles.card}>
            <CardHeader title="Verwaltung" />
            <CardContent className={styles.container}>
                <h2>Einstellungen</h2>
                <ul>
                    <li>
                        <Link href="/admin/einstellungen/benutzer">
                            Benutzer
                        </Link>
                    </li>
                </ul>
                <h2>Inhalte</h2>
                <ul>
                    <li>
                        <Link href="/admin/inhalte/news">News</Link>
                    </li>
                    <li>
                        <Link href="/admin/inhalte/predigten">Predigten</Link>
                    </li>
                </ul>
            </CardContent>
        </Card>
    )
}
