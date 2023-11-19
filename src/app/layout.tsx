import "../styles/normalize.css"

import "../styles/globals.scss"

import Window from "@/components/surfaces/window/Window"
import WindowContent from "@/components/surfaces/window/WindowContent"
import WindowHeader from "@/components/surfaces/window/WindowHeader"
import Footer from "@/components/templates/Footer/Footer"
import Navigation from "@/components/templates/Navigation/Navigation"
import { Metadata } from "next"
import { Noto_Sans } from "next/font/google"
import React from "react"
import { FaExclamationTriangle } from "react-icons/fa"
import backgroundImage from "../media/background.jpg"
import styles from "./layout.module.scss"

interface IndexLayoutProps extends React.HTMLProps<HTMLDivElement> {
    children?: React.ReactNode
}

export const metadata: Metadata = {
    title: "Gemeinde der Fels",
}

const headerFont = Noto_Sans({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export default function Layout({ children }: IndexLayoutProps) {
    return (
        <html
            style={{
                backgroundImage: `url(${backgroundImage.blurDataURL})`,
            }}
        >
            <head>
                <meta title="Gemeinde der Fels" />
                <link
                    rel="shortcut icon"
                    href="/favicon.ico"
                    type="image/x-icon"
                />
            </head>
            <body
                className={`${headerFont.className}`}
                style={{
                    backgroundImage: `url("${backgroundImage.src}"`,
                }}
            >
                <div className={styles.wrapper}>
                    <Navigation inRootLayout />
                    <main>{children}</main>
                    <Footer />
                    <noscript>
                        <div className={styles.noScriptContainer}>
                            <div className={styles.noScriptWrapper}>
                                <Window
                                    breakpoint="small"
                                    className={styles.noScriptWindow}
                                >
                                    <WindowHeader
                                        title="JavaScript nicht erlaubt"
                                        icon={<FaExclamationTriangle />}
                                    />
                                    <WindowContent>
                                        <p>
                                            Aktuell wird die Ausführung von
                                            JavaScript durch den Browser
                                            verhindert. Diese Website braucht
                                            jedoch JavaScript um korrekt
                                            dargestellt zu werden. Schalte dies
                                            deshalb im Browser bitte ein.
                                        </p>
                                    </WindowContent>
                                </Window>
                            </div>
                        </div>
                    </noscript>
                </div>
            </body>
        </html>
    )
}
