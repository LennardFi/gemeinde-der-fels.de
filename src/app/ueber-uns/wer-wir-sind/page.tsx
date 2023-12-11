import Flex from "@/components/containers/Flex"
import PageContainer from "@/components/containers/PageContainer"
import BibleVerse from "@/components/data-display/BibleVerse"
import Divider from "@/components/surfaces/Divider"
import Paper from "@/components/surfaces/Paper"
import Image from "next/image"
import Aufmacher from "../../../media/Aufmacher.jpg"
import styles from "./page.module.scss"

export default function Page() {
    return (
        <PageContainer title="Wer wir sind" breakpoint="large">
            <Paper breakpoint="normal">
                <Image
                    alt="Some placeholder picture"
                    className={styles.bannerImg}
                    src={Aufmacher}
                    height={600}
                    placeholder="blur"
                />
            </Paper>
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
                <Paper breakpoint="tiny" className={styles.content} noPadding>
                    <p>
                        Wir sind eine kleine, bibeltreue Gemeinde im Herzen
                        Dautphetals (ca. 20km von Marburg an der Lahn entfernt).
                    </p>
                    <p>
                        Was uns verbindet ist der Wunsch, Gott zu begegnen und
                        Seine Gegenwart in den Gottesdiensten zu erleben.
                        Prägende Elemente sind die gemeinsame Zeit in Lobpreis
                        und Anbetung, sowie die Verkündigung des Wortes Gottes.
                        <br />
                        Als Gemeinde möchten wir echte und verlässliche
                        Beziehungen untereinander leben, und als Nachfolger Jesu
                        lernen wir ein Leben zur Ehre Gottes zu führen.
                    </p>
                </Paper>
                <Paper breakpoint="tiny" className={styles.content} noPadding>
                    <p>
                        Wir haben die Sehnsucht, die Menschen unserer Region zu
                        segnen, indem wir für sie beten und sie mit Jesus
                        Christus bekannt machen.
                        <br />
                    </p>
                    <p>
                        <b>
                            Denn Er kam auf diese Erde um „(die Menschen) zu
                            suchen und zu retten“:
                        </b>
                    </p>
                    <BibleVerse
                        book="Lukas"
                        chapter={19}
                        themeColor="secondary"
                    >
                        {[
                            "10 denn der Sohn des Menschen ist gekommen, um zu suchen und zu retten, was verloren ist.",
                        ]}
                    </BibleVerse>
                    <p>
                        <b>Er ist Weg, Wahrheit und Leben.</b>
                    </p>
                </Paper>
            </Flex>
            <Divider variant="page" themeColor="transparent" />
            <Paper breakpoint="normal" themeColor="accent">
                <p>
                    <b>Neugierig wer wir sind?</b>
                </p>
                <p>
                    Herzliche Einladung zu unseren Gottesdiensten am Sonntag.
                    Wir freuen uns dich kennenzulernen!
                </p>
            </Paper>
        </PageContainer>
    )
}
