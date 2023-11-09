import Loader from "@/components/Feedback/Loader"
import IconButton, { IconButtonProps } from "@/components/inputs/IconButton"
import useIsMounted from "@/hooks/useIsMounted"
import { useEffect, useState } from "react"
import { FaPause, FaPlay, FaRedoAlt } from "react-icons/fa"
import styles from "./SermonListPlayButton.module.scss"

export interface SermonListPlayButtonProps extends IconButtonProps {
    finished: boolean
    isLoading: boolean
    isPlaying: boolean
    pause(): void
    play(): void
    start(): void
    highlighted?: boolean
}

export default function SermonListPlayButton({
    className,
    finished,
    highlighted,
    isLoading,
    isPlaying,
    pause,
    play,
    start,
    ...rest
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
            <IconButton
                {...rest}
                className={`${className ?? ""}`}
                onClick={pause}
            >
                <FaPause />
            </IconButton>
        )
    }

    if (isLoading && preventLoader) {
        return (
            <IconButton {...rest} className={`${className ?? ""}`} disabled>
                <FaPlay />
            </IconButton>
        )
    }

    if (isLoading) {
        return (
            <IconButton
                {...rest}
                className={`${className ?? ""} ${styles.loaderButton}`}
                disabled
            >
                <Loader
                    height={24}
                    width={4}
                    className={styles.loader}
                    themeColor="primary"
                    themeColorVariant="font"
                />
            </IconButton>
        )
    }

    if (finished) {
        return (
            <IconButton
                {...rest}
                className={`${className ?? ""}`}
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
            {...rest}
            className={`${className ?? ""}`}
            onClick={() => {
                setPreventLoader(true)
                play()
            }}
        >
            <FaPlay />
        </IconButton>
    )
}
