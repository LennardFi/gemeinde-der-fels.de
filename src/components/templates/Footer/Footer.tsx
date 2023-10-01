"use client"

import useAuthZustand from "@/zustand/useAuthZustand"
import Link from "next/link"
import styles from "./Footer.module.scss"

const Footer = () => {
    const jwt = useAuthZustand((state) => state.jwt)

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <ul className={styles.links}>
                    <li>
                        <Link href="/datenschutz">Datenschutzerklärung</Link>
                    </li>
                    <li>
                        <Link href="/impressum">Impressum</Link>
                    </li>
                </ul>
                <ul className={styles.links}>
                    <li>
                        <h3>Für Mitglieder:</h3>
                    </li>
                    <li>
                        {jwt === undefined ? (
                            <Link href="/login">Anmelden</Link>
                        ) : (
                            <Link href="/intern">Mitgliederbereich</Link>
                        )}
                    </li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer
