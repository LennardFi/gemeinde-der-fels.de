import PageContainer from "@/components/containers/PageContainer"
import Paper from "@/components/surfaces/Paper"

export default function Page() {
    return (
        <PageContainer
            title="Gebetsabend"
            themeColor="primary"
            themeColorVariant="font"
        >
            <Paper breakpoint="small">
                <p>
                    <strong>Wann:</strong> Jeden Mittwoch um 19:00 Uhr
                </p>
                <p>
                    Lass dich herzlich zu unseren Gebetsabenden einladen. Es ist
                    eine besondere Gelegenheit, um im Gebet Gemeinschaft mit
                    Gott zu suchen und gemeinsam für wichtige Themen und
                    Ereignisse einzustehen.
                </p>
            </Paper>
        </PageContainer>
    )
}
