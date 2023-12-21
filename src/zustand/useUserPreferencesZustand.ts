import { logError } from "@/lib/frontend/logger"
import { WebsiteError } from "@/lib/shared/errors"
import { preferencesSchema } from "@/lib/shared/schemes"
import Website, { DeepPartial, Maybe } from "@/typings"
import { create } from "zustand"

export interface UserPreferencesZustand
    extends Website.UserPreferences.Preferences {
    loaded: boolean
    loadPreferences(): void
    updatePreferences(
        preferences: DeepPartial<Website.UserPreferences.Preferences>,
    ): Promise<void>
}

const preferencesLocalStorageName = "preferences"

const initialPreferences: Website.UserPreferences.Preferences = {}

const useUserPreferencesZustand = create<UserPreferencesZustand>()((set) => {
    const storeSettingsToLocalStorage = (
        preferences: Website.UserPreferences.Preferences,
    ): boolean => {
        try {
            if (
                !preferences.privacy?.allowCookies ||
                !preferences.privacy.enabledCookies?.preferences
            ) {
                return true
            }
            const serializedPreferences = JSON.stringify(preferences)
            localStorage.setItem(
                preferencesLocalStorageName,
                serializedPreferences,
            )
            return true
        } catch (e: unknown) {
            logError(
                new WebsiteError(
                    "client",
                    "Could not store preferences into local storage",
                    {
                        internalException: e instanceof Error ? e : undefined,
                        internalMessage:
                            e instanceof Error ? undefined : JSON.stringify(e),
                    },
                ),
            )
            return false
        }
    }

    const loadPreferencesFromLocalStorage =
        (): Maybe<Website.UserPreferences.Preferences> => {
            if (typeof document === "undefined") {
                return undefined
            }
            try {
                const serializedPreferences = localStorage.getItem(
                    preferencesLocalStorageName,
                )
                if (serializedPreferences === null) {
                    return initialPreferences
                }
                const settings = JSON.parse(serializedPreferences)
                const settingsResult = preferencesSchema.safeParse(settings)

                if (!settingsResult.success) {
                    logError(
                        new WebsiteError(
                            "client",
                            "Settings from local storage didn't pass scheme validation",
                            {
                                internalException: settingsResult.error,
                            },
                        ),
                    )
                    return initialPreferences
                }
                return settingsResult.data
            } catch (e: unknown) {
                logError(
                    new WebsiteError(
                        "client",
                        "Could not load settings from local storage",
                        {
                            internalException:
                                e instanceof Error ? e : undefined,
                            internalMessage:
                                e instanceof Error
                                    ? undefined
                                    : JSON.stringify(e),
                        },
                    ),
                )
                return initialPreferences
            }
        }

    const loadPreferences: UserPreferencesZustand["loadPreferences"] = () => {
        const loadedPreferences = loadPreferencesFromLocalStorage()

        if (loadedPreferences === undefined) {
            return
        }

        set((state) => ({
            ...state,
            ...loadedPreferences,
            audio: {
                ...state.audio,
                ...loadedPreferences.audio,
            },
            privacy: {
                ...state.privacy,
                ...loadedPreferences.privacy,
            },
            loaded: true,
        }))
    }

    const updatePreferences: UserPreferencesZustand["updatePreferences"] =
        async (preferences) =>
            set((state) => {
                if (
                    preferences.audio !== undefined &&
                    preferences.audio.volume !== undefined &&
                    (preferences.audio.volume < 0 ||
                        preferences.audio.volume > 1)
                ) {
                    return {}
                }

                const newSettings: Website.UserPreferences.Preferences = {
                    ...state,
                    ...preferences,
                    audio: {
                        muted: false,
                        volume: 1,
                        ...state.audio,
                        ...preferences.audio,
                    },
                    privacy: {
                        ...state.privacy,
                        ...preferences.privacy,
                        enabledCookies: {
                            ...state.privacy?.enabledCookies,
                            ...preferences.privacy?.enabledCookies,
                        },
                    },
                }

                if (!storeSettingsToLocalStorage(newSettings)) {
                    return {}
                }

                return newSettings
            })

    return {
        ...initialPreferences,
        loaded: false,
        loadPreferences,
        updatePreferences,
    }
})

export default useUserPreferencesZustand
