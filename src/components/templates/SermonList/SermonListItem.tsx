import { formatPlainDate } from "@/lib/shared/helpers"
import Website from "@/typings"
import useAudioPlayerZustand from "@/zustand/useAudioPlayerZustand"
import { FaExclamationCircle } from "react-icons/fa"
import styles from "./SermonListItem.module.scss"
import SermonListPlayButton from "./SermonListPlayButton"

export interface SermonListItemProps {
    entry: Website.Content.Sermons.Sermon
    autoplay?: boolean
    highlighted?: boolean
    open?: boolean
    preload?: boolean
    themeColor?: Website.Design.ThemeColor
}

export default function SermonListItem({
    autoplay,
    entry,
    highlighted,
    open,
    preload,
    themeColor,
}: SermonListItemProps) {
    const {
        error,
        finished,
        isLoading,
        isPlaying,
        pause,
        play,
        playingMedia,
        start,
    } = useAudioPlayerZustand((state) => ({
        error: state.error,
        finished: state.finished,
        isLoading: state.isLoading,
        isPlaying: state.isPlaying,
        pause: state.pause,
        play: state.play,
        playingMedia: state.playingMedia,
        start: state.start,
    }))

    const isSelectedMedia = playingMedia?.fileId === entry.audioFileId

    const playerThemeClassName =
        themeColor === "primary"
            ? styles.primary
            : themeColor === "secondary"
            ? styles.secondary
            : styles.accent

    return (
        <>
            <td
                className={`${styles.cell} ${
                    isSelectedMedia ? styles.isPlayingMedia : ""
                } ${playerThemeClassName ?? ""} ${
                    highlighted ? styles.highlighted : ""
                } ${styles.titleCell} `}
            >
                {entry.title}
            </td>
            <td
                className={`${styles.cell} ${
                    isSelectedMedia ? styles.isPlayingMedia : ""
                } ${playerThemeClassName ?? ""} ${
                    highlighted ? styles.highlighted : ""
                } ${styles.speakerCell}`}
            >
                {entry.speaker.name}
            </td>
            <td
                className={`${styles.cell} ${
                    isSelectedMedia ? styles.isPlayingMedia : ""
                } ${playerThemeClassName ?? ""} ${
                    highlighted ? styles.highlighted : ""
                } ${styles.speakerCell}`}
            >
                {formatPlainDate(entry.date)}
            </td>
            <td
                className={`${styles.cell} ${
                    isSelectedMedia ? styles.isPlayingMedia : ""
                } ${playerThemeClassName ?? ""} ${
                    highlighted ? styles.highlighted : ""
                } ${styles.playButtonCell}`}
            >
                {error !== undefined &&
                playingMedia?.fileId === entry.audioFileId ? (
                    <>
                        <FaExclamationCircle />{" "}
                        {error === "loading"
                            ? "Ladefehler"
                            : error === "playing"
                            ? "Abspielfehler"
                            : ""}
                    </>
                ) : (
                    <SermonListPlayButton
                        className={`${styles.playButton}`}
                        finished={isSelectedMedia && finished}
                        highlighted={highlighted}
                        isLoading={isSelectedMedia && isLoading}
                        isPlaying={isSelectedMedia && isPlaying}
                        pause={isSelectedMedia ? pause : () => {}}
                        play={
                            isSelectedMedia
                                ? play
                                : () =>
                                      start({
                                          album: entry.series?.title,
                                          fileId: entry.audioFileId,
                                          format: entry.audioFileFormat,
                                          id: entry.id,
                                          performer: entry.speaker.name,
                                          title: entry.title,
                                      })
                        }
                        round
                        start={() =>
                            start({
                                album: entry.series?.title,
                                fileId: entry.audioFileId,
                                format: entry.audioFileFormat,
                                id: entry.id,
                                performer: entry.speaker.name,
                                title: entry.title,
                            })
                        }
                    />
                )}
            </td>
        </>
    )
}
