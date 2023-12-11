"use client"

import RequiresFeatureFlag from "@/components/dev/RequiresDevFeatureFlag"
import useAuthZustand from "@/zustand/useAuthZustand"
import Link from "next/link"
import { FaYoutube } from "react-icons/fa"
import styles from "./Footer.module.scss"

export default function Footer() {
    const jwt = useAuthZustand((state) => state.jwt)

    return (
        <footer className={styles.footer}>
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <h3>Rechtliches</h3>
                    <ul className={styles.links}>
                        <li>
                            <Link href="/datenschutz">
                                Datenschutzerklärung
                            </Link>
                        </li>
                        <li>
                            <Link href="/impressum">Impressum</Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.container}>
                    <h3>Unterstützung</h3>
                    <ul className={styles.links}>
                        <li>
                            <Link href="/spenden">Spenden</Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.container}>
                    <h3>Social Media</h3>
                    <ul className={styles.links}>
                        <li>
                            <Link
                                href="https://www.youtube.com/@gemeindederfels7523"
                                rel="noreferrer noopener"
                                target="_blank"
                            >
                                <FaYoutube style={{ height: 24, width: 24 }} />
                            </Link>
                        </li>
                    </ul>
                </div>
                <RequiresFeatureFlag flags={["internArea"]}>
                    <div className={styles.container}>
                        <h3>Für Mitglieder</h3>
                        <ul className={styles.links}>
                            <li>
                                {jwt === undefined ? (
                                    <Link href="/login">Anmelden</Link>
                                ) : (
                                    <Link href="/intern">
                                        Mitgliederbereich
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </RequiresFeatureFlag>
            </div>
            <div className={styles.copyrightNotice}>
                © 2023 Gemeinde der Fels
            </div>
        </footer>
    )
}
