"use client"

import Flex from "@/components/containers/Flex"
import PageContainer from "@/components/containers/PageContainer"
import Section from "@/components/containers/Section"
import Button from "@/components/inputs/Button"
import Divider from "@/components/surfaces/Divider"
import Accordion from "@/components/surfaces/accordion/Accordion"
import useDeviceSize from "@/hooks/useDeviceSize"
import { getDimensionValue } from "@/lib/shared/helpers"
import { useState } from "react"
import { FaDownload } from "react-icons/fa"
import styles from "./page.module.scss"

export default function Page() {
    const deviceSize = useDeviceSize()
    const [expandedMainValue, setExpandedMainValue] = useState(0)

    const onOpenAccordion = (index: number) => (open: boolean) => {
        setExpandedMainValue(open ? index : -1)
    }

    return (
        <PageContainer
            noPadding
            title="Werte und Vision"
            titlePaperProps={{
                themeColor: "primary",
                noPadding: false,
            }}
        >
            <Section
                paperProps={{
                    breakpoint: "small",
                }}
                themeColor="primary"
            >
                <h2>Unsere Vision</h2>
                <p>
                    <span className={styles.highlighted}>Gott</span> hat unser
                    Leben, durch{" "}
                    <span className={styles.highlighted}>Jesus Christus</span>,
                    sehr verändert;
                    <br />
                    wir lieben Ihn und Sein{" "}
                    <span className={styles.highlighted}>Wort</span> und
                    bezeugen Seine Gnade und Liebe;
                    <br />
                    wir bejüngern und befähigen Menschen, durch die Kraft des{" "}
                    <span className={styles.highlighted}>Heiligen Geistes</span>
                    , ihre Welt zu verändern.
                </p>
            </Section>
            <Divider variant="page" themeColor="transparent" />
            <Section
                className={styles.valueSection}
                paperProps={{
                    breakpoint: "small",
                }}
                themeColor="primary"
                themeColorVariant="font"
            >
                <h2>Unsere Werte</h2>
                <Flex
                    breakpoint="small"
                    direction="column"
                    justify="flex-start"
                    alignItems="stretch"
                >
                    <Accordion
                        className={styles.mainValue}
                        summary="Hingegeben"
                        onOpen={onOpenAccordion(0)}
                        open={expandedMainValue === 0}
                    >
                        <Flex
                            direction="column"
                            style={{
                                padding: getDimensionValue(
                                    deviceSize === "normal" ||
                                        deviceSize === "large"
                                        ? 2
                                        : 1,
                                ),
                            }}
                        >
                            <ul>
                                <li>Gott hingegeben</li>
                                <li>Gott abgegeben</li>
                                <li>Herrschaft</li>
                                <li>Herr-gegeben</li>
                            </ul>
                        </Flex>
                    </Accordion>
                    <Accordion
                        className={styles.mainValue}
                        summary="Familiär"
                        onOpen={onOpenAccordion(1)}
                        open={expandedMainValue === 1}
                    >
                        <Flex
                            direction="column"
                            style={{
                                padding: getDimensionValue(
                                    deviceSize === "normal" ||
                                        deviceSize === "large"
                                        ? 2
                                        : 1,
                                ),
                            }}
                        >
                            <ul>
                                <li>Heim kommen</li>
                                <li>Angenommen</li>
                                <li>Authentisch</li>
                                <li>Zugehörig</li>
                                <li>Füreinander da sein</li>
                            </ul>
                        </Flex>
                    </Accordion>
                    <Accordion
                        className={styles.mainValue}
                        summary="In Jüngerschaft gehen"
                        onOpen={onOpenAccordion(2)}
                        open={expandedMainValue === 2}
                    >
                        <Flex
                            direction="column"
                            small={{
                                direction: "row",
                            }}
                            style={{
                                padding: getDimensionValue(
                                    deviceSize === "normal" ||
                                        deviceSize === "large"
                                        ? 2
                                        : 1,
                                ),
                            }}
                        >
                            <ul>
                                <li>Anleiten</li>
                                <li>unterordnen</li>
                                <li>Identität</li>
                                <li>Ermutigen</li>
                                <li>Ermahnen</li>
                                <li>Dienen</li>
                            </ul>
                            <ul>
                                <li>Transparent</li>
                                <li>Vertrauen</li>
                                <li>Ermächtigt sein/Autorität</li>
                                <li>Gelebtes</li>
                                <li>Aussenden</li>
                            </ul>
                        </Flex>
                    </Accordion>
                    <Accordion
                        className={styles.mainValue}
                        summary="Wiederherstellend"
                        onOpen={onOpenAccordion(3)}
                        open={expandedMainValue === 3}
                    >
                        <Flex
                            direction="column"
                            small={{
                                direction: "row",
                            }}
                            style={{
                                padding: getDimensionValue(
                                    deviceSize === "normal" ||
                                        deviceSize === "large"
                                        ? 2
                                        : 1,
                                ),
                            }}
                        >
                            <ul>
                                <li>Sanftmütig</li>
                                <li>Erbarmend</li>
                                <li>Geduldig</li>
                                <li>Hoffnungsvoll</li>
                                <li>Erbauend</li>
                                <li>Gebet</li>
                                <li>Wertschätzend</li>
                                <li>Heilbringend</li>
                            </ul>
                            <ul>
                                <li>Vergebend</li>
                                <li>Geistgeleitet</li>
                                <li>Zuhörend</li>
                                <li>Aufmerksam</li>
                                <li>Sensibel</li>
                                <li>Aushalten</li>
                            </ul>
                        </Flex>
                    </Accordion>
                    <Accordion
                        className={styles.mainValue}
                        summary="Dienend"
                        onOpen={onOpenAccordion(4)}
                        open={expandedMainValue === 4}
                    >
                        <Flex
                            direction="column"
                            style={{
                                padding: getDimensionValue(
                                    deviceSize === "normal" ||
                                        deviceSize === "large"
                                        ? 2
                                        : 1,
                                ),
                            }}
                        >
                            <ul>
                                <li>Selbstlos</li>
                                <li>Treu</li>
                                <li>Höherachtend</li>
                                <li>Zuverlässig</li>
                                <li>Nächstenliebe</li>
                                <li>Zeit</li>
                                <li>Hingabe</li>
                            </ul>
                        </Flex>
                    </Accordion>
                    <Accordion
                        className={styles.mainValue}
                        summary="In Leiterschaft bringen"
                        onOpen={onOpenAccordion(5)}
                        open={expandedMainValue === 5}
                    >
                        <Flex
                            direction="column"
                            small={{
                                direction: "row",
                            }}
                            style={{
                                padding: getDimensionValue(
                                    deviceSize === "normal" ||
                                        deviceSize === "large"
                                        ? 2
                                        : 1,
                                ),
                            }}
                        >
                            <ul>
                                <li>Richtungsweisend</li>
                                <li>Vorbildliches Leben</li>
                                <li>Geisterfüllt, geistgeleitet</li>
                                <li>Dienend</li>
                                <li>Autorität</li>
                            </ul>
                            <ul>
                                <li>Geistliche Reife</li>
                                <li>Nächste Generation fördernd</li>
                                <li>Belehrbar</li>
                                <li>
                                    Wird geleitet von Geschwistern, Jüngerschaft
                                </li>
                            </ul>
                        </Flex>
                    </Accordion>
                </Flex>
            </Section>
            <Divider variant="page" themeColor="transparent" />
            <Section
                paperProps={{
                    breakpoint: "small",
                }}
                themeColor="primary"
            >
                <h2>Geistliches Leitbild</h2>
                <p>
                    Unsere Vision und unsere Werte sind auch nochmal
                    ausführlicher in unserem geistlichem Leitbild dargestellt.
                    Dieses können Sie hier herunterladen:
                </p>

                <Button
                    leftSegment={<FaDownload />}
                    onClick={() => {
                        // TODO: Not implemented; add download logic
                    }}
                    themeColor="primary"
                    variant="contained"
                >
                    Download *TBD
                </Button>
            </Section>
        </PageContainer>
    )
}
