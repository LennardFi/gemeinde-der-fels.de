"use client"

import Loader from "@/components/Feedback/Loader"
import IconButton from "@/components/inputs/IconButton"
import Slider, { SliderProps } from "@/components/inputs/Slider"
import Website from "@/typings"
import useAudioPlayerZustand from "@/zustand/useAudioPlayerZustand"
import { Howler } from "howler"
import { HTMLAttributes, useEffect } from "react"
import {
    FaPause,
    FaPlay,
    FaStepBackward,
    FaVolumeMute,
    FaVolumeUp,
} from "react-icons/fa"
import styles from "./MediaPlayer.module.scss"

export interface MediaPlayerProps extends HTMLAttributes<HTMLDivElement> {
    sliderProps?: Omit<SliderProps, "max" | "min" | "onChange" | "value">
    themeColor?: Website.Design.ThemeColor
}

export default function MediaPlayer({
    className,
    hidden,
    sliderProps,
    themeColor,
    ...rest
}: MediaPlayerProps) {
    const zustand = useAudioPlayerZustand((state) => ({
        error: state.error,
        duration: state.duration,
        finished: state.finished,
        isLoading: state.isLoading,
        isPlaying: state.isPlaying,
        mute: state.mute,
        muted: state.muted,
        reset: state.reset,
        pause: state.pause,
        play: state.play,
        playingMedia: state.playingMedia,
        secondsPassed: state.secondsPassed,
        seek: state.seek,
    }))

    useEffect(() => {
        Howler.unload()
        Howler.autoUnlock = false

        return () => {
            zustand.reset()
        }
    }, [])

    if (hidden) {
        return null
    }
    const { className: sliderClassName, ...sliderPropsRest } = sliderProps ?? {}

    const playerThemeClassName =
        themeColor === "primary"
            ? styles.primary
            : themeColor === "secondary"
            ? styles.secondary
            : styles.accent

    return (
        <div
            {...rest}
            className={`${styles.player} ${playerThemeClassName ?? ""} ${
                className ?? ""
            }`}
        >
            <div className={styles.labels}>
                <span className={styles.title}>
                    {zustand.playingMedia?.title ?? "Kein Lied ausgewählt"}
                </span>
                <span className={styles.performer}>
                    {zustand.playingMedia?.performer ?? ""}
                </span>
            </div>
            <div className={styles.controls}>
                <IconButton onClick={() => zustand.seek(0)}>
                    <FaStepBackward />
                </IconButton>
                <IconButton
                    className={
                        zustand.isLoading
                            ? styles.loaderButton ?? ""
                            : undefined
                    }
                    noFocusColor
                    onClick={zustand.isPlaying ? zustand.pause : zustand.play}
                >
                    {zustand.isLoading ? (
                        <Loader
                            height={16}
                            width={4}
                            className={styles.loader}
                        />
                    ) : zustand.isPlaying ? (
                        <FaPause />
                    ) : (
                        <FaPlay />
                    )}
                </IconButton>
                <IconButton onClick={() => zustand.mute(!zustand.muted)}>
                    {zustand.muted ? <FaVolumeMute /> : <FaVolumeUp />}
                </IconButton>
            </div>
            <div className={`${styles.sliderContainer}`}>
                <Slider
                    {...sliderPropsRest}
                    className={`${styles.slider} ${sliderClassName ?? ""}`}
                    max={zustand.duration}
                    min={0}
                    onAfterChange={(newSecondsPassed) => {
                        zustand.seek(newSecondsPassed)
                    }}
                    showLabel
                    themeColor={themeColor}
                    value={zustand.secondsPassed}
                />
                <span className={styles.sliderValue}>
                    {`${Math.floor(zustand.secondsPassed / 60)
                        .toString()
                        .padStart(2, "0")}:${Math.floor(
                        zustand.secondsPassed % 60,
                    )
                        .toString()
                        .padStart(2, "0")}`}
                </span>
            </div>
        </div>
    )
}
