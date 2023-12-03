import { validateFeatureFlag } from "@/lib/shared/develop"
import Website from "@/typings"
import { RedirectType, redirect } from "next/navigation"
import React from "react"
import Banner from "../feedback/Banner"

export interface RequiresFeatureFlagProps {
    flags: Website.Base.FeatureFlags[]
    children?: React.ReactNode
    fallback?: React.ReactNode
    redirectTo?: string
}

export default function RequiresFeatureFlag({
    children,
    fallback,
    flags,
    redirectTo,
}: RequiresFeatureFlagProps) {
    if (flags.length !== 0 && !validateFeatureFlag(...flags)) {
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
