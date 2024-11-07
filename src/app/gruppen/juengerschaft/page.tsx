import PageContainer from "@/components/containers/PageContainer"
import Section from "@/components/containers/Section"

export default function Page() {
    return (
        <PageContainer
            title="Jüngerschaft"
            themeColor="primary"
            themeColorVariant="font"
        >
            <Section paperProps={{ breakpoint: "small" }}>
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
        </PageContainer>
    )
}
