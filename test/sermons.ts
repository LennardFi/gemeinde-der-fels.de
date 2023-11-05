import Website from "@/typings"

interface TestSermon {
    fileName: string
    speaker: Website.Content.Sermons.NewSpeaker
    title: string
    series?: Website.Content.Sermons.NewSermonSeries
}

export const sermons: TestSermon[] = [
    {
        title: "Lofi chill",
        fileName: "lofi-chill-medium-version-159456.mp3",
        speaker: {
            initials: "Te",
            name: "Testuser",
        },
        series: {
            title: "Eine tolle Predigtreihe",
        },
    },
    {
        title: "Once in Paris",
        fileName: "once-in-paris-168895.mp3",
        speaker: {
            initials: "Ma",
            name: "Manager",
        },
    },
    {
        title: "Science documentary",
        fileName: "science-documentary-169621.mp3",
        speaker: {
            initials: "Ma",
            name: "Manager",
        },
    },
    {
        title: "Tvari Tokyo Cafe",
        fileName: "tvari-tokyo-cafe-159065.mp3",
        speaker: {
            initials: "Te",
            name: "Testuser",
        },
        series: {
            title: "Eine tolle Predigtreihe",
        },
    },
    {
        title: "Die Bedeutung des Wortes Gottes",
        fileName: "Echte Predigt.mp3",
        speaker: {
            initials: "HH",
            name: "Hartwig Henkel",
        },
        series: {
            title: "Der Glaube den die Apostel lehrten",
        },
    },
]
