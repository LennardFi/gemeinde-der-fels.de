"use client"

import RequiresDevFeatureFlag from "@/components/dev/RequiresDevFeatureFlag"
import Pagination from "@/components/inputs/Pagination"
import usePagination, { PaginationNextHandler } from "@/hooks/usePagenation"
import { makeApiRequest } from "@/lib/frontend/makeApiRequest"
import {
    sermonsListGetEntriesAfterIdParamName,
    sermonsListGetEntriesPageSizeParamName,
} from "@/lib/frontend/urlParams"
import Website, { Maybe } from "@/typings"
import { HTMLAttributes, useEffect, useMemo, useState } from "react"
import MediaPlayer from "../MediaPlayer/MediaPlayer"
import SermonsList, { SermonListProps, SermonsListEntry } from "./SermonList"
import styles from "./SermonListContainer.module.scss"

interface SermonListContainerProps extends HTMLAttributes<HTMLDivElement> {
    baseFilter?: Website.Content.Sermons.SermonsFilter
    initialSermons?: SermonsListEntry[]
    /**
     * @default 10
     */
    pageSize?: number
    sermonListProps?: Omit<
        SermonListProps,
        "entries" | "loadNext" | "endOfData" | "isLoading" | "themeColor"
    >
    showFilter?: boolean
    themeColor?: Website.Design.ThemeColor
}

interface SermonsListCursor {
    nextIndex: number
    lastId?: Website.Content.Sermons.Sermon["id"]
}

export const requestSermons = (
    pageSize: number,
    filter?: Website.Content.Sermons.SermonsFilter,
): PaginationNextHandler<SermonsListCursor, SermonsListEntry> => {
    return async (cursor) => {
        const searchParams = new URLSearchParams()
        searchParams.append(
            sermonsListGetEntriesPageSizeParamName,
            pageSize.toString(),
        )

        if (cursor.lastId !== undefined) {
            searchParams.append(
                sermonsListGetEntriesAfterIdParamName,
                cursor.lastId.toString(),
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
    className,
    initialSermons,
    pageSize = 10,
    sermonListProps,
    showFilter,
    themeColor,
    ...rest
}: SermonListContainerProps) {
    const [filter, setFilter] = useState<Website.Content.Sermons.SermonsFilter>(
        baseFilter ?? {},
    )
    const [page, setPage] = useState(0)
    const paginationFilterFunc = useMemo(() => {
        return requestSermons(pageSize, filter)
    }, [filter])
    const initialCursor = useMemo<SermonsListCursor>(
        () => ({
            nextIndex: initialSermons !== undefined ? initialSermons.length : 0,
            lastId: initialSermons?.at(-1)?.id,
        }),
        [initialSermons],
    )
    const { data, endOfData, isLoading, loadMore } = usePagination(
        {
            data: initialSermons ?? [],
            cursor: initialCursor,
        },
        paginationFilterFunc,
    )

    const pageWindow = useMemo(() => {
        const dataIndex = page * pageSize
        let pageWindow: Maybe<SermonsListEntry>[] = data.slice(
            dataIndex,
            dataIndex + pageSize,
        )
        if (pageWindow.length === 0) {
            pageWindow = Array.from({ length: pageSize }).map(() => undefined)
        }
        return pageWindow
    }, [data, page])

    useEffect(() => {
        if (!isLoading && !endOfData && pageWindow.includes(undefined)) {
            loadMore()
            // TODO: Add abort handler
        }
    }, [pageWindow, pageSize, isLoading, endOfData])

    return (
        <RequiresDevFeatureFlag flags={["mediaPlayer"]} fallback>
            <div className={`${styles.container} ${className ?? ""}`} {...rest}>
                {/* {showFilter ?? (
                <SermonsFilter filter={filter} setFilter={setFilter} />
            )} */}
                <div className={styles.listContainer}>
                    <SermonsList
                        entries={pageWindow}
                        themeColor={themeColor}
                        {...sermonListProps}
                    />
                </div>
                <Pagination
                    className={styles.pagination}
                    onChange={(newPageIndex) => setPage(newPageIndex)}
                    total={
                        !endOfData
                            ? page + 2
                            : Math.ceil(data.length / pageSize)
                    }
                    value={page}
                />
                <MediaPlayer
                    className={styles.mediaPlayer}
                    sticky
                    themeColor={themeColor}
                />
            </div>
        </RequiresDevFeatureFlag>
    )
}
