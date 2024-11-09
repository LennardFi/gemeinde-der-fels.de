import Website from "@/typings"

export function splitBibleVerse(
    verse: Website.Bible.BibleVerseString,
): Website.Bible.SplittedBibleVerse {
    const [verseNumber] = verse.split(" ", 1) as [string]
    const verseText = verse.slice(verseNumber.length + 1)

    return [Number.parseInt(verseNumber), verseText]
}

export function getBibleVerseListLabel(
    bibleVerses: Website.Bible.BibleVerseString[],
): string {
    if (bibleVerses.length === 0) {
        return ""
    }

    return bibleVerses
        .map(splitBibleVerse)
        .sort(bibleVersesSortFunction)
        .reduce(
            (prev, bibleVerse: Website.Bible.SplittedBibleVerse, i) => {
                const currentVerseNumber = bibleVerse[0]
                const lastEntry = prev.at(-1)

                if (lastEntry === undefined) {
                    return [bibleVerse]
                }

                if (typeof lastEntry[0] === "number") {
                    const typedLastEntry =
                        lastEntry as Website.Bible.SplittedBibleVerse
                    // Verse is next verse
                    if (currentVerseNumber === typedLastEntry[0] + 1) {
                        return prev.with(-1, [typedLastEntry, bibleVerse])
                    }

                    return [...prev, bibleVerse]
                }

                const typedLastEntry = lastEntry as [
                    Website.Bible.SplittedBibleVerse,
                    Website.Bible.SplittedBibleVerse,
                ]

                // Verse is next verse
                if (currentVerseNumber === typedLastEntry[1][0] + 1) {
                    return prev.with(-1, [typedLastEntry[0], bibleVerse])
                }

                return [...prev, bibleVerse]
            },
            [] as (
                | Website.Bible.SplittedBibleVerse
                | [
                      Website.Bible.SplittedBibleVerse,
                      Website.Bible.SplittedBibleVerse,
                  ]
            )[],
        )
        .reduce((prev, item) => {
            if (typeof item[0] === "number") {
                if (prev === "") {
                    return `${item[0]}`
                }

                return `${prev} + ${item[0]}`
            }

            if (prev === "") {
                return `${item[0][0]} - ${item[1][0]}`
            }

            return `${prev} + ${item[0][0]} - ${item[1][0]}`
        }, "")
}

export function getBiblePassageLabel(
    book: Website.Bible.BibleBook,
    chapter: number,
    verses: Website.Bible.BibleVerseString[],
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
    LUT: "Lutherbibel",
}

export function bibleVersesSortFunction(
    verseNumberA: Website.Bible.BibleVerse,
    verseNumberB: Website.Bible.BibleVerse,
): number
export function bibleVersesSortFunction(
    verseNumberA: number,
    verseNumberB: number,
): number
export function bibleVersesSortFunction(
    verseA: Website.Bible.BibleVerse | number,
    verseB: Website.Bible.BibleVerse | number,
): number {
    const verseNumberA =
        typeof verseA === "number"
            ? verseA
            : typeof verseA === "string"
              ? splitBibleVerse(verseA)[0]
              : verseA[0]
    const verseNumberB =
        typeof verseB === "number"
            ? verseB
            : typeof verseB === "string"
              ? splitBibleVerse(verseB)[0]
              : verseB[0]

    if (verseNumberA < verseNumberB) {
        return -1
    }

    if (verseNumberA > verseNumberB) {
        return 1
    }

    return 0
}
