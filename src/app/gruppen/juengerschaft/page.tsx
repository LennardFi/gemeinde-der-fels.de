import PageContainer from "@/components/containers/PageContainer"
import Section from "@/components/containers/Section"
import BibleVerse from "@/components/data-display/BibleVerse"

export default function Page() {
    return (
        <PageContainer title="Jüngerschaft praktisch">
            <Section paperProps={{ breakpoint: "small" }}>
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
        </PageContainer>
    )
}
