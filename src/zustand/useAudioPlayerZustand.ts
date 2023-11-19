import Website, { Maybe } from "@/typings"
import { Howl } from "howler"
import { create } from "zustand"

export interface PlayState {
    audioFile: Readonly<Website.Content.Audio.AudioFile>
    howl: Howl
    howlId?: number
    seekInterval?: number
}

export type MediaPlayerError = "loading" | "playing"

export interface AudioPlayerZustand {
    finished: boolean
    isPlaying: boolean
    isLoading: boolean
    muted: boolean
    play(): void
    pause(): void
    reset(): void
    seek(seconds: number): void
    secondsPassed?: number
    setMuted(muted: boolean): void
    setVolume(volume: number): void
    start(audioFile: Readonly<Website.Content.Audio.AudioFile>): void
    stop(): void
    /**
     * Number between `0` and `1`
     */
    volume: number
    duration?: number
    error?: MediaPlayerError
    playingMedia?: Readonly<Website.Content.Audio.AudioFile>
}

const initialZustand: Omit<
    AudioPlayerZustand,
    | "play"
    | "pause"
    | "reset"
    | "seek"
    | "setMuted"
    | "setVolume"
    | "start"
    | "stop"
> = {
    duration: undefined,
    error: undefined,
    finished: false,
    isLoading: false,
    isPlaying: false,
    muted: false,
    playingMedia: undefined,
    secondsPassed: undefined,
    volume: 1,
}

