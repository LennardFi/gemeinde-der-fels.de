import { logError } from "@/lib/frontend/logger"
import { WebsiteError } from "@/lib/shared/errors"
import { settingsSchema } from "@/lib/shared/schemes"
import Website, { DeepPartial, Maybe } from "@/typings"
import { create } from "zustand"

export interface SettingsZustand extends Website.UserSettings.Settings {
    loaded: boolean
    updateSettings(
        settings: DeepPartial<Website.UserSettings.Settings>,
    ): Promise<void>
}

const settingsLocalStorageName = "settings"

const initialSettings: Website.UserSettings.Settings = {
    audioSettings: {
        muted: false,
        volume: 1,
    },
}

const useSettingsZustand = create<SettingsZustand>()((set) => {
    const storeSettingsToLocalStorage = (
        settings: Website.UserSettings.Settings,
    ): boolean => {
        try {
            const serializedSettings = JSON.stringify(settings)
            localStorage.setItem(settingsLocalStorageName, serializedSettings)
            return true
        } catch (e: unknown) {
            logError(
                new WebsiteError(
                    "client",
                    "Could not store settings into local storage",
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

    const loadSettingsFromLocalStorage =
        (): Maybe<Website.UserSettings.Settings> => {
            if (typeof document === "undefined") {
                return undefined
            }
            try {
                const serializedSettings = localStorage.getItem(
                    settingsLocalStorageName,
                )
                if (serializedSettings === null) {
                    return initialSettings
                }
                const settings = JSON.parse(serializedSettings)
                const settingsResult = settingsSchema.safeParse(settings)

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
                    return initialSettings
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
                return initialSettings
            }
        }

    const updateSettings: SettingsZustand["updateSettings"] = async (
        settings,
    ) =>
        set((state) => {
            if (
                settings.audioSettings !== undefined &&
                settings.audioSettings.volume !== undefined &&
                (settings.audioSettings.volume < 0 ||
                    settings.audioSettings.volume > 1)
            ) {
                return {}
            }

            const newSettings: Website.UserSettings.Settings = {
                ...state,
                ...settings,
                audioSettings: {
                    ...state.audioSettings,
                    ...settings.audioSettings,
                },
            }

            if (!storeSettingsToLocalStorage(newSettings)) {
                return {}
            }

            return newSettings
        })

    const loadedSettings = loadSettingsFromLocalStorage()

    if (loadedSettings === undefined) {
        return {
            ...initialSettings,
            loaded: false,
            updateSettings,
        }
    }

    return {
        ...loadedSettings,
        loaded: true,
        updateSettings,
    }
})

export default useSettingsZustand
