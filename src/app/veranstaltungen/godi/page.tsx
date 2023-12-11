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
                    Komm und verbringe Sonntags eine wundervolle Zeit mit uns,
                    in der wir gemeinsam Gott loben, dienen und Gemeinschaft
                    haben. Wir feiern auch einmal im Monat einen speziellen
                    Familiengottesdienst für und mit unseren Kindern.
                </p>
            </Section>
        </PageContainer>
    )
}
