import Window from "@/components/surfaces/window/Window"
import WindowContent from "@/components/surfaces/window/WindowContent"
import WindowHeader from "@/components/surfaces/window/WindowHeader"
import Link from "next/link"
import styles from "./page.module.scss"

export default function Page() {
    return (
        <Window breakpoint="normal" className={styles.card}>
            <WindowHeader title="Verwaltung" />
            <WindowContent className={styles.container}>
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
            </WindowContent>
        </Window>
    )
}
