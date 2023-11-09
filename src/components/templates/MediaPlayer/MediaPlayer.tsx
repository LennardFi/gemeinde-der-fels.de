"use client"

import Loader from "@/components/Feedback/Loader"
import IconButton from "@/components/inputs/IconButton"
import Slider, { SliderProps } from "@/components/inputs/Slider"
import { secondsToTimeStamp } from "@/lib/shared/helpers"
import Website from "@/typings"
import useAudioPlayerZustand from "@/zustand/useAudioPlayerZustand"
import useSettingsZustand from "@/zustand/useSettingsZustand"
import { Howler } from "howler"
import { HTMLAttributes, useEffect } from "react"
import {
    FaPause,
    FaPlay,
    FaRedoAlt,
    FaStepBackward,
    FaVolumeMute,
    FaVolumeUp,
} from "react-icons/fa"
import Skeleton from "react-loading-skeleton"
import styles from "./MediaPlayer.module.scss"

export interface MediaPlayerProps extends HTMLAttributes<HTMLDivElement> {
    themeColor?: Website.Design.ThemeColor
    timeSliderProps?: Omit<SliderProps, "max" | "min" | "onChange" | "value">
    volumeSliderProps?: Omit<SliderProps, "max" | "min" | "onChange" | "value">
}

export default function MediaPlayer({
    className,
    hidden,
    timeSliderProps,
    themeColor,
    volumeSliderProps,
    ...rest
}: MediaPlayerProps) {
    const audioPlayerZustand = useAudioPlayerZustand((state) => ({
        duration: state.duration,
        error: state.error,
        finished: state.finished,
        isLoading: state.isLoading,
        isPlaying: state.isPlaying,
        muted: state.muted,
        pause: state.pause,
        play: state.play,
        playingMedia: state.playingMedia,
        reset: state.reset,
        secondsPassed: state.secondsPassed,
        seek: state.seek,
        setMuted: state.setMuted,
        setVolume: state.setVolume,
        stop: state.stop,
        volume: state.volume,
    }))
    const { audioSettings, loaded, updateSettings } = useSettingsZustand(
        (state) => ({
            audioSettings: state.audioSettings,
            loaded: state.loaded,
            updateSettings: state.updateSettings,
        }),
    )

    useEffect(() => {
        Howler.unload()
        Howler.autoUnlock = false

        return () => {
            audioPlayerZustand.reset()
        }
    }, [])

    useEffect(() => {
        if (!loaded) {
            return
        }

        if (audioPlayerZustand.muted !== audioSettings.muted) {
            audioPlayerZustand.setMuted(audioSettings.muted)
        }
        if (audioPlayerZustand.volume !== audioSettings.volume) {
            audioPlayerZustand.setVolume(audioSettings.volume)
        }
    }, [loaded])

    useEffect(() => {
        if (!loaded) {
            return
        }

        let changedSettings = false

        if (audioPlayerZustand.muted !== audioSettings.muted) {
            changedSettings = true
        }
        if (audioPlayerZustand.volume !== audioSettings.volume) {
            changedSettings = true
        }

        if (changedSettings) {
            updateSettings({
                audioSettings: {
                    muted: audioPlayerZustand.muted,
                    volume: audioPlayerZustand.volume,
                },
            })
        }
    }, [audioPlayerZustand.muted, audioPlayerZustand.volume])

    useEffect(() => {
        if (audioPlayerZustand.isPlaying) {
            navigator.mediaSession.playbackState = "playing"
        } else if (
            !audioPlayerZustand.isLoading &&
            !audioPlayerZustand.finished &&
            audioPlayerZustand.error === undefined
        ) {
            navigator.mediaSession.playbackState = "paused"
        } else {
            navigator.mediaSession.playbackState = "none"
        }

        if (audioPlayerZustand.playingMedia !== undefined) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: audioPlayerZustand.playingMedia.title,
                artist: audioPlayerZustand.playingMedia.performer,
            })
            navigator.mediaSession.setActionHandler(
                "play",
                audioPlayerZustand.play,
            )
            navigator.mediaSession.setActionHandler(
                "pause",
                audioPlayerZustand.pause,
            )
            navigator.mediaSession.setActionHandler(
                "stop",
                audioPlayerZustand.stop,
            )
            navigator.mediaSession.setActionHandler("seekto", (e) => {
                if (e.seekTime !== undefined) {
                    audioPlayerZustand.seek(e.seekTime)
                }
            })
        } else {
            navigator.mediaSession.metadata = null
        }
    }, [
        audioPlayerZustand.isPlaying,
        audioPlayerZustand.playingMedia,
        audioPlayerZustand.play,
        audioPlayerZustand.pause,
        audioPlayerZustand.stop,
    ])

    useEffect(() => {
        if (
            audioPlayerZustand.duration !== undefined &&
            audioPlayerZustand.secondsPassed !== undefined
        ) {
            console.log({
                duration: audioPlayerZustand.duration,
                durationTs: secondsToTimeStamp(
                    audioPlayerZustand.duration,
                    "oneDigit",
                    true,
                ),
                secondsPassed: audioPlayerZustand.secondsPassed,
                secondsPassedTs: secondsToTimeStamp(
                    audioPlayerZustand.secondsPassed,
                    "oneDigit",
                    true,
                ),
            })
            navigator.mediaSession.setPositionState({
                duration: audioPlayerZustand.duration,
                playbackRate: 1,
                position: audioPlayerZustand.secondsPassed,
            })
        }
    }, [audioPlayerZustand.duration, audioPlayerZustand.secondsPassed])

    if (hidden) {
        return <Skeleton height={136} width="100%" />
    }
    const { className: timeSliderClassName, ...timeSliderPropsRest } =
        timeSliderProps ?? {}
    const { className: volumeSliderClassName, ...volumeSliderPropsRest } =
        volumeSliderProps ?? {}

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
                    {audioPlayerZustand.playingMedia?.title ??
                        "Kein Lied ausgewählt"}
                </span>
                <span className={styles.performer}>
                    {audioPlayerZustand.playingMedia?.performer ?? ""}
                </span>
                <span className={styles.album}>
                    {audioPlayerZustand.playingMedia?.album ?? ""}
                </span>
            </div>
            <div className={`${styles.timeSliderContainer}`}>
                <Slider
                    {...timeSliderPropsRest}
                    className={`${styles.timeSlider} ${
                        timeSliderClassName ?? ""
                    }`}
                    max={audioPlayerZustand.duration}
                    min={0}
                    onAfterChange={(newSecondsPassed) => {
                        audioPlayerZustand.seek(newSecondsPassed)
                    }}
                    showLabel
                    formatLabel={(value) => (
                        <>{secondsToTimeStamp(value, true)}</>
                    )}
                    themeColor={themeColor}
                    value={audioPlayerZustand.secondsPassed}
                />
                <span className={styles.timeCodeContainer}>
                    <span className={styles.timeCode}>
                        {audioPlayerZustand.secondsPassed === undefined
                            ? "-:--:--"
                            : secondsToTimeStamp(
                                  audioPlayerZustand.secondsPassed,
                                  "oneDigit",
                                  true,
                              )}
                    </span>
                    &nbsp;/&nbsp;
                    <span>
                        {audioPlayerZustand.duration === undefined
                            ? "-:--:--"
                            : secondsToTimeStamp(
                                  audioPlayerZustand.duration,
                                  "oneDigit",
                                  true,
                              )}
                    </span>
                </span>
            </div>
            <div className={styles.controls}>
                <IconButton
                    disabled={audioPlayerZustand.playingMedia === undefined}
                    onClick={() => audioPlayerZustand.seek(0)}
                >
                    <FaStepBackward />
                </IconButton>
                <IconButton
                    className={
                        audioPlayerZustand.isLoading
                            ? styles.loaderButton ?? ""
                            : undefined
                    }
                    disabled={audioPlayerZustand.playingMedia === undefined}
                    // noFocusColor
                    onClick={
                        audioPlayerZustand.isPlaying
                            ? audioPlayerZustand.pause
                            : audioPlayerZustand.play
                    }
                >
                    {audioPlayerZustand.isLoading ? (
                        <Loader
                            height={16}
                            width={4}
                            className={styles.loader}
                        />
                    ) : audioPlayerZustand.finished ? (
                        <FaRedoAlt />
                    ) : audioPlayerZustand.isPlaying ? (
                        <FaPause />
                    ) : (
                        <FaPlay />
                    )}
                </IconButton>
                <IconButton
                    onClick={() =>
                        audioPlayerZustand.setMuted(!audioPlayerZustand.muted)
                    }
                >
                    {audioPlayerZustand.muted ? (
                        <FaVolumeMute />
                    ) : (
                        <FaVolumeUp />
                    )}
                </IconButton>
                <Slider
                    {...volumeSliderPropsRest}
                    className={`${styles.volumeSlider ?? ""} ${
                        playerThemeClassName ?? ""
                    } ${volumeSliderClassName ?? ""}`}
                    max={1}
                    min={0}
                    step={0.05}
                    onChange={(newVolume) => {
                        audioPlayerZustand.setVolume(newVolume)
                    }}
                    showLabel
                    formatLabel={(value) => <>{Math.round(value * 100)}%</>}
                    themeColor={themeColor}
                    value={audioPlayerZustand.volume}
                />
            </div>
        </div>
    )
}
