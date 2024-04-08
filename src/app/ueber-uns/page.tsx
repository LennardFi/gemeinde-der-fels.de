import Flex from "@/components/containers/Flex"
import PageContainer from "@/components/containers/PageContainer"
import Divider from "@/components/surfaces/Divider"
import Paper from "@/components/surfaces/Paper"
import { ContactBanner } from "@/components/templates/ContactBanner/ContactBanner"
import Image from "next/image"
import Aufmacher from "../../media/Aufmacher.jpg"
import styles from "./page.module.scss"

export default function Page() {
    return (
        <PageContainer
            title="Über uns"
            themeColor="primary"
            themeColorVariant="font"
            breakpoint="normal"
        >
            <Paper breakpoint="normal">
                <Flex justify="center">
                    <Image
                        alt="Some placeholder picture"
                        className={styles.bannerImg}
                        src={Aufmacher}
                        height={500}
                        placeholder="blur"
                    />
                </Flex>
            </Paper>
            <Paper>
                <Flex
                    direction="column"
                    breakpoint="normal"
                    justify="flex-start"
                    alignItems="flex-start"
                    columnGap={4}
                    normal={{
                        direction: "row",
                        justify: "space-around",
                    }}
                >
                    <Paper
                        breakpoint="tiny"
                        className={styles.content}
                        noPadding
                    >
                        <p>
                            Wir sind eine kleine, bibeltreue Gemeinde im Herzen
                            Dautphetals (ca. 20km von Marburg an der Lahn
                            entfernt).
                        </p>
                        <p>
                            Was uns verbindet ist der Wunsch, Gott zu begegnen
                            und Seine Gegenwart in den Gottesdiensten zu
                            erleben. Prägende Elemente sind die gemeinsame Zeit
                            in Lobpreis und Anbetung, sowie die Verkündigung des
                            Wortes Gottes.
                            <br />
                            Als Gemeinde möchten wir echte und verlässliche
                            Beziehungen untereinander leben, und als Nachfolger
                            Jesu lernen wir ein Leben zur Ehre Gottes zu führen.
                        </p>
                    </Paper>
                    <Paper
                        breakpoint="tiny"
                        className={styles.content}
                        noPadding
                    >
                        <p>
                            Wir haben die Sehnsucht, die Menschen unserer Region
                            zu segnen, indem wir für sie beten und sie mit Jesus
                            Christus bekannt machen.
                            <br />
                        </p>
                        <p>
                            <b>
                                Denn Er kam auf diese Erde um „(die Menschen) zu
                                suchen und zu retten“
                                <br />
                                (Lukas 19:10).
                            </b>
                            <br />
                            <b>Er ist Weg, Wahrheit und Leben.</b>
                        </p>
                    </Paper>
                </Flex>
            </Paper>
            <Divider variant="page" themeColor="transparent" />
            <Paper themeColor="accent">
                <p>
                    <b>Neugierig wer wir sind?</b>
                </p>
                <p>
                    Herzliche Einladung zu unseren Gottesdiensten am Sonntag um
                    10:00 Uhr. Wir freuen uns dich kennenzulernen!
                </p>
            </Paper>
            <Divider variant="page" themeColor="transparent" />
            <Paper breakpoint="small">
                <ContactBanner />
            </Paper>
        </PageContainer>
    )
}
