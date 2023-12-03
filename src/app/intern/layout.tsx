"use client"

import RequiresFeatureFlag from "@/components/dev/RequiresDevFeatureFlag"
import useAuthZustand from "@/zustand/useAuthZustand"
import { RedirectType } from "next/dist/client/components/redirect"
import { redirect, usePathname } from "next/navigation"

interface InternalLayoutProps {
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
        <RequiresFeatureFlag flags={["internArea"]} redirectTo="/notFound">
            {/* <ul className={styles.quickLinks}>
                    <li>
                        <ButtonLink
                            href="/internals/mein-konto"
                            variant="contained"
                        >
                            Mein Konto
                        </ButtonLink>
                    </li>
                    <RequiresFeatureFlag flags={["admin", "internArea"]}>
                        {user?.flags.Admin ? (
                            <li>
                                <ButtonLink
                                    href="/internals/admin"
                                    variant="contained"
                                >
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
                    </RequiresFeatureFlag>
                </ul> */}

            {children}
        </RequiresFeatureFlag>
    )
}
