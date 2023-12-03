import { isDevMode } from "@/lib/shared/develop"
import { RedirectType, redirect } from "next/navigation"
import React from "react"
import Banner from "../feedback/Banner"

export interface RequiresDevModeProps {
    children?: React.ReactNode
    fallback?: React.ReactNode
    redirectTo?: string
}

export default function RequiresDevMode({
    children,
    fallback,
    redirectTo,
}: RequiresDevModeProps) {
    if (!isDevMode) {
        if (redirectTo !== undefined) {
            redirect(redirectTo, RedirectType.replace)
        }
        const fallbackComponent =
            fallback === true ? (
                <Banner error label="Funktion aktuell deaktiviert." />
            ) : (
                fallback
            )

        return <> {fallbackComponent ?? null} </>
    }

    return <>{children ?? null}</>
}
