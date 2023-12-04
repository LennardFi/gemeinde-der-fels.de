import { useEffect, useState } from "react"

const useDebouncedValue = <T>(value: T, delay?: number): T => {
    const [prevState, setPrevState] = useState(value)

    useEffect(() => {
        const timeOutHandle = window.setTimeout(() => {
            setPrevState(value)
        }, delay ?? 1_000)
        return () => window.clearTimeout(timeOutHandle)
    }, [value])

    return prevState
}

export default useDebouncedValue
