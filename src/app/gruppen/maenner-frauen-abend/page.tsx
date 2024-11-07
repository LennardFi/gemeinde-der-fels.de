import PageContainer from "@/components/containers/PageContainer"
import Section from "@/components/containers/Section"

export default function Page() {
    return (
        <PageContainer
            title="Männer- und Frauenabende"
            themeColor="primary"
            themeColorVariant="font"
        >
            <Section paperProps={{ breakpoint: "small" }}>
                <p>
                    Gemeinschaft ist für uns ein sehr wichtiges Thema, deshalb
                    treffen wir uns einmal im Monat zu Männer bzw. Frauenkreisen
                    um intensiver, gemeinsam ins Wort zu gehen und sich
                    auszutauschen über die Belange und Schwierigkeiten des
                    Alltags. Ziel ist es gemeinsam zu Wachsen und festgefahrene
                    Muster und Gedanken zu Überwinden.
                </p>
            </Section>
        </PageContainer>
    )
}
