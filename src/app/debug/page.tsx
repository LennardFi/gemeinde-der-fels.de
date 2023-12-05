"use client"

import PageContainer from "@/components/containers/PageContainer"
import Banner from "@/components/feedback/Banner"
import Button from "@/components/inputs/Button"
import useDeviceSize from "@/hooks/useDeviceSize"
import { Maybe } from "@/typings"
import useAuthZustand from "@/zustand/useAuthZustand"
import useUserPreferencesZustand from "@/zustand/useUserPreferencesZustand"
import { useEffect, useState } from "react"
import { FaCopy } from "react-icons/fa"
import { Temporal } from "temporal-polyfill"
import styles from "./page.module.scss"

export default function Page() {
    const [timeStamp, setTimeStamp] =
        useState<Maybe<Temporal.ZonedDateTime>>(undefined)
    const auth = useAuthZustand((state) => ({
        initialLoadDone: state.initialLoadDone,
        jwt: state.jwt !== undefined ? "[Secret JWT]" : undefined,
        user: state.user,
    }))
    const userPreferences = useUserPreferencesZustand((state) => ({
        audio: state.audio,
        loaded: state.loaded,
    }))
    const deviceSize = useDeviceSize()

    const debugInfo = {
        timeStamp,
        deviceSize,
        auth,
        userPreferences,
    }

    const copyDebugInfo = () => {
        navigator.clipboard.writeText(JSON.stringify(debugInfo))
    }

    useEffect(() => {
        if (timeStamp === undefined) {
            setTimeStamp(Temporal.Now.zonedDateTimeISO("UTC"))
        }
    }, [timeStamp])

    return (
        <PageContainer title="Debug" themeColor="primary">
            <Banner error label="Only for development purposes" />
            <pre className={styles.debugInfo}>
                {timeStamp !== undefined
                    ? JSON.stringify(debugInfo, undefined, 2)
                    : null}
            </pre>
            <Button
                leftSegment={<FaCopy />}
                onClick={copyDebugInfo}
                variant="contained"
            >
                Copy
            </Button>
        </PageContainer>
    )
}
