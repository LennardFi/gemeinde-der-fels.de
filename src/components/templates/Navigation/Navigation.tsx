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

export interface NavigationProps {
    id?: string
    inRootLayout?: boolean
    sticky?: boolean
}

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
                // requiresAllDevFeatureFlag: ["mediaPlayer"],
            },
        ],
    },
    {
        label: "Veranstaltungen",
        path: "/veranstaltungen",
        subEntries: [
            {
                label: "Gottesdienst",
                path: "/veranstaltungen/gottesdienst",
            },
            {
                label: "Gebetsabend",
                path: "/veranstaltungen/gebetsabend",
            },
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
        label: "Spenden",
        path: "/spenden",
    },
    {
        label: "Verwaltung",
        needsAuth: true,
        path: "/admin",
        requiresAllDevFeatureFlag: ["admin", "login"],
        requireOneUserFlag: [
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
                requiresAllDevFeatureFlag: ["admin", "login"],
                requireOneUserFlag: ["ManageNews"],
            },
            {
                label: "Predigten",
                path: "/admin/inhalte/predigten",
                requiresAllDevFeatureFlag: ["admin", "login"],
                requireOneUserFlag: ["ManageSermons"],
            },
            {
                label: "Benutzereinstellungen",
                path: "/admin/einstellungen/benutzer",
                requiresAllDevFeatureFlag: ["admin", "login"],
                requireOneUserFlag: ["ManageUser"],
            },
        ],
    },
    {
        label: "Mitglieder",
        needsAuth: true,
        path: "/intern",
        requiresAllDevFeatureFlag: ["login"],
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

const disabledOnRoutes: string[] = ["/"]

export default function Navigation({
    id,
    inRootLayout,
    sticky,
}: NavigationProps) {
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

    if (inRootLayout && disabledOnRoutes.includes(pathName)) {
        return null
    }

    return (
        <>
            <header
                className={`${styles.header} ${sticky ? styles.sticky : ""}`}
                id={id}
            >
                <Link className={styles.logoContainer} href="/">
                    <Image
                        alt="Profile Picture"
                        className={styles.logo}
                        height={64}
                        src={Aufmacher}
                        priority
                    />
                </Link>

                {/* <h1 className={styles.title}>Gemeinde Der&nbsp;Fels</h1> */}

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
                            ({ label, path, ...entry }, i) => (
                                <NavigationItem
                                    className={
                                        entry.onlyMobile
                                            ? styles.onlyMobile
                                            : ""
                                    }
                                    path={path}
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
