import Flex from "@/components/containers/Flex"
import PageContainer from "@/components/containers/PageContainer"
import Section from "@/components/containers/Section"
import Card from "@/components/surfaces/card/Card"
import CardContent from "@/components/surfaces/card/CardContent"
import CardHeader from "@/components/surfaces/card/CardHeader"
import Link from "next/link"
import styles from "./page.module.scss"

export default function Page() {
    return (
        <PageContainer
            themeColor="primary"
            themeColorVariant="font"
            title="Veranstaltungen"
        >
            <Section paperProps={{ breakpoint: "small" }}>
                <Flex className={styles.cardList} direction="column" gap={2}>
                    <Link href="/veranstaltungen/godi">
                        <Card hover>
                            <CardHeader>Gottesdienste</CardHeader>
                            <CardContent>Sonntag um 10:00 Uhr</CardContent>
                        </Card>
                    </Link>
                    <Link href="/veranstaltungen/gebetsabend">
                        <Card hover>
                            <CardHeader>Gebetsabend</CardHeader>
                            <CardContent>Mittwoch um 19 Uhr</CardContent>
                        </Card>
                    </Link>
                    <Link href="/gruppen/maenner-frauen-abend">
                        <Card hover>
                            <CardHeader>Männer- und Frauenkreise</CardHeader>
                            <CardContent>Nach Absprache</CardContent>
                        </Card>
                    </Link>
                </Flex>
            </Section>
        </PageContainer>
    )
}
