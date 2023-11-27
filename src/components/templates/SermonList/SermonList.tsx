import Skeleton from "@/components/feedback/Skeleton"
import Website, { Maybe } from "@/typings"
import { HTMLAttributes, useState } from "react"
import { Temporal } from "temporal-polyfill"
import styles from "./SermonList.module.scss"
import SermonListItem from "./SermonListItem"

export interface SermonsListEntry
    extends Website.Api.Endpoints.SermonsListResponseBodyEntry {
    index: number
}

export interface SermonListProps extends HTMLAttributes<HTMLDivElement> {
    entries: Maybe<SermonsListEntry>[]
    loadNext?: () => void
    endOfData?: boolean
    isLoading?: boolean
    themeColor?: Website.Design.ThemeColor
}

export default function SermonsList({
    className,
    entries,
    loadNext,
    endOfData,
    isLoading,
    themeColor,
    ...rest
}: SermonListProps) {
    const [selectedSermon, setSelectedSermon] = useState<Maybe<number>>()

    const themeClassName =
        themeColor === "primary"
            ? styles.primary
            : themeColor === "secondary"
              ? styles.secondary
              : styles.accent

    return (
        <>
            <table
                className={`${styles.sermonsTableContainer} ${
                    themeClassName ?? ""
                } ${className ?? ""}`}
                {...rest}
            >
                <thead>
                    <tr>
                        <th className={`${styles.title}`}>Titel</th>
                        <th className={`${styles.speaker}`}>Sprecher/-in</th>
                        <th className={`${styles.date}`}>Datum</th>
                        <th className={`${styles.playAudio}`}>Audio</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, i) => {
                        if (entry === undefined) {
                            return (
                                <tr key={i}>
                                    <td colSpan={10}>
                                        <Skeleton height="2rem" width="100%" />
                                    </td>
                                </tr>
                            )
                        }

                        return (
                            <SermonListItem
                                key={entry.id}
                                entry={{
                                    ...entry,
                                    date: Temporal.Instant.fromEpochMilliseconds(
                                        entry.date,
                                    )
                                        .toZonedDateTimeISO("UTC")
                                        .toPlainDate(),
                                }}
                                highlighted={!(i % 2)}
                                onSelect={() => setSelectedSermon(entry.id)}
                                onUnselect={
                                    selectedSermon === entry.id
                                        ? () => setSelectedSermon(undefined)
                                        : undefined
                                }
                                selected={selectedSermon === entry.id}
                                themeColor={themeColor}
                            />
                        )
                    })}
                </tbody>
            </table>
            {/* <TableVirtuoso
                className={`${styles.sermonsTableContainer} ${
                    themeClassName ?? ""
                }`}
                data={entries}
                endReached={!endOfData ? loadNext : undefined}
                seamless
                style={{
                    height: 400,
                    width: "100%",
                }}
                overscan={30}
                totalCount={entries.length + (isLoading ? 1 : 0)}
                // useWindowScroll
                fixedHeaderContent={() => (
                    <tr>
                        <th
                            className={`${styles.title}`}
                            style={{
                                minWidth: 200,
                                position: "sticky",
                                width: "auto",
                            }}
                        >
                            Titel
                        </th>
                        <th
                            className={`${styles.speaker}`}
                            style={{ width: 250 }}
                        >
                            Sprecher/-in
                        </th>
                        <th className={`${styles.date}`} style={{ width: 120 }}>
                            Datum
                        </th>
                        <th className={``} style={{ width: 50 }}>
                            Audio
                        </th>
                    </tr>
                )}
                itemContent={(i, entry) => {
                    return (
                        <SermonListItem
                            key={entry.id}
                            entry={{
                                ...entry,
                                date: Temporal.Instant.fromEpochMilliseconds(
                                    entry.date,
                                )
                                    .toZonedDateTimeISO("UTC")
                                    .toPlainDate(),
                            }}
                            highlighted={!(i % 2)}
                            onSelect={() => setSelectedSermon(entry.id)}
                            onUnselect={
                                selectedSermon === entry.id
                                    ? () => setSelectedSermon(undefined)
                                    : undefined
                            }
                            selected={selectedSermon === entry.id}
                            themeColor={themeColor}
                        />
                    )
                }}
            /> */}
        </>
    )
}
