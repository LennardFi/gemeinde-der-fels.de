"use client"

import RequiresDevFeatureFlag from "@/components/dev/RequiresDevFeatureFlag"
import usePagination, { PaginationNextHandler } from "@/hooks/usePagenation"
import { makeApiRequest } from "@/lib/frontend/makeApiRequest"
import { sermonsListGetEntriesAfterIdParamName } from "@/lib/frontend/urlParams"
import Website from "@/typings"
import { useEffect, useMemo, useRef, useState } from "react"
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
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [innerHeight, setInnerHeight] = useState(600)
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

    useEffect(() => {
        const refresh = (target: HTMLDivElement) => {
            const clientHeight = target.clientHeight

            setInnerHeight(clientHeight - 250)

            console.log({ clientHeight, newInnerHeight: clientHeight - 200 })
        }
        const handler = (e: UIEvent) => {
            refresh(e.target as HTMLDivElement)
        }
        containerRef.current?.addEventListener("resize", handler)
        if (containerRef.current !== null) {
            refresh(containerRef.current)
        }

        return () => {
            containerRef.current?.removeEventListener("resize", handler)
        }
    }, [])

    return (
        <RequiresDevFeatureFlag flags={["mediaPlayer"]} fallback>
            <div className={`${styles.container}`} ref={containerRef}>
                {/* {showFilter ?? (
                <SermonsFilter filter={filter} setFilter={setFilter} />
            )} */}
                <SermonsList
                    endOfData={endOfData}
                    entries={data}
                    height={innerHeight}
                    isLoading={isLoading}
                    loadNext={next}
                    themeColor={themeColor}
                />
                <MediaPlayer
                    className={styles.mediaPlayer}
                    themeColor={themeColor}
                />
            </div>
        </RequiresDevFeatureFlag>
    )
}
