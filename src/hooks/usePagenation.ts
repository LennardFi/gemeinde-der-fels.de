"use client"

import { useCallback, useState } from "react"

export interface usePaginationReturns<T> {
    data: T[]
    /**
     * `true` if all data has been fetched.
     */
    endOfData: boolean
    isLoading: boolean
    next(): void
}

export interface FetchFuncResult<C, T> {
    cursor: C
    data: T[]
    /**
     * `true` if all data has been fetched.
     */
    endOfData: boolean
}

export interface FetchFuncInit<C, T>
    extends Omit<FetchFuncResult<C, T>, "endOfData"> {
    /**
     * `true` if all data has been fetched.
     */
    endOfData?: boolean
}

export type PaginationNextHandler<C, T> = (
    cursor: C,
) => Promise<FetchFuncResult<C, T>>

const usePagination = <C, T>(
    init: FetchFuncInit<C, T>,
    nextHandler: PaginationNextHandler<C, T>,
): usePaginationReturns<T> => {
    const [cursor, setCursor] = useState(init.cursor)
    const [data, setData] = useState(init.data)
    const [endOfData, setEndOfData] = useState(init.endOfData ?? false)
    const [isLoading, setIsLoading] = useState(false)

    const [prevInit, setPrevInit] = useState(init)
    if (
        typeof document !== "undefined" &&
        (prevInit.cursor !== init.cursor || prevInit.data !== init.data)
    ) {
        setCursor(init.cursor)
        setData(init.data)
        setEndOfData(init.endOfData ?? false)
        setPrevInit({
            cursor: init.cursor,
            data: init.data,
            endOfData: false,
        })
    }

    const next = useCallback(async () => {
        if (isLoading || endOfData) {
            console.log({
                isLoading,
                endOfData,
            })
            return
        }

        setIsLoading(true)

        const result = await nextHandler(cursor)

        setCursor(result.cursor)
        setData((prev) => [...prev, ...result.data])
        setEndOfData(result.endOfData)
        setIsLoading(false)
    }, [cursor, endOfData, isLoading, nextHandler])

    return {
        data,
        endOfData,
        isLoading,
        next,
    }
}

export default usePagination
