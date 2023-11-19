"use client"

import Flex from "@/components/containers/Flex"
import Card from "@/components/surfaces/card/Card"
import CardContent from "@/components/surfaces/card/CardContent"
import CardHeader from "@/components/surfaces/card/CardHeader"
import Divider from "@/components/surfaces/Divider"
import Paper from "@/components/surfaces/Paper"
import Navigation from "@/components/templates/Navigation/Navigation"
import Image from "next/image"
import Link from "next/link"
import { FaAngleDoubleDown } from "react-icons/fa"
import styles from "./page.module.scss"

const navHtmlId = "nav"

export default function Page() {
    const scrollToNav = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        document.getElementById(navHtmlId)?.scrollIntoView({
            behavior: "smooth",
        })
    }
    return (
        <>
            <div className={styles.hero}>
                <div className={styles.heroTitle}>
                    <span>Wir sind</span>
                    <span className={styles.highlighted}>Gemeinde</span>
                    <span className={styles.highlighted}>der Fels</span>
                </div>
                <Link
                    className={styles.scrollDownButton}
                    href={`#${navHtmlId}`}
                    onClick={scrollToNav}
                >
                    <FaAngleDoubleDown />
                </Link>
            </div>
            <Navigation id={navHtmlId} sticky />
            <Image
                alt="Some placeholder picture"
                className={styles.bannerImg}
                src="https://picsum.photos/seed/asdasafgafvafa/1920/1080.jpg"
                height={1080}
                width={1920}
                placeholder="blur"
                blurDataURL="https://picsum.photos/seed/asdasafgafvafa/192/108.jpg?grayscale"
                priority
            />
            <Divider variant="page" themeColor="transparent" />
            <Paper className={styles.paper} themeColor="accent">
                <Flex
                    direction="row"
                    justify="center"
                    alignItems="center"
                    columnGap={5}
                    rowGap={2}
                    wrap="wrap"
                >
                    <div>
                        <h2>Willkommen in unserer Gemeinde!</h2>
                        <p>
                            Wir sind jung, geprägt von bibeltreuen Werten und
                            lebendigem Glauben. Mit regelmäßigen Gottesdiensten,
                            Gebetsabenden und Treffen für Männer und Frauen,
                            schaffen wir eine tiefe Gemeinschaft.
                        </p>
                        <p>
                            Als Teil von Gottes weltweiter Gemeinde tragen wir
                            von Dautphe aus bei. Unsere Gemeinde ist voller
                            Leben, mit vielen Kindern und Familien als
                            Herzstück. Konflikte mit weltlichen Werten sehen wir
                            als Chance, unseren Glauben authentisch zu leben.
                        </p>
                        <p>
                            <b>
                                Komm uns besuchen. Du bist herzlich eingeladen.
                            </b>
                        </p>
                    </div>
                    <Image
                        alt="Some placeholder picture"
                        className={styles.bannerImg}
                        src="https://picsum.photos/seed/sdasxgwathad/1920/1080.jpg"
                        height={300}
                        width={400}
                        placeholder="blur"
                        blurDataURL="https://picsum.photos/seed/sdasxgwathad/192/108.jpg?grayscale"
                    />
                </Flex>
            </Paper>
            <Divider variant="page" themeColor="transparent" />
            <Image
                alt="Some placeholder picture"
                className={styles.bannerImg}
                src="https://picsum.photos/seed/hsjarca/1920/1080.jpg"
                height={1080}
                width={1920}
                placeholder="blur"
                blurDataURL="https://picsum.photos/seed/hsjarca/192/108.jpg?grayscale"
                priority
            />
            <Divider variant="page" themeColor="transparent" />
            <Paper className={styles.paper} themeColor="accent">
                <Flex
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                >
                    <h2>Termine</h2>
                    <ul className={styles.cardList}>
                        <li>
                            <Link href="/veranstaltungen/gottesdienst">
                                <Card hover>
                                    <CardHeader>Gottesdienst</CardHeader>
                                    <CardContent>Sonntags, 10 Uhr</CardContent>
                                </Card>
                            </Link>
                        </li>
                        <li>
                            <Link href="/veranstaltungen/gebetsabend">
                                <Card hover>
                                    <CardHeader>Gebetsabend</CardHeader>
                                    <CardContent>Mittwochs, 19 Uhr</CardContent>
                                </Card>
                            </Link>
                        </li>
                    </ul>
                </Flex>
            </Paper>
            <Divider variant="page" themeColor="transparent" />
            <Image
                alt="Some placeholder picture"
                className={styles.bannerImg}
                src="https://picsum.photos/seed/gioafouaiubf/1920/1080.jpg"
                height={1080}
                width={1920}
                placeholder="blur"
                blurDataURL="https://picsum.photos/seed/gioafouaiubf/192/108.jpg?grayscale"
                // priority
            />
            <Divider variant="page" themeColor="transparent" />
            {/* <NewsList /> */}
        </>
    )
}
