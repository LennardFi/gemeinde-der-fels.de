import PageContainer from "@/components/containers/PageContainer"
import Section from "@/components/containers/Section"

export default function Page() {
    return (
        <PageContainer title="Männer- und Frauenabende">
            <Section paperProps={{ breakpoint: "small" }}>
                <p>
                    Einmal im Monat kommen wir als Männer bzw. als Frauen
                    zusammen, um uns untereinander in unseren Rollen als
                    Männer/Frauen zu helfen.
                    <br />
                    Gemeinsam rufen wir in den vertrauten Kreisen Gott an und
                    sprechen über empfindliche Themen.
                </p>

                <p>
                    Diese Treffen sind zwar nicht öffentlich, solltest du aber
                    Interesse haben und wir uns bereits ein bisschen kennen,
                    zögere nicht mal nachzufragen.
                </p>
            </Section>
        </PageContainer>
    )
}
