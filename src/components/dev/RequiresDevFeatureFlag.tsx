import { validateFeatureFlag } from "@/lib/shared/develop"
import Website from "@/typings"
import { RedirectType, redirect } from "next/navigation"
import React from "react"
import Banner from "../feedback/Banner"

export interface RequiresFeatureFlagProps {
    /**
     * A list of feature flags which are required to be set to render the
     * children components
     */
    flags: Website.Base.FeatureFlags[]
    /**
     * The children component that may not be rendered depending on set feature
     * flags.
     */
    children?: React.ReactNode
    /**
     * Render a fallback component when a feature flag is not set and the
     * children component won't be rendered.
     * Either `true` to render a default hint banner or a ReactNode that will be
     * rendered.
     * Can't be used in combination with `redirectTo`.
     */
    fallback?: React.ReactNode
    /**
     * When a required flag isn't set, change the client location to the
     * specified route.
     * Can't be used in combination with `fallback`.
     */
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
