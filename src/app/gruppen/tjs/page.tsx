import PageContainer from "@/components/containers/PageContainer"
import Section from "@/components/containers/Section"

export default function Page() {
    return (
        <PageContainer
            title="Teenie Jünger Schule (TJS)"
            themeColor="primary"
            themeColorVariant="font"
        >
            <Section paperProps={{ breakpoint: "small" }}>
                <p>
                    Hallo, du bist mindestens 12 oder 13 Jahre alt? Dann bist du
                    hier genau richtig. Nur wenige wissen heute noch etwas über
                    ein Leben mit Gott, doch das kann sich ändern. In nur zwei
                    Jahren kannst du ein Experte werden, so dass du sogar
                    anderen den Glauben der Bibel erklären kannst.
                </p>
                <p>
                    Interesse? Dann melde dich doch einfach über das
                    Kontaktformular oder persönlich bei jemandem in der
                    Gemeinde. Das alles kostet dich übrigens keinen Cent (mit
                    Ausnahme der TJS-Freizeit). Wir freuen uns auf dich.
                </p>
                <p>
                    <strong>Hier noch ein Wort an deine Eltern:</strong> Die
                    jungen Leute unterrichten wir zwei Jahre lang in der TJS.
                    Alle 14 Tage, außerhalb der Ferien, treffen wir uns samstags
                    um 16 Uhr bis ca. 18 Uhr.
                </p>
            </Section>
        </PageContainer>
    )
}
