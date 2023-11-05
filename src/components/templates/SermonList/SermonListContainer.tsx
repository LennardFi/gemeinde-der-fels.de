"use client"

import usePagination, { PaginationNextHandler } from "@/hooks/usePagenation"
import { makeApiRequest } from "@/lib/frontend/makeApiRequest"
import { sermonsListGetEntriesAfterIdParamName } from "@/lib/frontend/urlParams"
import Website from "@/typings"
import useAudioPlayerZustand from "@/zustand/useAudioPlayerZustand"
import { useEffect, useMemo, useState } from "react"
import MediaPlayer from "../MediaPlayer/MediaPlayer"
import SermonsList, { SermonsListEntry } from "./SermonList"
import styles from "./SermonListContainer.module.scss"

interface SermonsListContainerProps {
    baseFilter?: Website.Content.Sermons.SermonsFilter
    initialSermons?: SermonsListEntry[]
    showFilter?: boolean
    themeColor?: Website.Design.ThemeColor
}

interface SermonsListCursor {
    nextIndex: number
    lastId?: string
}

export const requestSermons = (
    baseFilter?: Website.Content.Sermons.SermonsFilter,
): PaginationNextHandler<SermonsListCursor, SermonsListEntry> => {
    return async (cursor) => {
        const searchParams = new URLSearchParams()

        if (cursor.lastId !== undefined) {
            searchParams.append(
                sermonsListGetEntriesAfterIdParamName,
                cursor.lastId,
            )
        }

        // Only for debug
        // await asyncSleep(1_000) // DEBUG: Remove before commit

        const res =
            await makeApiRequest<Website.Api.Endpoints.SermonsListResponseBody>(
                `/api/sermons${
                    searchParams.size !== 0 ? `?${searchParams.toString()}` : ""
                }`,
                "json",
                {
                    method: "GET",
                    noAuthorization: true,
                },
            )

        return {
            cursor: {
                lastId: res.response.entries.at(-1)?.id ?? cursor.lastId,
                nextIndex: cursor.nextIndex + res.response.entries.length,
            },
            data: [...res.response.entries].map((entry, i) => ({
                ...entry,
                index: cursor.nextIndex + i + 1,
            })),
            endOfData: res.response.endOfData,
        }
    }
}

export default function SermonsListContainer({
    baseFilter,
    initialSermons,
    showFilter,
    themeColor,
}: SermonsListContainerProps) {
    const [filter, setFilter] = useState<Website.Content.Sermons.SermonsFilter>(
        baseFilter ?? {},
    )
    const paginationFilterFunc = useMemo(() => {
        // console.log("regenerating paginationFilterFunc")
        return requestSermons(baseFilter)
    }, [filter])
    const initialCursor = useMemo<SermonsListCursor>(
        () => ({
            nextIndex: initialSermons !== undefined ? initialSermons.length : 0,
            lastId: initialSermons?.at(-1)?.id,
        }),
        [initialSermons],
    )
    const { data, endOfData, isLoading, next } = usePagination(
        {
            data: initialSermons ?? [],
            cursor: initialCursor,
        },
        paginationFilterFunc,
    )
    const { playingMedia } = useAudioPlayerZustand((state) => ({
        playingMedia: state.playingMedia,
    }))

    const playerThemeClassName =
        themeColor === "primary"
            ? styles.primary
            : themeColor === "secondary"
            ? styles.secondary
            : styles.accent

    useEffect(() => {
        console.log({ playingMedia })
    }, [playingMedia])

    return (
        <div className={`${styles.container} ${playerThemeClassName}`}>
            {/* {showFilter ?? (
                <SermonsFilter filter={filter} setFilter={setFilter} />
            )} */}
            <SermonsList
                endOfData={endOfData}
                entries={data}
                isLoading={isLoading}
                loadNext={next}
                themeColor={themeColor}
            />
            <MediaPlayer
                className={styles.mediaPlayer}
                themeColor={themeColor}
            />
        </div>
    )
}
