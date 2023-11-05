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
    await Promise.all(
        users.map(async (user) => {
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
        }),
    )
}

const count = 4

export async function setupSermons() {
    await Promise.all(
        sermons
            .flatMap((sermon) =>
                Array.from({
                    length: count,
                }).map((_, i) => ({
                    ...sermon,
                    title: `${sermon.title} - Teil ${i + 1}`,
                })),
            )
            .map(async (sermon) => {
                console.log(
                    `Working on Sermon ${sermon.speaker.name} - ${sermon.title}`,
                )

                const fileBuffer = await readFile(
                    join(__dirname, "audio", sermon.fileName),
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
                    Date.now() - 1000 * 60 * 60 * 24 * randomInt(0, 365 * 2),
                )

                console.log(`Uploading sermon audio file ${sermon.title}`)

                const file = await getClient().file.create({
                    data: {
                        name: sermon.fileName,
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
                    sermon.series === undefined
                        ? undefined
                        : (await getClient().sermonSeries.findFirst({
                              where: {
                                  title: sermon.series.title,
                              },
                          })) ?? undefined

                console.log(`Uploading sermon ${sermon.title}`)

                await getClient().sermon.create({
                    data: {
                        date: creationDate,
                        title: sermon.title,
                        audioFile: {
                            connect: {
                                id: file.id,
                            },
                        },
                        speaker: {
                            connectOrCreate: {
                                create: {
                                    initials: sermon.speaker.initials,
                                    name: sermon.speaker.name,
                                },
                                where: {
                                    initials: sermon.speaker.initials,
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
                                : sermon.series !== undefined
                                ? {
                                      create: {
                                          title: sermon.series.title,
                                      },
                                  }
                                : undefined,
                    },
                })
                console.log(`Finished uploading sermon ${sermon.title}`)
            }),
    )
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
