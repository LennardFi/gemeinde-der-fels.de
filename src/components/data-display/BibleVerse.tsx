import {
    bibleTranslationLabels,
    getBiblePassageLabel,
    splitBibleVerse,
} from "@/lib/shared/bible"
import Website from "@/typings"
import { HTMLAttributes } from "react"
import styles from "./BibleVerse.module.scss"

export interface BibleVerseProps {
    book: Website.Bible.BibleBook
    chapter: number
    verses: Website.Bible.BibleVerseString[]
    condensed?: boolean
    containerProps?: Omit<HTMLAttributes<HTMLParagraphElement>, "children">
    themeColor?: Website.Design.ThemeColor
    translation?: Website.Bible.BibleTranslation
}

export default function BibleVerse({
    book,
    chapter,
    verses,
    condensed,
    containerProps,
    themeColor = "primary",
    translation,
}: BibleVerseProps) {
    const biblePassageLabel = getBiblePassageLabel(book, chapter, verses)

    return (
        <p
            {...containerProps}
            className={`${containerProps?.className ?? ""} ${styles.container} ${condensed ? styles.condensed : ""}`}
            data-theme={themeColor}
        >
            <span className={styles.verseContainer}>
                {verses.map((verse, i) => {
                    const [verseNumber, verseText] = splitBibleVerse(verse)
                    return (
                        <span className={styles.verse} key={verseNumber}>
                            {i !== 0 ? <>&nbsp;</> : ""}
                            <span className={styles.verseNumber}>
                                {verseNumber}
                            </span>
                            &nbsp;
                            {verseText}
                        </span>
                    )
                })}
            </span>
            <span className={styles.biblePassageLabel}>
                {biblePassageLabel}
            </span>
            {translation !== undefined ? (
                <span className={styles.bibleTranslationLabel}>
                    {bibleTranslationLabels[translation]}
                </span>
            ) : null}
        </p>
    )
}
