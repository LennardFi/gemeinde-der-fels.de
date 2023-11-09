import Website from "@/typings"
import { useState } from "react"
import "react-loading-skeleton/dist/skeleton.css"
import { TableVirtuoso } from "react-virtuoso"
import { Temporal } from "temporal-polyfill"
import styles from "./SermonList.module.scss"
import SermonListItem from "./SermonListItem"

export interface SermonsListEntry
    extends Website.Api.Endpoints.SermonsListResponseBodyEntry {
    index: number
}

interface SermonsListProps {
    isLoading: boolean
    loadNext(): void
    entries: SermonsListEntry[]
    endOfData?: boolean
    themeColor?: Website.Design.ThemeColor
}

export default function SermonsList({
    endOfData,
    entries,
    isLoading,
    loadNext,
    themeColor,
}: SermonsListProps) {
    const [selectedSermon, setSelectedSermon] = useState(entries[0]?.id)

    const playerThemeClassName =
        themeColor === "primary"
            ? styles.primary
            : themeColor === "secondary"
            ? styles.secondary
            : styles.accent

    return (
        <TableVirtuoso
            className={`${styles.sermonsTableContainer} ${
                playerThemeClassName ?? ""
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
                        className={`${styles.header} ${styles.title}`}
                        style={{
                            minWidth: 200,
                            position: "sticky",
                            width: "auto",
                        }}
                    >
                        Titel
                    </th>
                    <th
                        className={`${styles.header} ${styles.speaker}`}
                        style={{ width: 250 }}
                    >
                        Sprecher/-in
                    </th>
                    <th
                        className={`${styles.header} ${styles.speaker}`}
                        style={{ width: 120 }}
                    >
                        Datum
                    </th>
                    <th className={`${styles.header}`} style={{ width: 50 }}>
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
                        open={selectedSermon === entry.id}
                        themeColor={themeColor}
                    />
                )
            }}
        />
    )
}
