import ButtonLink from "@/components/inputs/ButtonLink"
import { formatPlainDate } from "@/lib/shared/helpers"
import Website from "@/typings"
import useAudioPlayerZustand from "@/zustand/useAudioPlayerZustand"
import { useRef } from "react"
import { FaDownload, FaExclamationCircle } from "react-icons/fa"
import styles from "./SermonListItem.module.scss"
import SermonListPlayButton from "./SermonListPlayButton"

export interface SermonListItemProps {
    entry: Website.Content.Sermons.Sermon
    autoplay?: boolean
    highlighted?: boolean
    onSelect?: () => void
    onUnselect?: () => void
    preload?: boolean
    selected?: boolean
    themeColor?: Website.Design.ThemeColor
}

export default function SermonListItem({
    autoplay,
    entry,
    highlighted,
    onSelect,
    onUnselect,
    preload,
    selected,
    themeColor,
}: SermonListItemProps) {
    const cellRef = useRef<HTMLTableCellElement | null>(null)
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

    const themeColorOrDefault = themeColor ?? "accent"

    const isPlayingMedia = playingMedia?.id === entry.audioFileId

    // const playingMediaThemeColor: Website.Design.ThemeColor =
    //     themeColor === "primary"
    //         ? "secondary"
    //         : themeColor === "secondary"
    //         ? "primary"
    //         : "secondary"

    if (selected) {
        return (
            <tr>
                <td
                    className={`${styles.cell} ${styles.isSelectedMedia} ${
                        isPlayingMedia ? styles.isPlayingMedia : ""
                    } ${highlighted ? styles.highlighted : ""}`}
                    colSpan={4}
                    data-theme={themeColorOrDefault}
                    onClick={(e) => {
                        if (!document.getSelection()?.isCollapsed) {
                            return
                        }
                        e.preventDefault()
                        e.stopPropagation()
                        onUnselect?.()
                    }}
                    ref={cellRef}
                    role="button"
                >
                    <div className={styles.wrapper}>
                        <div className={styles.labels}>
                            <div className={styles.title}>{entry.title}</div>
                            <div className={styles.speaker}>
                                {entry.speaker.name}
                            </div>
                        </div>
                        <div className={styles.actions}>
                            {/* <IconButton
                            className={`${styles.button}`}
                            onClick={onUnselect}
                            themeColor={isPlayingMedia ? "primary" : "accent"}
                            variant={isPlayingMedia ? "text" : "contained"}
                        >
                            <FaCompressAlt />
                        </IconButton> */}
                            {error !== undefined &&
                            playingMedia?.id === entry.audioFileId ? (
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
                                    className={`${styles.button} ${styles.playButton}`}
                                    finished={isPlayingMedia && finished}
                                    highlighted={highlighted}
                                    isLoading={isPlayingMedia && isLoading}
                                    isPlaying={isPlayingMedia && isPlaying}
                                    isPlayingMedia={isPlayingMedia}
                                    pause={isPlayingMedia ? pause : () => {}}
                                    play={
                                        isPlayingMedia
                                            ? play
                                            : () =>
                                                  start({
                                                      album: entry.series
                                                          ?.title,
                                                      fileId: entry.audioFileId,
                                                      format: entry.audioFileFormat,
                                                      id: entry.id,
                                                      performer:
                                                          entry.speaker.name,
                                                      title: entry.title,
                                                  })
                                    }
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
                                    themeColor={themeColor}
                                    variant={
                                        isPlayingMedia ? "text" : "contained"
                                    }
                                />
                            )}
                            <ButtonLink
                                className={`${styles.button}`}
                                containedHover
                                href={`/api/files/${
                                    entry.audioFileId
                                }/${formatPlainDate(entry.date)} - ${
                                    entry.speaker.name
                                } - ${entry.title}.${entry.audioFileFormat}`}
                                rel="noreferrer noopener"
                                target="_blank"
                                themeColor={themeColor}
                                variant="outlined"
                            >
                                <FaDownload />
                            </ButtonLink>
                        </div>
                        <div className={styles.details}>
                            <ul>
                                {entry.series !== undefined ? (
                                    <li>
                                        <b>Predigtreihe:</b>&nbsp;
                                        {entry.series.title}
                                    </li>
                                ) : null}
                            </ul>
                        </div>
                    </div>
                </td>
            </tr>
        )
    }

    return (
        <tr>
            <td
                className={`${styles.cell} ${
                    isPlayingMedia ? styles.isPlayingMedia : ""
                } ${highlighted ? styles.highlighted : ""} ${
                    styles.titleCell
                } `}
                data-theme={themeColorOrDefault}
                onClick={onSelect}
                role="button"
            >
                {entry.title}
            </td>
            <td
                className={`${styles.cell} ${
                    isPlayingMedia ? styles.isPlayingMedia : ""
                } ${highlighted ? styles.highlighted : ""} ${
                    styles.speakerCell
                }`}
                data-theme={themeColorOrDefault}
                onClick={onSelect}
                role="button"
            >
                {entry.speaker.name}
            </td>
            <td
                className={`${styles.cell} ${
                    isPlayingMedia ? styles.isPlayingMedia : ""
                } ${highlighted ? styles.highlighted : ""} ${styles.dateCell}`}
                data-theme={themeColorOrDefault}
                onClick={onSelect}
                role="button"
            >
                {formatPlainDate(entry.date)}
            </td>
            <td
                className={`${styles.cell} ${
                    isPlayingMedia ? styles.isPlayingMedia : ""
                } ${highlighted ? styles.highlighted : ""} ${
                    styles.playButtonCell
                }`}
                data-theme={themeColorOrDefault}
                onClick={onSelect}
                role="button"
            >
                {error !== undefined &&
                playingMedia?.id === entry.audioFileId ? (
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
                        finished={isPlayingMedia && finished}
                        highlighted={highlighted}
                        isLoading={isPlayingMedia && isLoading}
                        isPlaying={isPlayingMedia && isPlaying}
                        isPlayingMedia={isPlayingMedia}
                        pause={isPlayingMedia ? pause : () => {}}
                        play={
                            isPlayingMedia
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
                        themeColor={themeColor}
                    />
                )}
            </td>
        </tr>
    )
}
