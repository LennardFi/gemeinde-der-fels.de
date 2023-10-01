"use client"

import ButtonLink from "@/components/inputs/ButtonLink"
import useAuthZustand from "@/zustand/useAuthZustand"
import { RedirectType } from "next/dist/client/components/redirect"
import { redirect, usePathname } from "next/navigation"
import styles from "./layout.module.scss"

interface InternalLayoutProps extends React.HTMLProps<HTMLDivElement> {
    children?: React.ReactNode
}

export default function Layout({ children }: InternalLayoutProps) {
    const pathName = usePathname()
    const jwt = useAuthZustand((state) => state.jwt)
    const user = useAuthZustand((state) => state.user)

    if (jwt === undefined) {
        redirect(
            `/login?returnTo=${encodeURIComponent(pathName)}`,
            RedirectType.replace,
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>{}</div>

            <ul className={styles.quickLinks}>
                <li>
                    <ButtonLink
                        href="/internals/mein-konto"
                        variant="contained"
                    >
                        Mein Konto
                    </ButtonLink>
                </li>
                {user?.flags.Admin ? (
                    <li>
                        <ButtonLink href="/internals/admin" variant="contained">
                            Admin
                        </ButtonLink>
                    </li>
                ) : null}
                {user?.flags.Admin ? (
                    <li>
                        <ButtonLink
                            href="/internals/inhalte/medien"
                            variant="contained"
                        >
                            Medien
                        </ButtonLink>
                    </li>
                ) : null}
            </ul>

            <div className={styles.content}>{children}</div>
        </div>
    )
}
