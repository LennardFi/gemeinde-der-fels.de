"use client"

import useAuthZustand from "@/zustand/useAuthZustand"
import { RedirectType } from "next/dist/client/components/redirect"
import { redirect, usePathname } from "next/navigation"
import styles from "./layout.module.scss"

interface InternalLayoutProps {
    children?: React.ReactNode
}

export default function Layout({ children }: InternalLayoutProps) {
    const pathName = usePathname()
    const jwt = useAuthZustand((state) => state.jwt)

    if (jwt === undefined) {
        redirect(
            `/login?returnTo=${encodeURIComponent(pathName)}`,
            RedirectType.replace,
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>{children}</div>
        </div>
    )
}
