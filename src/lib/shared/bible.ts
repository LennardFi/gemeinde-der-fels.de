import Website from "@/typings"

export function splitBibleVerse(
    verse: Website.Bible.BibleVerse,
): [number, string] {
    const [verseNumber] = verse.split(" ", 1) as [string]
    const verseText = verse.slice(verseNumber.length + 1)

    return [Number.parseInt(verseNumber), verseText]
}

export function getBibleVerseListLabel(
    bibleVerses: Website.Bible.BibleVerse[],
): string {
    const [firstVerse, ...verseNumberRest] = bibleVerses.reduce(
        (verseList, verse) => {
            return [...verseList, splitBibleVerse(verse)[0]]
        },
        [] as number[],
    )

    if (firstVerse === undefined) {
        return ""
    }

    if (verseNumberRest.length === 0) {
        return firstVerse.toString()
    }

    const isRange = verseNumberRest.reduce((isRange, nextVerseNumber, i) => {
        if (!isRange) {
            return isRange
        }

        if (firstVerse + i + 1 !== nextVerseNumber) {
            return false
        }

        return true
    }, true as boolean)

    if (isRange) {
        return `${firstVerse}-${verseNumberRest.at(-1)}`
    }

    return `${firstVerse} + ${verseNumberRest.join(" + ")}`
}

export function getBiblePassageLabel(
    book: Website.Bible.BibleBook,
    chapter: number,
    verses: Website.Bible.BibleVerse[],
): string {
    let label = `${book} ${chapter}`

    label = `${label}, ${getBibleVerseListLabel(verses)}`

    return label
}

export const bibleTranslationLabels: Record<
    Website.Bible.BibleTranslation,
    string
> = {
    Hfa: "Hoffnung für alle",
    NGU: "Neue Genfer Übersetzung",
    SCH2000: "Schlachter (2000)",
    NLB: "Neues Leben Bibel",
}
