import Link from "next/link"
import styles from "./Footer.module.scss"

const Footer = () => {
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
                        <Link href="/login">Anmelden</Link>
                    </li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer
