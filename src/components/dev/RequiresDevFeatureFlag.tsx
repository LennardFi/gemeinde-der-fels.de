import { isDevMode, validateDevFeatureFlag } from "@/lib/shared/develop"
import Website from "@/typings"
import { redirect, RedirectType } from "next/navigation"
import React from "react"
import Banner from "../feedback/Banner"

export interface RequiresDevFeatureFlagProps {
    children?: React.ReactNode
    flags: Website.Base.DevFeatureFlags[]
    fallback?: React.ReactNode
    redirectTo?: string
}

export default function RequiresDevFeatureFlag({
    children,
    fallback,
    flags,
    redirectTo,
}: RequiresDevFeatureFlagProps) {
    if (
        (!isDevMode && flags.length !== 0) ||
        !validateDevFeatureFlag(...flags)
    ) {
        if (redirectTo !== undefined) {
            redirect(redirectTo, RedirectType.replace)
        }
        const fallbackComponent =
            fallback === true ? (
                <Banner
                    error
                    label="Funktion aktuell noch nicht freigeschaltet."
                />
            ) : (
                fallback
            )

        return <> {fallbackComponent ?? null} </>
    }

    return <>{children ?? null}</>
}
