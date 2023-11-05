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
    mute(muted: boolean): void
    muted: boolean
    play(): void
    pause(): void
    reset(): void
    seek(seconds: number): void
    secondsPassed: number
    start(audioFile: Readonly<Website.Content.Audio.AudioFile>): void
    duration?: number
    error?: MediaPlayerError
    playingMedia?: Readonly<Website.Content.Audio.AudioFile>
}

const initialZustand: Omit<
    AudioPlayerZustand,
    "mute" | "play" | "pause" | "reset" | "seek" | "start"
> = {
    duration: 0,
    finished: false,
    isLoading: false,
    isPlaying: false,
    muted: false,
    playingMedia: undefined,
    secondsPassed: 0,
    error: undefined,
}

const useAudioPlayerZustand = create<AudioPlayerZustand>()((set) => {
    let playState: Maybe<PlayState> = undefined
    let secondsPassedUpdateStartTimestamp: Maybe<number> = undefined
    let lastSecondsPassedUpdateTimestamp: Maybe<number> = undefined

    const setupInterval = () => {
        console.log("setup Interval")

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
                        return {}
                    }

                    if (!playState.howl.playing(playState.howlId)) {
                        return {}
                    }

                    const currentSeconds = playState.howl.seek()

                    console.log("interval", { currentSeconds })

                    return {
                        secondsPassed: currentSeconds,
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

    const mute: AudioPlayerZustand["mute"] = () =>
        set((state) => {
            if (playState === undefined) {
                return {}
            }

            playState.howl.mute(!state.muted, playState.howlId)

            return {
                muted: !state.muted,
            }
        })

    const play: AudioPlayerZustand["play"] = () =>
        set(() => {
            if (playState === undefined) {
                return {}
            }

            const secondsPassed = playState.howl.seek()

            if (playState.seekInterval !== undefined) {
                window.cancelAnimationFrame(playState.seekInterval)
                playState.seekInterval = undefined
            }

            playState.howlId = playState.howl.play(playState.howlId)
            playState.howl.seek(secondsPassed, playState.howlId)

            playState.seekInterval = setupInterval()

            return { isPlaying: true }
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

            playState.howl.pause(playState.howlId)

            const secondsPassed = playState.howl.seek()
            console.log("pause", { secondsPassed })

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

        // if (playState.seekInterval !== undefined) {
        //     window.cancelAnimationFrame(playState.seekInterval)
        //     console.log("cleared interval")
        //     playState.seekInterval = undefined
        // }

        if (!playState.howl.playing(playState.howlId)) {
            return
        }

        console.log("seek")

        playState.howl.seek(seconds, playState.howlId)
        // playState.seekInterval = setupInterval()
    }

    const start: AudioPlayerZustand["start"] = (audioFile) =>
        set((state) => {
            if (playState !== undefined) {
                if (playState.audioFile.fileId === audioFile.fileId) {
                    playState.howlId = playState.howl.play()
                    playState.howl.seek(0, playState.howlId)

                    return {}
                }

                if (playState.seekInterval !== undefined) {
                    window.cancelAnimationFrame(playState.seekInterval)
                    playState.seekInterval = undefined
                }
                playState.howl.unload()
                playState = undefined
            }

            playState = {
                audioFile: audioFile,
                howl: new Howl({
                    src: `/api/files/${audioFile.fileId}`,
                    autoplay: true,
                    format: audioFile.format,
                    html5: true,
                    mute: state.muted,
                    volume: 0.5, // TODO: read volume from state
                    onend: () =>
                        useAudioPlayerZustand.setState(() => {
                            return { finished: true, isPlaying: false }
                        }),
                    onload: () =>
                        useAudioPlayerZustand.setState(() => {
                            if (playState === undefined) {
                                return {}
                            }

                            const duration = playState.howl.duration(
                                playState.howlId,
                            )

                            return {
                                duration,
                                isLoading: false,
                            }
                        }),
                    onloaderror: () =>
                        useAudioPlayerZustand.setState(() => {
                            return { error: "loading", isLoading: false }
                        }),
                    onpause: () =>
                        useAudioPlayerZustand.setState(() => {
                            if (playState !== undefined) {
                                if (playState.seekInterval !== undefined) {
                                    window.cancelAnimationFrame(
                                        playState.seekInterval,
                                    )
                                    playState.seekInterval = undefined
                                }
                            }

                            return { isPlaying: false }
                        }),
                    onplay: () =>
                        useAudioPlayerZustand.setState(() => {
                            if (playState !== undefined) {
                                if (playState.seekInterval !== undefined) {
                                    window.cancelAnimationFrame(
                                        playState.seekInterval,
                                    )
                                    playState.seekInterval = undefined
                                }
                                playState.seekInterval = setupInterval()
                            }

                            return { isPlaying: true }
                        }),
                    onplayerror: () =>
                        useAudioPlayerZustand.setState(() => {
                            if (playState !== undefined) {
                                if (playState.seekInterval !== undefined) {
                                    window.cancelAnimationFrame(
                                        playState.seekInterval,
                                    )
                                    playState.seekInterval = undefined
                                }
                            }

                            return { error: "playing", isPlaying: false }
                        }),
                    onseek: () =>
                        useAudioPlayerZustand.setState(() => {
                            console.log("seek")

                            if (playState === undefined) {
                                return {}
                            }

                            if (!playState.howl.playing(playState.howlId)) {
                                return {}
                            }

                            const secondsPassed = playState.howl.seek()

                            console.log("onseek", { secondsPassed })

                            return {
                                secondsPassed,
                            }
                        }),
                    onstop: () =>
                        useAudioPlayerZustand.setState((state) => {
                            if (playState === undefined) {
                                return {}
                            }

                            if (
                                state.playingMedia !== undefined &&
                                playState.audioFile.fileId ===
                                    state.playingMedia.fileId
                            ) {
                                return {}
                            }

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
                                isPlaying: false,
                                playingMedia: undefined,
                                secondsPassed: 0,
                            }
                        }),
                }),
            }

            return {
                finished: false,
                isPlaying: false,
                isLoading: true,
                playingMedia: audioFile,
                secondsPassed: 0,
            }
        })

    return {
        ...initialZustand,
        mute,
        play,
        pause,
        reset,
        seek,
        start,
    }
})

export default useAudioPlayerZustand
