import PageContainer from "@/components/containers/PageContainer"
import Section from "@/components/containers/Section"
import BibleVerse from "@/components/data-display/BibleVerse"

export default function Page() {
    return (
        <PageContainer
            title="Kindergottesdienst"
            themeColor="primary"
            themeColorVariant="font"
        >
            <Section paperProps={{ breakpoint: "small" }}>
                <BibleVerse
                    book="Matthäus"
                    chapter={19}
                    themeColor="secondary"
                    translation="SCH2000"
                    verses={[
                        "14 Doch Jesus sagte: 'Lasst die Kinder und hindert sie nicht, zu mir zu kommen! Denn Menschen wie ihnen gehört das Himmelreich.'",
                    ]}
                />
                <p>
                    Während des Gottesdienstes wollen wir, als eine sehr
                    kinderreiche Gemeinde, unseren Kindern dienen. Unterteilt in
                    Vorschul- und Schulkinder wollen wir mit Gottes Hilfe seine
                    Wahrheit auch den Kleinsten deutlich machen.
                </p>
            </Section>
        </PageContainer>
    )
}
