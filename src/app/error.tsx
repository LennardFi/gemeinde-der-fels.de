"use client"

import { useEffect } from "react"

interface ErrorProps {
    error: Error
    reset: () => void
}

const Error = ({ error, reset }: ErrorProps) => {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div>
            <h2>Etwas ist falsch gelaufen :(</h2>
            <button onClick={() => reset()}>Try again</button>
        </div>
    )
}

export default Error
