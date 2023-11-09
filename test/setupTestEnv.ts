import dotenv from "dotenv"
import { join, resolve } from "path"

dotenv.config({
    path: resolve(process.cwd(), ".env"),
})

import { randomInt } from "crypto"
import { readFile } from "fs/promises"
import { getPasswordHash } from "../src/lib/backend/auth"
import { getClient } from "../src/lib/backend/databaseHelpers"
import { sermons } from "./sermons"
import { users } from "./users"

export async function resetTables() {
    await getClient().$transaction([
        getClient().responseLog.deleteMany(),
        getClient().errorLog.deleteMany(),

        getClient().newsPost.deleteMany(),
        getClient().sermon.deleteMany(),
        getClient().fileChunk.deleteMany(),
        getClient().file.deleteMany(),

        getClient().sermonSeries.deleteMany(),
        getClient().sermonSpeaker.deleteMany(),
        getClient().user.deleteMany(),
    ])
}

export async function setupUsers() {
    await getClient().user.deleteMany()
    for await (const user of users) {
        console.log(`Uploading User ${user.name}`)

        const passwordHash = await getPasswordHash(user.password)
        await getClient().user.create({
            data: {
                userName: user.name,
                passwordHash,
                email: `${user.name}@example.com`,
                flags: {
                    Admin: user.flags.Admin ?? false,
                    ManageCalendar: user.flags.ManageCalendar ?? false,
                    ManageNews: user.flags.ManageNews ?? false,
                    ManageRooms: user.flags.ManageRooms ?? false,
                    ManageSermons: user.flags.ManageSermons ?? false,
                    ManageUser: user.flags.ManageUser ?? false,
                },
            },
        })
    }
}

const count = 10

export async function setupSermons() {
    for await (const sermon of sermons) {
        const millisecondsInADay = 1000 * 60 * 60 * 24
        const date = new Date(
            Date.now() - millisecondsInADay * randomInt(365, 365 * 3),
        )
        for (let copyIndex = 0; copyIndex < count; copyIndex++) {
            const s = {
                ...sermon,
                title: `${sermon.title} - Teil ${copyIndex + 1}`,
            }

            console.log(`Working on Sermon ${s.speaker.name} - ${s.title}`)

            const fileBuffer = await readFile(
                join(__dirname, "audio", s.fileName),
            )
            const blob = new Blob([fileBuffer])
            const arrayBuffers = await Promise.all(
                Array.from<Buffer>({
                    length: Math.ceil(fileBuffer.byteLength / 16_000_000),
                }).reduce(
                    ({ chunks, position }) => ({
                        chunks: [
                            ...chunks,
                            blob
                                .slice(position, position + 16_000_000)
                                .arrayBuffer(),
                        ],
                        position: position + 16_000_000,
                    }),
                    { chunks: [], position: 0 } as {
                        chunks: Promise<ArrayBuffer>[]
                        position: number
                    },
                ).chunks,
            )
            const chunks = arrayBuffers.map((buffer) => Buffer.from(buffer))

            const creationDate = new Date(
                date.getTime() - millisecondsInADay * copyIndex,
            )

            console.log(`Uploading sermon audio file ${s.title}`)

            const file = await getClient().file.create({
                data: {
                    name: s.fileName,
                    extension: "mp3",
                    mimeType: "audio/mpeg",
                    role: "SermonAudioFile",
                    uploadDateTime: creationDate,
                    chunks: {
                        create: chunks.map((chunk) => ({
                            content: chunk,
                        })),
                    },
                },
            })
            const sermonSeries =
                s.series === undefined
                    ? undefined
                    : (await getClient().sermonSeries.findFirst({
                          where: {
                              title: s.series.title,
                          },
                      })) ?? undefined

            console.log(`Uploading sermon ${s.title}`)

            await getClient().sermon.create({
                data: {
                    date: creationDate,
                    title: s.title,
                    audioFile: {
                        connect: {
                            id: file.id,
                        },
                    },
                    speaker: {
                        connectOrCreate: {
                            create: {
                                initials: s.speaker.initials,
                                name: s.speaker.name,
                            },
                            where: {
                                initials: s.speaker.initials,
                            },
                        },
                    },
                    series:
                        sermonSeries !== undefined
                            ? {
                                  connect: {
                                      id: sermonSeries?.id,
                                  },
                              }
                            : s.series !== undefined
                            ? {
                                  create: {
                                      title: s.series.title,
                                  },
                              }
                            : undefined,
                },
            })
            console.log(`Finished uploading sermon ${s.title}`)
        }
    }
}

export async function setupTestEnv(reset?: boolean) {
    if (reset) {
        await resetTables()
    }

    await setupUsers()
    await setupSermons()

    console.log("Finished")
}

setupTestEnv(true)
