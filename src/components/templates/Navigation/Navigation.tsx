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
import NavigationItemGroup from "./NavigationItemGroup"

export interface NavigationProps {}

// const navigationEntries: Website.Content.Navigation.NavigationEntry[] = [
//     {
//         label: "Startseite",
//         path: "/",
//         mobileOnline: true,
//     },
//     {
//         label: "Lobpreis",
//         path: "/lobpreis",
//     },
//     {
//         label: "Predigten",
//         path: "/predigten",
//     },
//     {
//         label: "Werte & Vision",
//         path: "/werte-und-vision",
//     },
//     {
//         label: "Kontakt",
//         path: "/kontakt",
//     },
//     {
//         label: "Anmelden",
//         path: "/anmelden",
//     },
// ]
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
        label: "Intern",
        needsAuth: true,
        path: "/intern",
        subEntries: [
            {
                label: "Interner Bereich",
                path: "/intern",
            },
            {
                label: "Mein Konto",
                path: "/intern/my-account",
            },
        ],
    },
]

const Navigation = () => {
    const pathName = usePathname()
    const [showMenu, setShowMenu] = useState(false)
    const { jwt, loadJWTFromCookie } = useAuthZustand((state) => ({
        jwt: state.jwt,
        loadJWTFromCookie: state.loadJWTFromCookie,
    }))

    useEffect(() => {
        loadJWTFromCookie()
    }, [])

    useEffect(() => {
        setShowMenu(false)
    }, [pathName])

    return (
        <header className={styles.header}>
            <Link className={styles.logoContainer} href="/">
                <Image
                    alt="Profile Picture"
                    className={styles.logo}
                    height={64}
                    src={Aufmacher}
                />
            </Link>

            <h1 className={styles.title}>Gemeinde der Fels</h1>

            <button
                className={styles.menuSwitch}
                onClick={() => setShowMenu((prev) => !prev)}
                type="button"
            >
                {showMenu ? <TfiClose /> : <TfiMenu />}
            </button>

            <nav className={`${styles.menu} ${showMenu ? styles.show : ""}`}>
                {navigationEntries.map(
                    ({ label, needsAuth, path, subEntries, ...entry }, i) => {
                        if (needsAuth && jwt === undefined) {
                            return undefined
                        }

                        if (subEntries !== undefined) {
                            return (
                                <NavigationItemGroup
                                    className={
                                        entry.onlyMobile
                                            ? styles.onlyMobile
                                            : ""
                                    }
                                    currentPage={
                                        path !== undefined &&
                                        pathName.startsWith(path)
                                    }
                                    path={path}
                                    subEntries={subEntries}
                                    key={i}
                                    {...entry}
                                >
                                    {label}
                                </NavigationItemGroup>
                            )
                        }

                        return (
                            <NavigationItem
                                className={
                                    entry.onlyMobile ? styles.onlyMobile : ""
                                }
                                currentPage={
                                    path !== undefined &&
                                    pathName.startsWith(path)
                                }
                                path={path}
                                key={i}
                                {...entry}
                            >
                                {label}
                            </NavigationItem>
                        )
                    },
                )}
            </nav>
        </header>
    )
}

export default Navigation
