import PageContainer from "@/components/containers/PageContainer"
import Section from "@/components/containers/Section"

export default function Page() {
    return (
        <PageContainer
            title="Young Generation"
            themeColor="primary"
            themeColorVariant="font"
        >
            <Section paperProps={{ breakpoint: "small" }}>
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
        </PageContainer>
    )
}
