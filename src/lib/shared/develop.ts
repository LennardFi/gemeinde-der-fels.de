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
        "hopeful-yt": undefined,
        internArea: undefined,
        mediaPlayer: undefined,
        news: undefined,
        "privacy-consent": undefined,
        sendEmail: undefined,
    }
    return Object.entries(
        featureFlagEnvValue
            .split(",")
            .map((featureFlag) => featureFlag.trim())
            .filter(
                (featureFlagValue) =>
                    featureFlagValue in initialFlags ||
                    (featureFlagValue.startsWith("!") &&
                        featureFlagValue.substring(1) in initialFlags) ||
                    (isDevMode &&
                        (featureFlagValue === "*" ||
                            featureFlagValue === "!*")),
            )
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

                if (Object.keys(prevFlags).includes(featureFlagValue)) {
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

export function validateFeatureFlag(
    ...flags: Website.Base.FeatureFlags[]
): boolean {
    if (flags.length === 0) {
        return true
    }

    if (featureFlagEnvValue === undefined) {
        return false
    }

    const configuredFeatureFlags = parseFeatureFlagEnvValue(featureFlagEnvValue)

    if (flags.some((flag) => !configuredFeatureFlags.includes(flag))) {
        return false
    }

    return true
}
