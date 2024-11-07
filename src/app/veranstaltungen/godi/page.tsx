import PageContainer from "@/components/containers/PageContainer"
import Section from "@/components/containers/Section"

export default function Page() {
    return (
        <PageContainer
            title="Gottesdienst"
            themeColor="primary"
            themeColorVariant="font"
        >
            <Section breakpoint="small">
                <p>
                    <strong>Wann:</strong> Jeden Sonntag um 10:00 Uhr
                </p>
                <p>
                    Wir laden dich ein jeden Sonntag mit uns Gott zu loben, zu
                    dienen und Gemeinschaft mit uns zu haben. Wir Feiern auch
                    einmal im Monat einen Familiengottesdienst für und mit
                    unseren Kindern.
                </p>
            </Section>
        </PageContainer>
    )
}
