"use client"

import Flex from "@/components/containers/Flex"
import PageContainer from "@/components/containers/PageContainer"
import Section from "@/components/containers/Section"
import Button from "@/components/inputs/Button"
import Paper from "@/components/surfaces/Paper"
import useDebouncedValue from "@/hooks/useDebouncedValue"
import useDeviceSize from "@/hooks/useDeviceSize"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { FaAngleRight, FaDownload } from "react-icons/fa"
import styles from "./page.module.scss"

const animationTime = 0.25

export default function Page() {
    const [expandedMainValue, setExpandedMainValue] = useState(0)
    const debouncedExpandedMainValue = useDebouncedValue(
        expandedMainValue,
        animationTime * 1500,
    )
    const deviceSize = useDeviceSize("tiny")

    const onToggleMainValue = (index: number) => () =>
        setExpandedMainValue((prev) => (prev === index ? -1 : index))

    return (
        <PageContainer noPadding title="Werte und Vision" themeColor="primary">
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
                    alignItems="center"
                    small={{
                        direction: "row",
                        alignItems: "stretch",
                    }}
                >
                    <Paper noPadding>
                        <details
                            className={styles.mainValue}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            open={
                                expandedMainValue === 0 ||
                                debouncedExpandedMainValue === 0
                            }
                        >
                            <summary onClick={onToggleMainValue(0)}>
                                <FaAngleRight
                                    className={styles.mainValueIcon}
                                    style={{
                                        rotate:
                                            expandedMainValue !== 0
                                                ? "0deg"
                                                : "90deg",
                                    }}
                                />{" "}
                                Hingegeben
                            </summary>
                            <AnimatePresence>
                                {expandedMainValue === 0 ? (
                                    <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: "auto",
                                            opacity: 1,
                                        }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            type: "keyframes",
                                            ease: "easeInOut",
                                            duration: animationTime,
                                        }}
                                    >
                                        <li>Gott hingegeben</li>
                                        <li>Gott abgegeben</li>
                                        <li>Herrschaft</li>
                                        <li>Herr-gegeben</li>
                                    </motion.ul>
                                ) : null}
                            </AnimatePresence>
                        </details>
                        <details
                            className={styles.mainValue}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            open={
                                expandedMainValue === 1 ||
                                debouncedExpandedMainValue === 1
                            }
                        >
                            <summary onClick={onToggleMainValue(1)}>
                                <FaAngleRight
                                    className={styles.mainValueIcon}
                                    style={{
                                        rotate:
                                            expandedMainValue !== 1
                                                ? "0deg"
                                                : "90deg",
                                    }}
                                />{" "}
                                Familiär
                            </summary>
                            <AnimatePresence>
                                {expandedMainValue === 1 ? (
                                    <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: "auto",
                                            opacity: 1,
                                        }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            type: "keyframes",
                                            ease: "easeInOut",
                                            duration: animationTime,
                                        }}
                                        // onClick={(e) => {
                                        //     e.preventDefault()
                                        //     e.stopPropagation()
                                        // }}
                                    >
                                        <li>Heim kommen</li>
                                        <li>Angenommen</li>
                                        <li>Authentisch</li>
                                        <li>Zugehörig</li>
                                        <li>Füreinander da sein</li>
                                    </motion.ul>
                                ) : null}
                            </AnimatePresence>
                        </details>
                        <details
                            className={styles.mainValue}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            open={
                                expandedMainValue === 2 ||
                                debouncedExpandedMainValue === 2
                            }
                        >
                            <summary onClick={onToggleMainValue(2)}>
                                <FaAngleRight
                                    className={styles.mainValueIcon}
                                    style={{
                                        rotate:
                                            expandedMainValue !== 2
                                                ? "0deg"
                                                : "90deg",
                                    }}
                                />{" "}
                                In Jüngerschaft gehen
                            </summary>
                            <AnimatePresence>
                                {expandedMainValue === 2 ? (
                                    <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: "auto",
                                            opacity: 1,
                                        }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            type: "keyframes",
                                            ease: "easeInOut",
                                            duration: animationTime,
                                        }}
                                        // onClick={(e) => {
                                        //     e.preventDefault()
                                        //     e.stopPropagation()
                                        // }}
                                    >
                                        <li>Anleiten</li>
                                        <li>unterordnen</li>
                                        <li>Identität</li>
                                        <li>Ermutigen</li>
                                        <li>Ermahnen</li>
                                        <li>Dienen</li>
                                        <li>Transparent</li>
                                        <li>Vertrauen</li>
                                        <li>Ermächtigt sein/Autorität</li>
                                        <li>Gelebtes</li>
                                        <li>Aussenden</li>
                                    </motion.ul>
                                ) : null}
                            </AnimatePresence>
                        </details>
                    </Paper>
                    <Paper noPadding>
                        <details
                            className={styles.mainValue}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            open={
                                expandedMainValue === 3 ||
                                debouncedExpandedMainValue === 3
                            }
                        >
                            <summary onClick={onToggleMainValue(3)}>
                                <FaAngleRight
                                    className={styles.mainValueIcon}
                                    style={{
                                        rotate:
                                            expandedMainValue !== 3
                                                ? "0deg"
                                                : "90deg",
                                    }}
                                />{" "}
                                Wiederherstellend
                            </summary>
                            <AnimatePresence>
                                {expandedMainValue === 3 ? (
                                    <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: "auto",
                                            opacity: 1,
                                        }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            type: "keyframes",
                                            ease: "easeInOut",
                                            duration: animationTime,
                                        }}
                                        // onClick={(e) => {
                                        //     e.preventDefault()
                                        //     e.stopPropagation()
                                        // }}
                                    >
                                        <li>Sanftmütig</li>
                                        <li>Erbarmend</li>
                                        <li>Geduldig</li>
                                        <li>Hoffnungsvoll</li>
                                        <li>Erbauend</li>
                                        <li>Gebet</li>
                                        <li>Wertschätzend</li>
                                        <li>Heilbringend</li>
                                        <li>Vergebend</li>
                                        <li>Geistgeleitet</li>
                                        <li>Zuhörend</li>
                                        <li>Aufmerksam</li>
                                        <li>Sensibel</li>
                                        <li>Aushalten</li>
                                        <li>Aushalten</li>
                                    </motion.ul>
                                ) : null}
                            </AnimatePresence>
                        </details>
                        <details
                            className={styles.mainValue}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            open={
                                expandedMainValue === 4 ||
                                debouncedExpandedMainValue === 4
                            }
                        >
                            <summary onClick={onToggleMainValue(4)}>
                                <FaAngleRight
                                    className={styles.mainValueIcon}
                                    style={{
                                        rotate:
                                            expandedMainValue !== 4
                                                ? "0deg"
                                                : "90deg",
                                    }}
                                />{" "}
                                Dienend
                            </summary>
                            <AnimatePresence>
                                {expandedMainValue === 4 ? (
                                    <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: "auto",
                                            opacity: 1,
                                        }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            type: "keyframes",
                                            ease: "easeInOut",
                                            duration: animationTime,
                                        }}
                                        // onClick={(e) => {
                                        //     e.preventDefault()
                                        //     e.stopPropagation()
                                        // }}
                                    >
                                        <li>Selbstlos</li>
                                        <li>Treu</li>
                                        <li>Höherachtend</li>
                                        <li>Zuverlässig</li>
                                        <li>Nächstenliebe</li>
                                        <li>Zeit</li>
                                        <li>Hingabe</li>
                                    </motion.ul>
                                ) : null}
                            </AnimatePresence>
                        </details>
                        <details
                            className={styles.mainValue}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            open={
                                expandedMainValue === 5 ||
                                debouncedExpandedMainValue === 5
                            }
                        >
                            <summary onClick={onToggleMainValue(5)}>
                                <FaAngleRight
                                    className={styles.mainValueIcon}
                                    style={{
                                        rotate:
                                            expandedMainValue !== 5
                                                ? "0deg"
                                                : "90deg",
                                    }}
                                />{" "}
                                In Leiterschaft bringen
                            </summary>
                            <AnimatePresence>
                                {expandedMainValue === 5 ? (
                                    <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: "auto",
                                            opacity: 1,
                                        }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            type: "keyframes",
                                            ease: "easeInOut",
                                            duration: animationTime,
                                        }}
                                        // onClick={(e) => {
                                        //     e.preventDefault()
                                        //     e.stopPropagation()
                                        // }}
                                    >
                                        <li>Richtungsweisend</li>
                                        <li>Vorbildliches Leben</li>
                                        <li>Geisterfüllt, geistgeleitet</li>
                                        <li>Dienend</li>
                                        <li>Autorität</li>
                                        <li>Geistliche Reife</li>
                                        <li>Nächste Generation fördernd</li>
                                        <li>Belehrbar</li>
                                        <li>
                                            Wird geleitet von Geschwistern,
                                            Jüngerschaft
                                        </li>
                                    </motion.ul>
                                ) : null}
                            </AnimatePresence>
                        </details>
                    </Paper>
                </Flex>
            </Section>
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
