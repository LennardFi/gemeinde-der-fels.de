"use client"

import Window from "@/components/surfaces/window/Window"
import WindowContent from "@/components/surfaces/window/WindowContent"
import WindowHeader from "@/components/surfaces/window/WindowHeader"
import { usePathname } from "next/navigation"
import { FaTimesCircle } from "react-icons/fa"
import styles from "./not-found.module.scss"

export default function NotFound() {
    const pathName = usePathname()
    return (
        <Window pageContainer>
            <WindowHeader icon={<FaTimesCircle />} title="Nicht gefunden" />
            <WindowContent>
                <p>Die gesuchte Seite wurde nicht gefunden.</p>
                <div className={styles.searchedPageContainer}>
                    <h3 className={styles.searchedPageTitle}>
                        Gesuchte Seite:
                    </h3>
                    <pre className={styles.pathName}>
                        <code>{pathName}</code>
                    </pre>
                </div>
            </WindowContent>
        </Window>
    )
}
