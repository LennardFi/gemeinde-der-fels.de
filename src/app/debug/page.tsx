"use client"

import Flex from "@/components/containers/Flex"
import PageContainer from "@/components/containers/PageContainer"
import Banner from "@/components/feedback/Banner"
import Button from "@/components/inputs/Button"
import Divider from "@/components/surfaces/Divider"
import useDeviceSize from "@/hooks/useDeviceSize"
import useIsMounted from "@/hooks/useIsMounted"
import { makeApiRequest } from "@/lib/frontend/makeApiRequest"
import { WebsiteError } from "@/lib/shared/errors"
import {
    fileNameParamName,
    requiresUserFlagParamName,
} from "@/lib/shared/urlParams"
import Website, { Maybe } from "@/typings"
import useAuthZustand from "@/zustand/useAuthZustand"
import useUserPreferencesZustand from "@/zustand/useUserPreferencesZustand"
import { useEffect, useState } from "react"
import { FaCheck, FaCloudUploadAlt, FaCopy, FaInfoCircle } from "react-icons/fa"
import { Temporal } from "temporal-polyfill"
import styles from "./page.module.scss"

export default function Page() {
    const isMounted = useIsMounted()
    const [timeStamp, setTimeStamp] =
        useState<Maybe<Temporal.ZonedDateTime>>(undefined)
    const [copied, setCopied] = useState(false)
    const [infoSent, setInfoSent] = useState(false)
    const [sendingDebugInfo, setSendingDebugInfo] = useState(false)
    const [debugInfoId, setDebugInfoId] = useState<Maybe<number>>(undefined)
    const [uploadError, setUploadError] = useState<Maybe<string>>(undefined)
    const auth = useAuthZustand((state) => ({
        initialLoadDone: state.initialLoadDone,
        jwtSet: state.jwt !== undefined ? true : false,
        user: state.user,
    }))
    const userPreferences = useUserPreferencesZustand((state) => ({
        audio: state.audio,
        loaded: state.loaded,
    }))
    const deviceSize = useDeviceSize()

    const debugInfo: Maybe<Website.Debug.ClientDebugInfo> =
        timeStamp === undefined
            ? undefined
            : {
                  timeStamp,
                  responsive: {
                      deviceSize,
                      height: window.innerHeight,
                      width: window.innerWidth,
                  },
                  auth,
                  userPreferences,
              }

    const copyDebugInfo = (debugInfo: Website.Debug.ClientDebugInfo) => {
        navigator.clipboard.writeText(JSON.stringify(debugInfo))
        setCopied(true)
    }

    const sendDebugInfo = async (debugInfo: Website.Debug.ClientDebugInfo) => {
        try {
            setDebugInfoId(undefined)
            setSendingDebugInfo(true)
            if (!isMounted.current) {
                return
            }

            const serializedDebugInfo = {
                ...debugInfo,
                timeStamp: debugInfo.timeStamp.epochSeconds,
            }
            const res = await makeApiRequest<Website.Content.Files.FileDetails>(
                `/api/files?${new URLSearchParams({
                    [fileNameParamName]: "debugInfo.json",
                    [requiresUserFlagParamName]:
                        "Admin" as keyof Website.Users.UserFlags,
                })}`,
                "json",
                {
                    method: "POST",
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                    body: JSON.stringify(serializedDebugInfo),
                },
            )

            if (!isMounted.current) {
                return
            }
            setDebugInfoId(res.response.id)
            setSendingDebugInfo(false)
            setUploadError(undefined)
        } catch (err) {
            if (!isMounted.current) {
                return
            }

            setDebugInfoId(undefined)
            setSendingDebugInfo(false)

            if (err instanceof WebsiteError) {
                setUploadError(err.message)
            }

            setUploadError("Unknown error")
        }
    }

    useEffect(() => {
        if (timeStamp === undefined) {
            setTimeStamp(Temporal.Now.zonedDateTimeISO("UTC"))
        }
    }, [timeStamp])

    useEffect(() => {
        if (copied) {
            const handle = setTimeout(() => {
                setCopied(false)
            }, 1_000)
            return () => clearTimeout(handle)
        }
    }, [copied])

    useEffect(() => {
        if (copied) {
            const handle = setTimeout(() => {
                setInfoSent(false)
            }, 1_000)
            return () => clearTimeout(handle)
        }
    }, [infoSent])

    return (
        <PageContainer breakpoint="small" title="Debug" themeColor="primary">
            <Banner error label="Only for development purposes" />
            <Divider themeColor="transparent" />
            <pre className={styles.debugInfo}>
                {timeStamp !== undefined
                    ? JSON.stringify(debugInfo, undefined, 2)
                    : null}
            </pre>
            <Divider themeColor="transparent" />
            {uploadError !== undefined || debugInfoId !== undefined ? (
                <>
                    <Banner
                        error={uploadError !== undefined}
                        icon={<FaInfoCircle />}
                        label={
                            uploadError === undefined
                                ? `Daten hochgeladen: #${debugInfoId}`
                                : uploadError
                        }
                        description={
                            <>
                                <b>URL: </b>
                                <code>
                                    {window.location.protocol}//
                                    {window.location.host}/api/files/
                                    <b>{debugInfoId}</b>
                                </code>
                            </>
                        }
                    />
                    <Divider themeColor="transparent" />
                </>
            ) : null}
            <Flex
                breakpoint="tiny"
                direction="column"
                justify="center"
                gap={2}
                normal={{
                    direction: "row",
                }}
            >
                <Button
                    disabled={debugInfo === undefined}
                    leftSegment={copied ? <FaCheck /> : <FaCopy />}
                    onClick={
                        debugInfo !== undefined
                            ? () => copyDebugInfo(debugInfo)
                            : undefined
                    }
                    themeColor="primary"
                    variant="contained"
                >
                    Daten kopieren
                </Button>
                <Button
                    disabled={debugInfo === undefined}
                    leftSegment={infoSent ? <FaCheck /> : <FaCloudUploadAlt />}
                    loading={sendingDebugInfo}
                    onClick={
                        debugInfo !== undefined
                            ? () => sendDebugInfo(debugInfo)
                            : undefined
                    }
                    fontColor
                    themeColor="primary"
                    variant="contained"
                >
                    Daten hochladen
                </Button>
            </Flex>
        </PageContainer>
    )
}
