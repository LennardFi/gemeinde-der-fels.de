"use client"

import RequiresFeatureFlag from "@/components/dev/RequiresDevFeatureFlag"
import { returnToPathParamName } from "@/lib/shared/urlParams"
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

    if (jwt === undefined || user === undefined) {
        redirect(
            `/login?${new URLSearchParams({
                [returnToPathParamName]: pathName,
            }).toString()}`,
            RedirectType.replace,
        )
    }

    if (
        !user.flags.Admin &&
        ((pathName.startsWith("/admin/einstellungen/benutzer") &&
            !user.flags.ManageUser) ||
            (pathName.startsWith("/admin/inhalte/calendar") &&
                !user.flags.ManageCalendar) ||
            (pathName.startsWith("/admin/inhalte/news") &&
                !user.flags.ManageNews) ||
            (pathName.startsWith("/admin/inhalte/rooms") &&
                !user.flags.ManageRooms) ||
            (pathName.startsWith("/admin/inhalte/predigten") &&
                !user.flags.ManageSermons))
    ) {
        redirect(`/intern`, RedirectType.replace)
    }

    return (
        <RequiresFeatureFlag flags={["admin", "internArea"]} fallback>
            {/* <div className={styles.container}>
                <div className={styles.content}> */}
            {children}
            {/* </div>
            </div> */}
        </RequiresFeatureFlag>
    )
}
