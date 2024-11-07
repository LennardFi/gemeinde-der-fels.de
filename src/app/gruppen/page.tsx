import PageContainer from "@/components/containers/PageContainer"
import Section from "@/components/containers/Section"
import BibleVerse from "@/components/data-display/BibleVerse"

export default function Page() {
    return (
        <PageContainer
            noPadding
            title="Gruppen"
            titlePaperProps={{
                themeColor: "primary",
                themeColorVariant: "font",
            }}
        >
            <Section
                paperProps={{ breakpoint: "small" }}
                themeColor="primary"
                themeColorVariant="font"
            >
                <h2>Kindergottesdienst</h2>
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
            <Section paperProps={{ breakpoint: "small" }} themeColor="primary">
                <h2>Tenny Jünger Schule (TJS)</h2>
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
            <Section
                paperProps={{ breakpoint: "small" }}
                themeColor="primary"
                themeColorVariant="font"
            >
                <h2>Young Generation</h2>
                <p>
                    Als 'Young Generation' treffen sich Jugendliche und junge
                    Erwachsene im Alter von ungefähr 16 Jahren bis 28 Jahren, um
                    gemeinsam Gott zu anbeten und ihn als auch sich
                    untereinander besser kennenzulernen. Unsere 'Junge
                    Generation' macht sich so zusammen auf den Weg, Gottes Plan
                    für ihre Leben zu entdecken.
                </p>
                <p>
                    Solltest du Interesse haben, kannst du dich gerne bei der
                    Leitung vor oder nach einem Gottesdienst melden.
                </p>
            </Section>
            <Section paperProps={{ breakpoint: "small" }} themeColor="primary">
                <h2>Jüngerschaft</h2>
                <p>
                    Wir wollen uns nicht nur sonntags im Gottesdienst treffen,
                    sondern uns auch untereinander ermutigen, ermahnen und unter
                    die Arme greifen. Es ist schwierig, den Weg alleine zu
                    beschreiten, deshalb ermutigen wir aktiv Jüngerschaft zu
                    Leben.
                </p>
                <p>
                    Jesus hat seine Jünger nicht alleine auf den Weg geschickt,
                    sondern mindestens zu Zweit!
                </p>
            </Section>
            <Section
                paperProps={{ breakpoint: "small" }}
                themeColor="primary"
                themeColorVariant="font"
            >
                <h2>Männer- und Frauenabende</h2>
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
