import "../styles/normalize.css"

import "../styles/globals.scss"

import Footer from "@/components/templates/Footer/Footer"
import Navigation from "@/components/templates/Navigation/Navigation"
import { Metadata } from "next"
import { Raleway } from "next/font/google"
import React from "react"

interface IndexLayoutProps extends React.HTMLProps<HTMLDivElement> {
    children?: React.ReactNode
}

export const metadata: Metadata = {
    title: "Gemeinde der Fels",
}

const headerFont = Raleway({ subsets: ["latin"] })

const Layout = ({ children }: IndexLayoutProps) => {
    return (
        <html>
            <head>
                <meta title="Gemeinde der Fels" />
                <link
                    rel="shortcut icon"
                    href="/favicon.ico"
                    type="image/x-icon"
                />
            </head>
            <body className={`${headerFont.className}`}>
                <div className="wrapper">
                    <Navigation />
                    <main>{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    )
}
export default Layout
