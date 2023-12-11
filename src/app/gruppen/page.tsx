import PageContainer from "@/components/containers/PageContainer"
import Section from "@/components/containers/Section"
import BibleVerse from "@/components/data-display/BibleVerse"

export default function Page() {
    return (
        <PageContainer noPadding title="Gruppen">
            <Section paperProps={{ breakpoint: "small" }}>
                <h2>Kindergottesdienst</h2>
                <BibleVerse
                    book="Matthäus"
                    chapter={19}
                    themeColor="secondary"
                    translation="SCH2000"
                >
                    {[
                        "14 Doch Jesus sagte: 'Lasst die Kinder und hindert sie nicht, zu mir zu kommen! Denn Menschen wie ihnen gehört das Himmelreich.'",
                    ]}
                </BibleVerse>
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
            <Section paperProps={{ breakpoint: "small" }}>
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
                <h2>Jüngerschaft praktisch</h2>
                <BibleVerse
                    book="Matthäus"
                    chapter={28}
                    themeColor="secondary"
                    translation="SCH2000"
                >
                    {[
                        "18 Und Jesus trat herzu, redete mit ihnen und sprach: Mir ist gegeben alle Macht im Himmel und auf Erden.",
                        "19 So geht nun hin und macht zu Jüngern alle Völker, und tauft sie auf den Namen des Vaters und des Sohnes und des Heiligen Geistes",
                        "20 und lehrt sie alles halten, was ich euch befohlen habe. Und siehe, ich bin bei euch alle Tage bis an das Ende der Weltzeit! Amen.",
                    ]}
                </BibleVerse>
                <p>
                    Wir wollen uns nicht nur sonntags im Gottesdienst treffen,
                    sondern uns auch untereinander ermutigen, ermahnen und unter
                    die Arme greifen. Es ist schwierig, den Weg alleine zu
                    beschreiten, deshalb leben wir aktiv Jüngerschaft, um von
                    den Erfahrungen des Anderen bzw. Älteren zu lernen.
                </p>
                <p>
                    Praktisch erleben wir es, dass sich zwei Personen mithilfe
                    des Heiligen Geistes und durch Gebet finden und in
                    regelmäßigen Treffen der Ältere dem Jüngeren ins Leben
                    sprechen darf und ihn in alltäglichen Dingen berät, bis
                    dieser schließlich soweit ist, seine Erfahrungen an den
                    Nächsten weiterzugeben.
                </p>
                <p>
                    In einer Zweierschaft legen wir uns gegenseitig Rechenschaft
                    ab und sprechen dem jeweils Anderen ins Leben. Schließlich
                    sandte Jesus seine Jünger nicht alleine aus, sondern
                    mindestens zu Zweit!
                </p>
            </Section>
            <Section paperProps={{ breakpoint: "small" }}>
                <h2>Männer- und Frauenabende</h2>
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
