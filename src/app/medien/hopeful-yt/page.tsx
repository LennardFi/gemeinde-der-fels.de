import Flex from "@/components/containers/Flex"
import PageContainer from "@/components/containers/PageContainer"
import BibleVerse from "@/components/data-display/BibleVerse"
import ButtonLink from "@/components/inputs/ButtonLink"
import Paper from "@/components/surfaces/Paper"
import Image from "next/image"
import Link from "next/link"
import HopefulYt from "../../../media/hopeful-yt.jpg"
import styles from "./page.module.scss"

export default function Page() {
    return (
        <PageContainer
            title="Hopeful"
            breakpoint="normal"
            themeColor="primary"
            themeColorVariant="font"
            noPadding
        >
            <Paper breakpoint="small" noPadding>
                <Flex justify="center">
                    <Link
                        href="https://www.youtube.com/@Hopeful-Gemeinde-der-Fels"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Image
                            alt="Hopeful YouTube Kanalbild"
                            className={styles.channelImage}
                            src={HopefulYt}
                            width={800}
                        />
                    </Link>
                </Flex>
                <Paper breakpoint="tiny" noPadding>
                    <p>
                        <ButtonLink
                            href="https://www.youtube.com/@Hopeful-Gemeinde-der-Fels"
                            target="_blank"
                            rel="noreferrer"
                            variant="contained"
                        >
                            Zum Kanal
                        </ButtonLink>
                    </p>
                </Paper>
            </Paper>
            <Paper breakpoint="small">
                <b>
                    <p>
                        Gott ist ein Gott der Hoffnung, im Überfluss. Durch
                        diesen Kanal soll die Liebe und Schönheit Jesu Hoffnung
                        in dein Leben bringen.
                        <br />
                        Gerne möchte ich dich ermutigen u.a. mit eigenen
                        Liedern, das Jesus dich liebt und all deinen Mangel
                        ausfüllen möchte.
                    </p>
                </b>
            </Paper>
            <Paper breakpoint="small">
                <BibleVerse
                    book="Micha"
                    chapter={7}
                    verses={[
                        "7 Ich aber will mich auf den Herrn verlassen. Erwartungsvoll will ich nach ihm Ausschau halten.",
                    ]}
                    themeColor="secondary"
                    translation="NLB"
                />
                <BibleVerse
                    book="Psalmen"
                    chapter={62}
                    verses={[
                        "9 Vertraue allezeit auf ihn, mein Volk, schütte dein Herz vor ihm aus, denn Gott ist unsere Zuflucht.",
                    ]}
                    themeColor="secondary"
                    translation="NLB"
                />
                <BibleVerse
                    book="Lukas"
                    chapter={10}
                    verses={[
                        "39 Ihre Schwester Maria saß zu Jesu Füßen und hörte ihm aufmerksam zu.",
                    ]}
                    themeColor="secondary"
                    translation="NLB"
                />
                <BibleVerse
                    book="Hohes Lied"
                    chapter={3}
                    verses={[
                        "4 Ich fand, den meine Seele liebt. Ich halte Ihn und will Ihn nicht lassen.",
                    ]}
                    themeColor="secondary"
                />
                <p>
                    Wenn ich darüber nachdenke, was Gott für mich getan hat - ,
                    Er hat Seinen einzigen Sohn, Jesus, für mein Leben, mein
                    Versagen, meine Unvollkommenheit, meine Schuld,..
                    hingegeben, um mich frei zu machen von Anklage,
                    Selbstverdammnis, Krankheit,.. und Tod, um mich anzunehmen
                    als sein geliebtes Kind. Da kann ich nur staunend auf meine
                    Knie fallen.
                </p>
                <p>
                    Überglücklich bezeuge ich von ganzem Herzen: "Ich habe den
                    gefunden, den meine Seele liebt. Ihn halte ich fest und
                    lasse Ihn nicht mehr los."
                </p>
                <p>
                    Ihn, Jesus, möchte ich mit meinem Leben anbeten. Aller Ruhm
                    und Ehre gehören Ihm allein.
                </p>
                <p>Er macht mein Leben hoffnungsvoll und glücklich.</p>
            </Paper>
        </PageContainer>
    )
}
