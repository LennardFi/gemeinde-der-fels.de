"use client"

import Flex from "@/components/containers/Flex"
import Section from "@/components/containers/Section"
import Skeleton from "@/components/feedback/Skeleton"
import ButtonLink from "@/components/inputs/ButtonLink"
import Divider from "@/components/surfaces/Divider"
import Paper from "@/components/surfaces/Paper"
import Card from "@/components/surfaces/card/Card"
import CardContent from "@/components/surfaces/card/CardContent"
import CardHeader from "@/components/surfaces/card/CardHeader"
import Navigation from "@/components/templates/Navigation/Navigation"
import Image from "next/image"
import Link from "next/link"
import { FaAngleDoubleDown } from "react-icons/fa"
import Brandung from "../media/brandung.jpg"
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
                <h1 className={styles.heroTitle}>
                    <span>Wir sind</span>
                    <span className={styles.highlighted}>Gemeinde</span>
                    <span className={styles.highlighted}>der Fels</span>
                </h1>
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
                alt="Mountain"
                className={styles.bannerImg}
                src={Brandung}
                // height={1080}
                width={1920}
                placeholder="blur"
                // blurDataURL="https://picsum.photos/seed/asdasafgafvafa/192/108.jpg?grayscale"
                priority
            />
            <Divider variant="page" themeColor="transparent" />
            <Section
                paperProps={{
                    breakpoint: "normal",
                    className: styles.paper,
                }}
                themeColor="primary"
            >
                <h2>Willkommen in unserer Gemeinde!</h2>

                <Flex
                    breakpoint="normal"
                    direction="column"
                    justify="center"
                    alignItems="center"
                    gap={1}
                    wrap
                    transition
                    normal={{
                        direction: "row",
                        gap: 2,
                    }}
                    large={{
                        gap: 8,
                    }}
                >
                    <ButtonLink
                        className={`${styles.quickLink}`}
                        href="/ueber-uns/wer-wir-sind"
                        themeColor="primary"
                        fontColor
                        variant="text"
                        containedHover
                    >
                        Neu&nbsp;hier?
                    </ButtonLink>
                    <ButtonLink
                        className={`${styles.quickLink}`}
                        href="/veranstaltungen"
                        themeColor="primary"
                        fontColor
                        variant="text"
                        containedHover
                    >
                        Termine
                    </ButtonLink>
                    <ButtonLink
                        className={`${styles.quickLink}`}
                        href="/medien/predigten"
                        themeColor="primary"
                        fontColor
                        variant="text"
                        containedHover
                    >
                        Predigten
                    </ButtonLink>
                    <ButtonLink
                        className={`${styles.quickLink}`}
                        href="/kontakt"
                        themeColor="primary"
                        fontColor
                        variant="text"
                        containedHover
                    >
                        Kontakt
                    </ButtonLink>
                </Flex>
            </Section>
            <Divider variant="page" themeColor="transparent" />
            <Section
                paperProps={{
                    className: styles.paper,
                }}
                themeColor="primary"
                themeColorVariant="font"
            >
                <h3>Aktuelle Predigt</h3>
                <Paper breakpoint="normal">
                    <Skeleton
                        themeColor="primary"
                        themeColorVariant="font"
                        height={200}
                        width="100%"
                    />
                    <Flex
                        direction="column"
                        justify="flex-start"
                        alignItems="center"
                    >
                        <p>Hier wird später die neuste Predigt angezeigt.</p>
                    </Flex>
                </Paper>
            </Section>
            <Divider variant="page" themeColor="transparent" />
            {/* <Divider variant="page" themeColor="transparent" /> */}
            <Section
                paperProps={{
                    className: styles.paper,
                }}
                themeColor="primary"
            >
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
            </Section>
            <Divider variant="page" themeColor="transparent" />
            <Section
                paperProps={{
                    className: styles.paper,
                }}
                themeColor="primary"
                themeColorVariant="font"
            >
                <h3>Du hast noch Fragen?</h3>
                <Paper breakpoint="small">
                    <ButtonLink
                        href="/kontakt"
                        themeColor="secondary"
                        variant="contained"
                    >
                        Zum Kontaktformular
                    </ButtonLink>
                </Paper>
            </Section>
            <Divider variant="page" themeColor="transparent" />
            {/* <Image
                alt="Some placeholder picture"
                className={styles.bannerImg}
                src="https://picsum.photos/seed/gioafouaiubf/1920/1080.jpg"
                height={1080}
                width={1920}
                placeholder="blur"
                blurDataURL="https://picsum.photos/seed/gioafouaiubf/192/108.jpg?grayscale"
                // priority
            /> */}
            {/* <Divider variant="page" themeColor="transparent" /> */}
            {/* <NewsList /> */}
        </>
    )
}
