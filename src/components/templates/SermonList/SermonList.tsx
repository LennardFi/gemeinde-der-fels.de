import Website from "@/typings"
import { useState } from "react"
import Skeleton from "react-loading-skeleton"
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
            components={{
                FillerRow: ({ height }) => (
                    <tr style={{ height }}>
                        <td className={styles.loadingCell}>
                            <Skeleton height="100%" width="100%" />
                        </td>
                    </tr>
                ),
            }}
            className={`${styles.sermonsTableContainer} ${
                playerThemeClassName ?? ""
            }`}
            data={entries}
            endReached={!endOfData ? loadNext : undefined}
            seamless
            style={{
                height: 600,
                width: "100%",
            }}
            overscan={30}
            totalCount={entries.length + (isLoading ? 1 : 0)}
            // useWindowScroll
            fixedHeaderContent={() => (
                <tr>
                    <th
                        className={`${styles.header} ${styles.title}`}
                        style={{ minWidth: 200 }}
                    >
                        Titel
                    </th>
                    <th
                        className={`${styles.header} ${styles.speaker}`}
                        style={{ minWidth: 100 }}
                    >
                        Sprecher/-in
                    </th>
                    <th className={`${styles.header}`} style={{ minWidth: 50 }}>
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
