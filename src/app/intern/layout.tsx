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
    const { jwt } = useAuthZustand((state) => ({ jwt: state.jwt }))

    if (jwt === undefined) {
        console.log("Not logged in. Redirect to login page")

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
                <li>
                    <ButtonLink href="/internals/admin" variant="contained">
                        Inhalte
                    </ButtonLink>
                </li>
                <li>
                    <ButtonLink href="/internals/admin" variant="contained">
                        Inhalte
                    </ButtonLink>
                </li>
            </ul>

            <div className={styles.content}>{children}</div>
        </div>
    )
}
