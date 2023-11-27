import { useEffect, useState } from "react"
import {
    SIZE_BREAKPOINT_LARGE_STRING,
    SIZE_BREAKPOINT_NORMAL_STRING,
    SIZE_BREAKPOINT_SMALL_STRING,
} from "../lib/shared/helpers"
import Website from "../typings"

const getDeviceSize = (
    defaultSize?: Website.Base.DeviceSize,
): Website.Base.DeviceSize => {
    if (typeof window !== "undefined") {
        if (
            window.matchMedia(`(min-width: ${SIZE_BREAKPOINT_LARGE_STRING})`)
                .matches
        ) {
            return "large"
        }
        if (
            window.matchMedia(`(min-width: ${SIZE_BREAKPOINT_NORMAL_STRING})`)
                .matches
        ) {
            return "normal"
        }
        if (
            window.matchMedia(`(min-width: ${SIZE_BREAKPOINT_SMALL_STRING})`)
                .matches
        ) {
            return "small"
        }
        return "tiny"
    }

    return defaultSize ?? "tiny"
}

const useDeviceSize = (
    defaultSize?: Website.Base.DeviceSize,
): Website.Base.DeviceSize => {
    const [deviceSize, setDeviceSize] = useState<Website.Base.DeviceSize>(
        defaultSize ?? "tiny",
    )

    useEffect(() => {
        const handler = () => {
            const deviceSize = getDeviceSize()
            setDeviceSize(deviceSize)
        }
        handler()
        window.addEventListener("resize", handler)
        return () => window.removeEventListener("resize", handler)
    }, [])

    return deviceSize
}

export default useDeviceSize
