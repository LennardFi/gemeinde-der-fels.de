"use client"

import Button from "@/components/inputs/Button"
import useAuthZustand from "@/zustand/useAuthZustand"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { TfiMenu } from "react-icons/tfi"
import Logo from "../../../media/logo-temporary.png"
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
        noLink: true,
        path: "/medien",
        subEntries: [
            {
                label: "Lobpreis",
                path: "/medien/lobpreis",
            },
            {
                label: "Hopeful auf YouTube",
                path: "/medien/hopeful-yt",
                requiresAllFeatureFlags: ["hopeful-yt"],
            },
            {
                label: "Predigten",
                path: "/medien/predigten",
                requiresAllFeatureFlags: ["mediaPlayer", "sermons"],
            },
        ],
    },
    {
        label: "Veranstaltungen",
        path: "/veranstaltungen",
        subEntries: [
            {
                label: "Gottesdienst",
                path: "/veranstaltungen/godi",
            },
            {
                label: "Gebetsabend",
                path: "/veranstaltungen/gebetsabend",
            },
            {
                label: "Termine",
                path: "/veranstaltungen/termine",
                requiresAllFeatureFlags: ["calendar", "events"],
            },
        ],
    },
    {
        label: <>Über&nbsp;uns</>,
        path: "/ueber-uns",
        subEntries: [
            // {
            //     label: "Wer wir sind",
            //     path: "/ueber-uns/wer-wir-sind",
            // },
            {
                label: "Werte & Vision",
                path: "/ueber-uns/werte-und-vision",
            },
            {
                label: "Gemeindeleitung",
                path: "/ueber-uns/gemeindeleitung",
            },
            // {
            //     label: "Gemeindeleben",
            //     path: "/ueber-uns/gemeindeleben",
            // },
        ],
    },
    {
        label: "Gruppen",
        path: "/gruppen",
        subEntries: [
            {
                label: "Kindergottesdienst",
                path: "/gruppen/kigo",
            },
            {
                label: "Teenie Jünger Schule",
                path: "/gruppen/tjs",
            },
            {
                label: "Young Generation",
                path: "/gruppen/young-generation",
            },
            {
                label: "Jüngerschaft",
                path: "/gruppen/juengerschaft",
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
        requiresAllFeatureFlags: ["admin", "internArea"],
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
                requiresAllFeatureFlags: ["admin", "internArea", "news"],
                requireOneUserFlag: ["ManageNews"],
            },
            {
                label: "Predigten",
                path: "/admin/inhalte/predigten",
                requiresAllFeatureFlags: ["admin", "internArea", "sermons"],
                requireOneUserFlag: ["ManageSermons"],
            },
            {
                label: "Benutzereinstellungen",
                path: "/admin/einstellungen/benutzer",
                requiresAllFeatureFlags: ["admin", "internArea"],
                requireOneUserFlag: ["ManageUser"],
            },
        ],
    },
    {
        label: "Mein Konto",
        needsAuth: true,
        path: "/intern/mein-konto",
        requiresAllFeatureFlags: ["internArea"],
    },
    // {
    //     label: "Mitglieder",
    //     needsAuth: true,
    //     path: "/intern",
    //     requiresAllFeatureFlags: ["internArea"],
    //     subEntries: [
    //         {
    //             label: "Mein Konto",
    //             path: "/intern/mein-konto",
    //         },
    //     ],
    // },
    {
        label: "Abmelden",
        needsAuth: true,
        path: "/logout",
        requiresAllFeatureFlags: ["internArea"],
        addReturnToCurrentPath: true,
    },
]

/**
 * The Navigation component on the root level will not be rendered on this
 * routes. For example to allow a sticky Navigation component on specific items
 * somewhere on a route.
 */
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

    const onCloseDrawer = useCallback(() => setNavDrawerOpened(false), [])

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
                        src={Logo}
                        priority
                    />
                </Link>

                <Button
                    aria-label="Navigationsmenü öffnen"
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
                onClose={onCloseDrawer}
            />
        </>
    )
}
