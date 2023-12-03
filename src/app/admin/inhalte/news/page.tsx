import RequiresFeatureFlag from "@/components/dev/RequiresDevFeatureFlag"
import Window from "@/components/surfaces/window/Window"
import WindowContent from "@/components/surfaces/window/WindowContent"
import WindowHeader from "@/components/surfaces/window/WindowHeader"
import styles from "./page.module.scss"

export default function Page() {
    return (
        <RequiresFeatureFlag
            flags={["admin", "internArea", "news"]}
            fallback={null}
        >
            <Window breakpoint="normal" className={styles.card} pageContainer>
                <WindowHeader title="Verwaltung" />
                <WindowContent className={styles.container}>
                    <h2>News</h2>
                </WindowContent>
            </Window>
        </RequiresFeatureFlag>
    )
}