const useAudioPlayerZustand = create<AudioPlayerZustand>()((set) => {
    let playState: Maybe<PlayState> = undefined
    let secondsPassedUpdateStartTimestamp: Maybe<number> = undefined
    let lastSecondsPassedUpdateTimestamp: Maybe<number> = undefined

    const setupInterval = () => {
        if (playState?.seekInterval !== undefined) {
            window.cancelAnimationFrame(playState.seekInterval)
            playState.seekInterval = undefined
            // window.clearInterval(playState.seekInterval)
        }

        const updateSecondsPassedCallback = (time: number) => {
            if (secondsPassedUpdateStartTimestamp === undefined) {
                secondsPassedUpdateStartTimestamp = time
            }
            if (lastSecondsPassedUpdateTimestamp === undefined) {
                lastSecondsPassedUpdateTimestamp = time
            }

            const timeElapsed =
                lastSecondsPassedUpdateTimestamp -
                secondsPassedUpdateStartTimestamp

            if (timeElapsed > 500) {
                useAudioPlayerZustand.setState(() => {
                    if (playState === undefined) {
                        return { secondsPassed: undefined }
                    }

                    if (!playState.howl.playing(playState.howlId)) {
                        return { secondsPassed: undefined }
                    }

                    const currentSeconds = playState.howl.seek(playState.howlId)

                    return {
                        secondsPassed: Math.round(currentSeconds),
                    }
                })
            }

            lastSecondsPassedUpdateTimestamp = time

            if (playState !== undefined) {
                playState.seekInterval = window.requestAnimationFrame(
                    updateSecondsPassedCallback,
                )
            }
        }

        return window.requestAnimationFrame(updateSecondsPassedCallback)
    }

    const play: AudioPlayerZustand["play"] = () =>
        set(() => {
            if (playState === undefined) {
                return {}
            }

            if (playState.seekInterval !== undefined) {
                window.cancelAnimationFrame(playState.seekInterval)
                playState.seekInterval = undefined
            }

            playState.howlId = playState.howl.play(playState.howlId)

            playState.seekInterval = setupInterval()

            return { isPlaying: true, finished: false }
        })

    const pause: AudioPlayerZustand["pause"] = () =>
        set(() => {
            if (playState === undefined) {
                return { isPlaying: false }
            }

            if (playState.seekInterval !== undefined) {
                window.cancelAnimationFrame(playState.seekInterval)
                playState.seekInterval = undefined
            }

            playState.howl = playState.howl.pause(playState.howlId)

            const secondsPassed = Math.round(
                playState.howl.seek(playState.howlId),
            )

            return { isPlaying: false, secondsPassed }
        })

    const reset: AudioPlayerZustand["reset"] = () =>
        set(() => {
            if (playState !== undefined) {
                playState.howl.unload()
                if (playState.seekInterval !== undefined) {
                    window.cancelAnimationFrame(playState.seekInterval)
                    playState.seekInterval = undefined
                }
                playState = undefined
            }

            return initialZustand
        })

    const seek: AudioPlayerZustand["seek"] = (seconds) => {
        if (playState === undefined) {
            return
        }

        playState.howl = playState.howl.seek(seconds, playState.howlId)
    }

    const setMuted: AudioPlayerZustand["setMuted"] = (muted) =>
        set(() => {
            if (playState !== undefined) {
                playState.howl.mute(muted, playState.howlId)
            }

            return {
                muted,
            }
        })

    const setVolume: AudioPlayerZustand["setVolume"] = (volume) =>
        set(() => {
            if (playState !== undefined) {
                if (playState.howlId !== undefined) {
                    playState.howl.volume(volume, playState.howlId)
                }
            }

            return {
                volume,
            }
        })

    const start: AudioPlayerZustand["start"] = (audioFile) => {
        stop()
        // HOTFIX: `setTimeout`: Fix for race condition - needs improvement
        setTimeout(
            () =>
                set((state) => {
                    playState = {
                        audioFile: audioFile,
                        howl: new Howl({
                            src: `/api/files/${audioFile.fileId}`,
                            autoplay: true,
                            format: audioFile.format,
                            html5: true,
                            mute: state.muted,
                            volume: state.volume,
                            onend: (id) =>
                                useAudioPlayerZustand.setState((state) => {
                                    if (playState !== undefined) {
                                        playState.howlId = id

                                        if (
                                            playState.seekInterval !== undefined
                                        ) {
                                            window.cancelAnimationFrame(
                                                playState.seekInterval,
                                            )
                                            playState.seekInterval = undefined
                                        }
                                    }

                                    return { finished: true, isPlaying: false }
                                }),
                            onload: (id) =>
                                useAudioPlayerZustand.setState((state) => {
                                    if (playState === undefined) {
                                        return {}
                                    }

                                    playState.howlId = id

                                    const duration = Math.round(
                                        playState.howl.duration(
                                            playState.howlId,
                                        ),
                                    )

                                    return {
                                        duration,
                                        isLoading: false,
                                        secondsPassed: undefined,
                                    }
                                }),
                            onloaderror: (id) =>
                                useAudioPlayerZustand.setState((state) => {
                                    if (playState !== undefined) {
                                        playState.howlId = id
                                    }

                                    return {
                                        error: "loading",
                                        isLoading: false,
                                    }
                                }),
                            onpause: (id) =>
                                useAudioPlayerZustand.setState((state) => {
                                    if (playState !== undefined) {
                                        playState.howlId = id
                                        if (
                                            playState.seekInterval !== undefined
                                        ) {
                                            window.cancelAnimationFrame(
                                                playState.seekInterval,
                                            )
                                            playState.seekInterval = undefined
                                        }
                                    }

                                    return { isPlaying: false }
                                }),
                            onplay: (id) =>
                                useAudioPlayerZustand.setState((state) => {
                                    if (playState === undefined) {
                                        return {}
                                    }

                                    playState.howlId = id
                                    if (playState.seekInterval !== undefined) {
                                        window.cancelAnimationFrame(
                                            playState.seekInterval,
                                        )
                                        playState.seekInterval = undefined
                                    }
                                    playState.seekInterval = setupInterval()

                                    playState.howl.seek()

                                    return {
                                        isPlaying: true,
                                        secondsPassed: Math.round(
                                            playState.howl.seek(),
                                        ),
                                    }
                                }),
                            onplayerror: (id) =>
                                useAudioPlayerZustand.setState((state) => {
                                    if (playState !== undefined) {
                                        playState.howlId = id
                                        if (
                                            playState.seekInterval !== undefined
                                        ) {
                                            window.cancelAnimationFrame(
                                                playState.seekInterval,
                                            )
                                            playState.seekInterval = undefined
                                        }
                                    }

                                    return {
                                        error: "playing",
                                        isPlaying: false,
                                    }
                                }),
                            onseek: (id) =>
                                useAudioPlayerZustand.setState((state) => {
                                    if (playState === undefined) {
                                        return {}
                                    }

                                    playState.howl.mute(
                                        state.muted,
                                        playState.howlId,
                                    )

                                    return {
                                        secondsPassed: Math.round(
                                            playState.howl.seek(),
                                        ),
                                    }
                                }),
                            onstop: (id) =>
                                useAudioPlayerZustand.setState((state) => {
                                    if (playState === undefined) {
                                        return {}
                                    }

                                    playState.howlId = id

                                    if (playState.seekInterval !== undefined) {
                                        window.cancelAnimationFrame(
                                            playState.seekInterval,
                                        )
                                        playState.seekInterval = undefined
                                    }

                                    playState.howl.unload()
                                    playState = undefined

                                    return {
                                        finished: true,
                                        isLoading: false,
                                        isPlaying: false,
                                        playingMedia: undefined,
                                        secondsPassed: undefined,
                                    }
                                }),
                        }),
                    }

                    return {
                        duration: undefined,
                        finished: false,
                        isPlaying: false,
                        isLoading: true,
                        playingMedia: audioFile,
                        secondsPassed: undefined,
                    }
                }),
            0,
        )
    }

    const stop: AudioPlayerZustand["stop"] = () =>
        set((state) => {
            if (playState !== undefined) {
                if (playState.seekInterval !== undefined) {
                    window.cancelAnimationFrame(playState.seekInterval)
                    playState.seekInterval = undefined
                }

                playState.howl.unload()
            }

            return {
                duration: undefined,
                finished: false,
                isLoading: false,
                isPlaying: false,
                secondsPassed: undefined,
            }
        })

    return {
        ...initialZustand,
        play,
        pause,
        reset,
        seek,
        setMuted,
        setVolume,
        start,
        stop,
    }
})

export default useAudioPlayerZustand
