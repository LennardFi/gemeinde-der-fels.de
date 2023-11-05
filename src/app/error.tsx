"use client"

import { logError } from "@/lib/frontend/logger"
import { WebsiteError } from "@/lib/shared/errors"
import { useEffect } from "react"

interface ErrorProps {
    error: Error
    reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        if (error instanceof WebsiteError) {
            logError(error)

            return
        }

        // Log the error to an error reporting service
        console.error({ error })
    }, [error])

    return (
        <div>
            <h2>Etwas ist falsch gelaufen :(</h2>
            <button onClick={() => reset()}>Try again</button>
        </div>
    )
}
