"use client"

import Skeleton from "@/components/feedback/Skeleton"
import Button from "@/components/inputs/Button"
import Checkbox from "@/components/inputs/Checkbox"
import Window from "@/components/surfaces/window/Window"
import WindowContent from "@/components/surfaces/window/WindowContent"
import WindowHeader from "@/components/surfaces/window/WindowHeader"
import usePagination, { PaginationNextHandler } from "@/hooks/usePagenation"
import { makeApiRequest } from "@/lib/frontend/makeApiRequest"
import { defaultListPageSize } from "@/lib/shared/apiHelpers"
import { afterIdParamName, pageSizeParamName } from "@/lib/shared/urlParams"
import Website from "@/typings"
import { useMemo, useState } from "react"
import styles from "./page.module.scss"

export interface UserListCursor {
    nextIndex: number
    lastId?: Website.Content.Sermons.Sermon["id"]
}

const requestUsers = (
    showDisabled?: boolean,
): PaginationNextHandler<UserListCursor, Website.Users.User> => {
    return async (cursor) => {
        const searchParams = new URLSearchParams()
        searchParams.append(pageSizeParamName, defaultListPageSize.toString())

        if (cursor.lastId !== undefined) {
            searchParams.append(afterIdParamName, cursor.lastId.toString())
        }

        const res =
            await makeApiRequest<Website.Api.Endpoints.UserListResponseBodyEntry>(
                `/api/users${
                    searchParams.size !== 0 ? `?${searchParams.toString()}` : ""
                }`,
                "json",
                {
                    method: "GET",
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

export default function Page() {
    const [showDisabled, setShowDisabled] = useState(false)

    const paginationFilterFunc = useMemo(() => {
        return requestUsers(showDisabled)
    }, [showDisabled])
    const initialCursor = useMemo(
        () => ({
            data: [],
            cursor: {
                nextIndex: 0,
            },
        }),
        [],
    )
    const { data, endOfData, isLoading, loadMore } = usePagination(
        initialCursor,
        paginationFilterFunc,
    )

    if (
        typeof document !== "undefined" &&
        data.length === 0 &&
        !endOfData &&
        !isLoading
    ) {
        loadMore()
    }

    return (
        <Window breakpoint="normal" className={styles.card} pageContainer>
            <WindowHeader title="Einstellungen" />
            <WindowContent className={styles.container}>
                <h2>Benutzer</h2>
                <Checkbox
                    checked={showDisabled}
                    label="Deaktivierte anzeigen"
                    onChange={(checked) => setShowDisabled(checked)}
                />
                <table>
                    <thead>
                        <tr>
                            <th>Aktiv</th>
                            <th>Benutzername</th>
                            <th>E-Mail</th>
                            <th>Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(
                            data ??
                            Array.from({ length: 20 }).map((_) => undefined)
                        ).map((user, i) => (
                            <tr key={user?.id ?? i}>
                                <td>
                                    {user === undefined ? (
                                        <Skeleton width="100%" />
                                    ) : (
                                        <Checkbox checked={!user.disabled} />
                                    )}
                                </td>
                                <td>
                                    {user === undefined ? (
                                        <Skeleton width="100%" />
                                    ) : (
                                        user.userName
                                    )}
                                </td>
                                <td>
                                    {user === undefined ? (
                                        <Skeleton width="100%" />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td>
                                    {user === undefined ? (
                                        <Skeleton width="100%" />
                                    ) : (
                                        <Checkbox checked={user.flags.Admin} />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!endOfData ? (
                    <Button
                        loading={isLoading}
                        onClick={() => {
                            loadMore()
                        }}
                    >
                        Mehr laden
                    </Button>
                ) : null}
            </WindowContent>
        </Window>
    )
}
