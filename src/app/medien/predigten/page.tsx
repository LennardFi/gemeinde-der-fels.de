"use server"

import PageContainer from "@/components/containers/PageContainer"
import { SermonsListEntry } from "@/components/templates/SermonList/SermonList"
import SermonsListContainer from "@/components/templates/SermonList/SermonListContainer"
import { getClient } from "@/lib/backend/databaseHelpers"
import { defaultListPageSize } from "@/lib/shared/apiHelpers"

export default async function Page() {
    const dbClient = await getClient()
    const dbEntries = await dbClient.sermon.findMany({
        include: {
            audioFile: true,
            series: true,
            speaker: true,
        },
        take: defaultListPageSize,
        orderBy: {
            date: "desc",
            // title: "asc",
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
        <PageContainer
            breakpoint="normal"
            noPadding
            title="Predigten"
            themeColor="primary"
            themeColorVariant="font"
        >
            <SermonsListContainer
                initialSermons={initialSermons}
                pageSize={defaultListPageSize}
                showFilter
                // themeColor="secondary"
            />
        </PageContainer>
    )
}
