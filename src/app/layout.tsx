import "../styles/normalize.css"

import "../styles/globals.scss"

import Window from "@/components/surfaces/window/Window"
import WindowContent from "@/components/surfaces/window/WindowContent"
import WindowHeader from "@/components/surfaces/window/WindowHeader"
import Footer from "@/components/templates/Footer/Footer"
import Navigation from "@/components/templates/Navigation/Navigation"
import PrivacyConsentBar from "@/components/templates/PrivacyConsent/PrivacyConsentBar"
import { Metadata } from "next"
import { Montserrat } from "next/font/google"
import React from "react"
import { FaExclamationTriangle } from "react-icons/fa"
import styles from "./layout.module.scss"

interface IndexLayoutProps {
    children?: React.ReactNode
}

export const metadata: Metadata = {
    title: "Gemeinde der Fels",
}

const headerFont = Montserrat({
    subsets: ["latin"],
})

export default function Layout({ children }: IndexLayoutProps) {
    return (
        <html
            style={
                {
                    // backgroundImage: `url(${backgroundImage.blurDataURL})`,
                    // background: "white",
                }
            }
        >
            <head>
                <meta title="Gemeinde der Fels" />
                <link
                    rel="shortcut icon"
                    href="/favicon.ico"
                    type="image/x-icon"
                />
            </head>
            <body className={`${styles.body} ${headerFont.className}`}>
                <Navigation inRootLayout />
                <main>{children}</main>
                <Footer />
                <PrivacyConsentBar inRootLayout />
                <noscript>
                    <div className={styles.noScriptContainer}>
                        <div className={styles.noScriptWrapper}>
                            <Window
                                breakpoint="small"
                                className={styles.noScriptWindow}
                                pageContainer
                            >
                                <WindowHeader
                                    title="JavaScript nicht erlaubt"
                                    icon={<FaExclamationTriangle />}
                                />
                                <WindowContent>
                                    <p>
                                        Aktuell wird die Ausführung von
                                        JavaScript durch den Browser verhindert.
                                        Diese Website braucht jedoch JavaScript
                                        um korrekt dargestellt zu werden.
                                        Schalte dies deshalb im Browser bitte
                                        ein.
                                    </p>
                                </WindowContent>
                            </Window>
                        </div>
                    </div>
                </noscript>
            </body>
        </html>
    )
}
