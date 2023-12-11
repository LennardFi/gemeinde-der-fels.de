import PageContainer from "@/components/containers/PageContainer"
import Section from "@/components/containers/Section"

export default function Page() {
    return (
        <PageContainer title="Gebetsabend">
            <Section breakpoint="small" themeColor="primary">
                <p>
                    <strong>Wann:</strong> Jeden Mittwoch um 19:00 Uhr
                </p>
                <p>
                    Lass dich herzlich zu unseren Gebetsabenden einladen. Es ist
                    eine besondere Gelegenheit, um im Gebet Gemeinschaft mit
                    Gott zu suchen und gemeinsam für wichtige Themen und
                    Ereignisse einzustehen.
                </p>
            </Section>
        </PageContainer>
    )
}
