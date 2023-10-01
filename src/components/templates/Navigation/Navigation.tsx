"use client"

import useAuthZustand from "@/zustand/useAuthZustand"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { TfiClose, TfiMenu } from "react-icons/tfi"
import Aufmacher from "../../../media/Aufmacher.jpg"
import Website from "../../../typings"
import styles from "./Navigation.module.scss"
import NavigationItem from "./NavigationItem"

export interface NavigationProps {}

const navigationEntries: Website.Content.Navigation.NavigationEntry[] = [
    {
        label: "Startseite",
        path: "/",
        onlyMobile: true,
    },
    {
        label: "Medien",
        path: "/medien",
    },
    {
        label: "Über uns",
        path: "/ueber-uns",
    },
    {
        label: "Gruppen",
        subEntries: [
            {
                label: "Young Generation",
                path: "/group/young-generation",
            },
        ],
    },
    {
        label: "Kontakt",
        path: "/kontakt",
    },
    {
        label: "Mitgliederbereich",
        needsAuth: true,
        path: "/intern",
        subEntries: [
            {
                label: "Mein Konto",
                path: "/intern/mein-konto",
            },
            {
                label: "News",
                path: "/intern/inhalte/news",
                requiresFlag: "ManageNews",
            },
            {
                label: "Predigten",
                path: "/intern/inhalte/predigten",
                requiresFlag: "ManageSermons",
            },
            {
                label: "Verwaltung",
                path: "/intern/admin",
                requiresFlag: "Admin",
            },
            {
                label: "Abmelden",
                path: "/logout",
            },
        ],
    },
]

const Navigation = () => {
    const pathName = usePathname()
    const [showMenu, setShowMenu] = useState(false)
    const jwt = useAuthZustand((state) => state.jwt)
    const loadJWTFromCookie = useAuthZustand((state) => state.loadJWTFromCookie)
    const updateUser = useAuthZustand((state) => state.updateUser)

    useEffect(() => {
        loadJWTFromCookie()
    }, [])

    useEffect(() => {
        if (jwt !== undefined) {
            void updateUser()
        }
    }, [jwt])

    useEffect(() => {
        setShowMenu(false)
    }, [pathName])

    return (
        <header className={`${styles.header} ${showMenu ? styles.show : ""}`}>
            <Link className={styles.logoContainer} href="/">
                <Image
                    alt="Profile Picture"
                    className={styles.logo}
                    height={64}
                    src={Aufmacher}
                />
            </Link>

            <h1 className={styles.title}>Gemeinde Der&nbsp;Fels</h1>

            <button
                className={styles.menuSwitch}
                onClick={() => setShowMenu((prev) => !prev)}
                type="button"
            >
                {showMenu ? <TfiClose /> : <TfiMenu />}
            </button>

            <nav className={`${styles.nav}`}>
                <ul className={`${styles.menu}`}>
                    {navigationEntries.map(
                        (
                            { label, needsAuth, path, subEntries, ...entry },
                            i,
                        ) => {
                            if (needsAuth && jwt === undefined) {
                                return undefined
                            }

                            return (
                                <NavigationItem
                                    className={
                                        entry.onlyMobile
                                            ? styles.onlyMobile
                                            : ""
                                    }
                                    path={path}
                                    subEntries={subEntries}
                                    key={`${i}_${path}`}
                                    {...entry}
                                >
                                    {label}
                                </NavigationItem>
                            )
                        },
                    )}
                </ul>
            </nav>
        </header>
    )
}

export default Navigation
