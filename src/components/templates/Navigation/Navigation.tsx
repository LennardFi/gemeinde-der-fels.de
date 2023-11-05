"use client"

import Button from "@/components/inputs/Button"
import useAuthZustand from "@/zustand/useAuthZustand"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { TfiMenu } from "react-icons/tfi"
import Aufmacher from "../../../media/Aufmacher.jpg"
import Website from "../../../typings"
import styles from "./Navigation.module.scss"
import NavigationDrawer from "./NavigationDrawer"
import NavigationItem from "./NavigationItem"

export const navigationEntries: Website.Content.Navigation.NavigationEntry[] = [
    {
        label: "Startseite",
        path: "/",
        onlyMobile: true,
    },
    {
        label: "Audio",
        path: "/medien",
        subEntries: [
            {
                label: "Lobpreis",
                path: "/medien/lobpreis",
            },
            {
                label: "Hopful auf YouTube",
                path: "/medien/hopeful-yt",
            },
            {
                label: "Predigten",
                path: "/medien/predigten",
            },
        ],
    },
    {
        label: "Veranstaltungen",
        path: "/veranstaltungen",
        subEntries: [
            {
                label: "Termine",
                path: "/veranstaltungen/termine",
            },
        ],
    },
    {
        label: <>Über&nbsp;uns</>,
        path: "/ueber-uns",
        subEntries: [
            {
                label: "Werte & Vision",
                path: "/ueber-uns/werte-und-vision",
            },
            {
                label: "Gemeindeleitung",
                path: "/ueber-uns/gemeindeleitung",
            },
            {
                label: "Gemeindeleben",
                path: "/ueber-uns/gemeindeleben",
            },
        ],
    },
    {
        label: "Gruppen",
        noLink: true,
        path: "/gruppen",
        subEntries: [
            {
                label: "Kindergottesdienst",
                path: "/gruppen/kigo",
            },
            {
                label: "Young Generation",
                path: "/gruppen/young-generation",
            },
            {
                label: "Männer-/Frauen-Abend",
                path: "/gruppen/maenner-frauen-abend",
            },
        ],
    },
    {
        label: "Kontakt",
        path: "/kontakt",
    },
    {
        label: "Verwaltung",
        needsAuth: true,
        path: "/admin",
        requiresFlag: [
            "Admin",
            "ManageCalendar",
            "ManageNews",
            "ManageRooms",
            "ManageSermons",
            "ManageUser",
        ],
        subEntries: [
            {
                label: "News",
                path: "/admin/inhalte/news",
                requiresFlag: ["ManageNews"],
            },
            {
                label: "Predigten",
                path: "/admin/inhalte/predigten",
                requiresFlag: ["ManageSermons"],
            },
            {
                label: "Benutzereinstellungen",
                path: "/admin/einstellungen/benutzer",
                requiresFlag: ["ManageUser"],
            },
        ],
    },
    {
        label: "Mitglieder",
        needsAuth: true,
        path: "/intern",
        subEntries: [
            {
                label: "Mein Konto",
                path: "/intern/mein-konto",
            },
            {
                label: "Abmelden",
                path: "/logout",
            },
        ],
    },
]

export default function Navigation() {
    const pathName = usePathname()
    const [navDrawerOpened, setNavDrawerOpened] = useState(false)
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
        setNavDrawerOpened(false)
    }, [pathName])

    return (
        <>
            <header className={`${styles.header}`}>
                <Link className={styles.logoContainer} href="/">
                    <Image
                        alt="Profile Picture"
                        className={styles.logo}
                        height={64}
                        src={Aufmacher}
                    />
                </Link>

                <h1 className={styles.title}>Gemeinde Der&nbsp;Fels</h1>

                <Button
                    className={styles.menuSwitch}
                    noActiveAnimation
                    onClick={() => setNavDrawerOpened((prev) => !prev)}
                    themeColor="primary"
                    variant="contained"
                >
                    <TfiMenu />
                </Button>

                <nav className={`${styles.nav}`}>
                    <ul className={`${styles.menu}`}>
                        {navigationEntries.map(
                            (
                                {
                                    label,
                                    needsAuth,
                                    path,
                                    subEntries,
                                    ...entry
                                },
                                i,
                            ) => (
                                <NavigationItem
                                    className={
                                        entry.onlyMobile
                                            ? styles.onlyMobile
                                            : ""
                                    }
                                    needsAuth={needsAuth}
                                    path={path}
                                    subEntries={subEntries}
                                    key={`${i}_${path}`}
                                    {...entry}
                                >
                                    {label}
                                </NavigationItem>
                            ),
                        )}
                    </ul>
                </nav>
            </header>
            <NavigationDrawer
                opened={navDrawerOpened}
                onClose={() => setNavDrawerOpened(false)}
            />
        </>
    )
}
