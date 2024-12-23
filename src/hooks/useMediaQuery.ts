import { useEffect, useState } from "react"

const useMediaQuery = (query: string): boolean => {
    const getMatches = (query: string): boolean => {
        // Prevents SSR issues
        if (typeof window !== "undefined") {
            return window.matchMedia(query).matches
        }
        return false
    }

    const [matches, setMatches] = useState<boolean>(getMatches(query))

    function handleChange() {
        setMatches(getMatches(query))
    }

    useEffect(() => {
        const matchMedia = window.matchMedia(query)

        // Triggered at the first client-side load and if query changes
        handleChange()

        // Listen matchMedia
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        if (matchMedia.addListener) {
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            matchMedia.addListener(handleChange)
        } else {
            matchMedia.addEventListener("change", handleChange)
        }

        return () => {
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            if (matchMedia.removeListener) {
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                matchMedia.removeListener(handleChange)
            } else {
                matchMedia.removeEventListener("change", handleChange)
            }
        }
    }, [query])

    return matches
}

export default useMediaQuery
