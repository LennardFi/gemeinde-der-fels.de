import Website from "@/typings"

export function asyncSleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms)
    })
}

export const isDevMode = process.env.NODE_ENV === "development"

export function parseDevFeatureFlagEnvValue(
    featureFlagEnvValue: string,
): Website.Base.DevFeatureFlags[] {
    const initialFlags: Record<
        Website.Base.DevFeatureFlags,
        boolean | 1 | -1 | undefined
    > = {
        admin: undefined,
        sendEmail: undefined,
        login: undefined,
        mediaPlayer: undefined,
        news: undefined,
    }
    return Object.entries(
        featureFlagEnvValue.split(",").reduce((prevFlags, part) => {
            let negated = false

            if (part.startsWith("!")) {
                negated = true
                part = part.slice(1)
            }

            if (
                (part.toLowerCase() as Website.Base.DevFeatureFlags | "*") ===
                "*"
            ) {
                return (
                    Object.entries(prevFlags) as [
                        Website.Base.DevFeatureFlags,
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

            if (Object.keys(prevFlags).includes(part)) {
                return {
                    ...prevFlags,
                    [part as Website.Base.DevFeatureFlags]: !negated,
                }
            }

            return prevFlags
        }, initialFlags),
    )
        .filter(([, value]) => value && value !== -1)
        .map(([name]) => name as Website.Base.DevFeatureFlags)
}

const featureFlagEnvValue = process.env.GDF_DEV_FEATURE_FLAGS

export function validateDevFeatureFlag(
    ...flags: Website.Base.DevFeatureFlags[]
): boolean {
    if (flags.length === 0) {
        return true
    }

    if (featureFlagEnvValue === undefined) {
        return false
    }

    const configuredDevFeatureFlags =
        parseDevFeatureFlagEnvValue(featureFlagEnvValue)

    if (flags.some((flag) => !configuredDevFeatureFlags.includes(flag))) {
        return false
    }

    return true
}
