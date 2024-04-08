import Website from "@/typings"

export function asyncSleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms)
    })
}

export const isDevMode = process.env.NODE_ENV === "development"

export function parseFeatureFlagEnvValue(
    featureFlagEnvValue: string,
): Website.Base.FeatureFlags[] {
    const initialFlags: {
        [K in Website.Base.FeatureFlags]: boolean | 1 | -1 | undefined
    } = {
        admin: undefined,
        calendar: undefined,
        events: undefined,
        "hopeful-yt": undefined,
        internArea: undefined,
        mediaPlayer: undefined,
        news: undefined,
        "optional-cookies": undefined,
        "privacy-consent": undefined,
        sendEmail: undefined,
    }
    return Object.entries(
        featureFlagEnvValue
            .split(",")
            .map((featureFlag) => featureFlag.trim())
            .filter((featureFlagValue) => {
                const possibleFlags = Object.keys(initialFlags).map((flag) =>
                    flag.toLowerCase(),
                )
                featureFlagValue = featureFlagValue.toLowerCase()
                return (
                    possibleFlags.includes(featureFlagValue) ||
                    (featureFlagValue.startsWith("!") &&
                        possibleFlags.includes(
                            featureFlagValue.substring(1),
                        )) ||
                    (isDevMode &&
                        (featureFlagValue === "*" || featureFlagValue === "!*"))
                )
            })
            .reduce((prevFlags, featureFlagValue) => {
                let negated = false

                if (featureFlagValue.startsWith("!")) {
                    negated = true
                    featureFlagValue = featureFlagValue.slice(1)
                }

                if (
                    (featureFlagValue.toLowerCase() as
                        | Website.Base.FeatureFlags
                        | "*") === "*"
                ) {
                    return (
                        Object.entries(prevFlags) as [
                            Website.Base.FeatureFlags,
                            boolean | 1 | -1 | undefined,
                        ][]
                    ).reduce((prevFlags, [flagName, prevValue]) => {
                        if (prevValue === undefined || prevValue === -1) {
                            return {
                                ...prevFlags,
                                [flagName]: negated ? -1 : 1,
                            }
                        }
                        return prevFlags
                    }, prevFlags)
                }

                const possibleFlags = Object.keys(initialFlags).map((flag) =>
                    flag.toLowerCase(),
                )

                if (possibleFlags.includes(featureFlagValue.toLowerCase())) {
                    return {
                        ...prevFlags,
                        [featureFlagValue as Website.Base.FeatureFlags]:
                            !negated,
                    }
                }

                return prevFlags
            }, initialFlags),
    )
        .filter(([, value]) => value && value !== -1)
        .map(([name]) => name as Website.Base.FeatureFlags)
}

const featureFlagEnvValue =
    (isDevMode ? process.env.NEXT_PUBLIC_GDF_DEV_FEATURE_FLAGS : undefined) ??
    process.env.NEXT_PUBLIC_GDF_FEATURE_FLAGS

export const configuredFeatureFlags =
    featureFlagEnvValue === undefined
        ? []
        : parseFeatureFlagEnvValue(featureFlagEnvValue)

export function validateFeatureFlag(
    ...flags: Website.Base.FeatureFlags[]
): boolean {
    if (flags.length === 0) {
        return true
    }

    if (flags.some((flag) => !configuredFeatureFlags.includes(flag))) {
        return false
    }

    return true
}
