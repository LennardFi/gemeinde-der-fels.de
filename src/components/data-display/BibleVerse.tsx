import {
    bibleTranslationLabels,
    getBiblePassageLabel,
    splitBibleVerse,
} from "@/lib/shared/bible"
import Website from "@/typings"
import { HTMLAttributes } from "react"
import styles from "./BibleVerse.module.scss"

export interface BibleVerseProps
    extends Omit<HTMLAttributes<HTMLParagraphElement>, "children"> {
    book: Website.Bible.BibleBook
    chapter: number
    verses: Website.Bible.BibleVerse[]
    themeColor?: Website.Design.ThemeColor
    translation?: Website.Bible.BibleTranslation
}

export default function BibleVerse({
    book,
    chapter,
    themeColor,
    translation,
    verses,
}: BibleVerseProps) {
    const biblePassageLabel = getBiblePassageLabel(book, chapter, verses)

    return (
        <p className={styles.container} data-theme={themeColor}>
            <span className={styles.verseList}>
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
