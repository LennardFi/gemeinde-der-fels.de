import Loader from "@/components/Feedback/Loader"
import IconButton from "@/components/inputs/IconButton"
import useIsMounted from "@/hooks/useIsMounted"
import { useEffect, useState } from "react"
import { FaPause, FaPlay, FaRedoAlt } from "react-icons/fa"
import styles from "./SermonListPlayButton.module.scss"

export interface SermonListPlayButtonProps {
    finished: boolean
    isLoading: boolean
    isPlaying: boolean
    pause(): void
    play(): void
    start(): void
}

export default function SermonListPlayButton({
    finished,
    isLoading,
    isPlaying,
    pause,
    play,
    start,
}: SermonListPlayButtonProps) {
    const isMountedRef = useIsMounted()
    const [preventLoader, setPreventLoader] = useState(false)

    useEffect(() => {
        if (preventLoader) {
            const timeoutHandle = window.setTimeout(() => {
                if (isMountedRef.current) {
                    setPreventLoader(false)
                }
            }, 500)

            return () => {
                window.clearTimeout(timeoutHandle)
                setPreventLoader(false)
            }
        }
    }, [preventLoader])

    if (isPlaying) {
        return (
            <IconButton onClick={pause}>
                <FaPause />
            </IconButton>
        )
    }

    if (isLoading && preventLoader) {
        return (
            <IconButton disabled>
                <FaPlay />
            </IconButton>
        )
    }

    if (isLoading) {
        return (
            <IconButton className={styles.loaderButton} disabled>
                <Loader height={24} width={4} className={styles.loader} />
            </IconButton>
        )
    }

    if (finished) {
        return (
            <IconButton
                onClick={() => {
                    setPreventLoader(true)
                    start()
                }}
            >
                <FaRedoAlt />
            </IconButton>
        )
    }

    return (
        <IconButton
            onClick={() => {
                setPreventLoader(true)
                play()
            }}
        >
            <FaPlay />
        </IconButton>
    )
}
