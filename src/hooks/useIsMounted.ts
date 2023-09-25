import { MutableRefObject, useEffect, useRef } from "react"

export default function useIsMounted(): MutableRefObject<boolean> {
    const renderedRef = useRef(false)

    useEffect(() => {
        renderedRef.current = true

        return () => {
            renderedRef.current = false
        }
    }, [])

    return renderedRef
}
