import Window from "@/components/surfaces/window/Window"
import WindowContent from "@/components/surfaces/window/WindowContent"
import WindowHeader from "@/components/surfaces/window/WindowHeader"
import styles from "./page.module.scss"

export default function Page() {
    return (
        <Window breakpoint="normal" className={styles.card}>
            <WindowHeader title="Verwaltung" />
            <WindowContent className={styles.container}>
                <h2>News</h2>
            </WindowContent>
        </Window>
    )
}
