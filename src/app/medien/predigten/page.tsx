import Card from "@/components/surfaces/cards/Card"
import CardContent from "@/components/surfaces/cards/CardContent"
import CardHeader from "@/components/surfaces/cards/CardHeader"
import { SermonsListEntry } from "@/components/templates/SermonList/SermonList"
import SermonsListContainer from "@/components/templates/SermonList/SermonListContainer"
import { getClient } from "@/lib/backend/databaseHelpers"
import styles from "./page.module.scss"

export default async function Page() {
    const dbEntries = await getClient().sermon.findMany({
        include: {
            audioFile: true,
            series: true,
            speaker: true,
        },
        take: 10,
        orderBy: {
            // date: "desc",
            title: "asc",
        },
    })
    const initialSermons = dbEntries.map<SermonsListEntry>((entry, i) => ({
        ...entry,
        audioFileFormat: entry.audioFile.extension,
        date: entry.date.getTime(),
        series:
            entry.series !== null
                ? {
                      id: entry.series.id,
                      title: entry.series.title,
                  }
                : undefined,
        index: i,
    }))

    return (
        <Card breakpoint="small" className={styles.card}>
            <CardHeader title="Medien" />
            <CardContent className={styles.container}>
                <h2>Predigten</h2>
                <SermonsListContainer
                    initialSermons={initialSermons}
                    showFilter
                    // themeColor="primary"
                />
            </CardContent>
        </Card>
    )
}
