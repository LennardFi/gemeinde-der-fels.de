import Window from "@/components/surfaces/window/Window"
import WindowContent from "@/components/surfaces/window/WindowContent"
import WindowHeader from "@/components/surfaces/window/WindowHeader"
import styles from "./page.module.scss"

export default function Page() {
    return (
        <Window breakpoint="large" className={styles.card} pageContainer>
            <WindowHeader title="Verwaltung" />
            <WindowContent className={styles.container}>
                <h2>Predigten</h2>
            </WindowContent>
        </Window>
    )
}
