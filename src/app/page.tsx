"use client"

import Flex from "@/components/containers/Flex"
import Section from "@/components/containers/Section"
import ButtonLink from "@/components/inputs/ButtonLink"
import Divider from "@/components/surfaces/Divider"
import Card from "@/components/surfaces/card/Card"
import CardContent from "@/components/surfaces/card/CardContent"
import CardHeader from "@/components/surfaces/card/CardHeader"
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
            <Section
                fullWidth
                paperProps={{
                    className: styles.paper,
                }}
                themeColor="primary"
            >
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
            <Section
                fullWidth
                paperProps={{
                    className: styles.paper,
                }}
            >
                <Flex
                    direction="column"
                    breakpoint="large"
                    justify="flex-start"
                    alignItems="center"
                    columnGap={4}
                    rowGap={2}
                    large={{
                        direction: "row",
                        justify: "space-around",
                    }}
                >
                    <div>
                        <h2>Willkommen in unserer Gemeinde!</h2>
                        <p>
                            Nisi duis do velit aute consequat tempor ad ipsum
                            sit ullamco. Magna pariatur sit consequat id ut
                            laborum minim et sint labore laboris id. Ut sit anim
                            do do adipisicing nisi aliqua commodo proident
                            veniam dolore elit.
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. At esse repudiandae voluptatem earum alias
                            mollitia sint deleniti. Quos facere ab iusto
                            excepturi doloribus, amet sed, ut doloremque placeat
                            quis vel.
                        </p>
                        <p>
                            <b>Laboris labore ad veniam ex eiusmod.</b>
                        </p>
                    </div>
                    <Image
                        alt="Some placeholder picture"
                        className={styles.bannerImg}
                        src="https://picsum.photos/seed/sdasxgwathad/1920/1080.jpg"
                        height={300}
                        width={600}
                        placeholder="blur"
                        blurDataURL="https://picsum.photos/seed/sdasxgwathad/192/108.jpg?grayscale"
                    />
                </Flex>
            </Section>
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
            <Section
                fullWidth
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
