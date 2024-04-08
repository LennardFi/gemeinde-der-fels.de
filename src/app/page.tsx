"use client"

import Flex from "@/components/containers/Flex"
import Section from "@/components/containers/Section"
import RequiresFeatureFlag from "@/components/dev/RequiresDevFeatureFlag"
import RequiresDevMode from "@/components/dev/RequiresDevMode"
import ButtonLink from "@/components/inputs/ButtonLink"
import Checkbox from "@/components/inputs/Checkbox"
import Divider from "@/components/surfaces/Divider"
import Paper from "@/components/surfaces/Paper"
import Accordion from "@/components/surfaces/accordion/Accordion"
import Card from "@/components/surfaces/card/Card"
import CardContent from "@/components/surfaces/card/CardContent"
import CardHeader from "@/components/surfaces/card/CardHeader"
import { ContactBanner } from "@/components/templates/ContactBanner/ContactBanner"
import Navigation from "@/components/templates/Navigation/Navigation"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useId, useState } from "react"
import { FaAngleDoubleDown, FaFolder, FaFolderOpen } from "react-icons/fa"
import Brandung from "../media/brandung.jpg"
import NewsInvitationIsraelEvening from "../media/news-2024-01-25-israel-abend-einladung.png"
import styles from "./page.module.scss"

export default function Page() {
    const navHtmlId = useId()
    const [folderOpen, setFolderOpen] = useState(false)

    const scrollToNav = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault()
            document.getElementById(navHtmlId)?.scrollIntoView({
                behavior: "smooth",
            })
        },
        [],
    )

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
            <RequiresDevMode>
                <Divider variant="page" themeColor="transparent" />
                <Section
                    paperProps={{
                        className: styles.paper,
                    }}
                    themeColor="primary"
                    themeColorVariant="font"
                >
                    <h3>Test</h3>
                    <Paper breakpoint="normal">
                        <Accordion
                            onClick={() => console.log("clicked 1")}
                            summary="Test 1"
                            themeColor="secondary"
                        >
                            <p>
                                Exercitation commodo velit est eiusmod occaecat
                                anim proident. Ea aute id voluptate laboris
                                laboris officia consectetur sint consectetur
                                aute dolor ipsum pariatur. Sit eiusmod ullamco
                                dolor cupidatat dolor.
                            </p>
                        </Accordion>
                        <Accordion
                            icon={<Checkbox fontColor />}
                            onClick={() => console.log("clicked 2")}
                            summary="Test 2"
                            themeColor="secondary"
                        >
                            <p>
                                Exercitation commodo velit est eiusmod occaecat
                                anim proident. Ea aute id voluptate laboris
                                laboris officia consectetur sint consectetur
                                aute dolor ipsum pariatur. Sit eiusmod ullamco
                                dolor cupidatat dolor.
                            </p>
                        </Accordion>
                        <Accordion
                            icon={folderOpen ? <FaFolderOpen /> : <FaFolder />}
                            onClick={() => console.log("clicked 3")}
                            summary="Test 3"
                            open={folderOpen}
                            onOpen={(open) => setFolderOpen(open)}
                            themeColor="secondary"
                        >
                            <p>
                                Exercitation commodo velit est eiusmod occaecat
                                anim proident. Ea aute id voluptate laboris
                                laboris officia consectetur sint consectetur
                                aute dolor ipsum pariatur. Sit eiusmod ullamco
                                dolor cupidatat dolor.
                            </p>
                        </Accordion>
                    </Paper>
                </Section>
            </RequiresDevMode>
            <Paper noPadding themeColor="primary" themeColorVariant="font">
                <Flex justify="center">
                    <Image
                        alt="Mountain"
                        className={styles.bannerImg}
                        src={Brandung}
                        // height={1080}
                        width={1920}
                        // width={800}
                        placeholder="blur"
                        // blurDataURL="https://picsum.photos/seed/asdasafgafvafa/192/108.jpg?grayscale"
                        priority
                    />
                </Flex>
            </Paper>
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
                        href="/ueber-uns"
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
            <RequiresFeatureFlag flags={["events"]}>
                <Section
                    paperProps={{
                        breakpoint: "normal",
                        className: styles.paper,
                    }}
                    themeColor="primary"
                    themeColorVariant="font"
                >
                    <h2>Nächste Events</h2>

                    <Flex
                        breakpoint="normal"
                        direction="column"
                        justify="flex-start"
                        alignItems="center"
                        gap={1}
                        transition
                    >
                        <Link
                            href={NewsInvitationIsraelEvening.src}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Image
                                alt="Einladung Israel-Abend"
                                className={styles.newsImg}
                                height={720}
                                placeholder="blur"
                                priority
                                src={NewsInvitationIsraelEvening}
                            />
                        </Link>
                    </Flex>
                </Section>
                <Divider variant="page" themeColor="transparent" />
            </RequiresFeatureFlag>
            <Section
                paperProps={{
                    className: styles.paper,
                }}
                themeColor="primary"
                themeColorVariant="font"
            >
                <h2>Aktuelle Predigt</h2>
                <Paper breakpoint="normal">
                    {/* <Skeleton
                        themeColor="primary"
                        themeColorVariant="font"
                        height={200}
                        width="100%"
                    /> */}
                    <Flex
                        direction="column"
                        justify="flex-start"
                        alignItems="center"
                    >
                        <p>🚧 Aktuell noch in Arbeit. 🚧</p>
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
                <h2>Termine</h2>
                <Flex
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                >
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
                    breakpoint: "small",
                }}
                themeColor="primary"
                themeColorVariant="font"
            >
                <h2>Du hast noch Fragen?</h2>
                <p style={{ textAlign: "center" }}>
                    Wir sind über folgende Kanäle erreichbar:
                </p>
                <Divider variant="section" themeColor="transparent" />
                <ContactBanner
                // className={styles.contactBanner}
                />
                <Divider variant="section" themeColor="transparent" />
                <ButtonLink
                    href="/kontakt"
                    themeColor="secondary"
                    variant="contained"
                >
                    Zum Kontaktformular
                </ButtonLink>
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
