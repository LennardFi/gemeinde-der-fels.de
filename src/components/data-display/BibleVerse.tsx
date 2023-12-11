import {
    bibleTranslationLabels,
    getBiblePassageLabel,
    splitBibleVerse,
} from "@/lib/shared/bible"
import Website from "@/typings"
import { HTMLAttributes } from "react"
import styles from "./BibleVerse.module.scss"

export interface BibleVerseProps extends HTMLAttributes<HTMLParagraphElement> {
    book: Website.Bible.BibleBook
    chapter: number
    children: Website.Bible.BibleVerse[]
    themeColor?: Website.Design.ThemeColor
    translation?: Website.Bible.BibleTranslation
}

export default function BibleVerse({
    book,
    chapter,
    children,
    themeColor,
    translation,
}: BibleVerseProps) {
    const verses = typeof children === "string" ? [children] : children
    const biblePassageLabel = getBiblePassageLabel(book, chapter, verses)

    return (
        <div className={styles.container} data-theme={themeColor}>
            <div className={styles.verseList}>
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
            </div>
            <div className={styles.biblePassageLabel}>
                {biblePassageLabel}
                {translation !== undefined ? (
                    <span className={styles.bibleTranslationLabel}>
                        {" - "}
                        {bibleTranslationLabels[translation]}
                    </span>
                ) : null}
            </div>
        </div>
    )
}
