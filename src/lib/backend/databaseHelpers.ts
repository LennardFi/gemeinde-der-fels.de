import { Maybe } from "@/typings"
import { DatabaseMetadata, PrismaClient } from "@prisma/client"
import { mkdir, readFile, writeFile } from "fs/promises"
import { join, resolve } from "path"
import { cwd } from "process"
import { WebsiteError } from "../shared/errors"

let _client: Maybe<PrismaClient>
export const getClient = (): PrismaClient => {
    if (_client === undefined) {
        try {
            _client = new PrismaClient()
            _client.$connect()
            console.log("Connected database client...")
            return _client
        } catch (err) {
            throw new WebsiteError(
                "database",
                "Could not establish a database connection",
                {
                    databaseConnectionError: true,
                    httpStatusCode: 500,
                },
                {
                    err,
                },
            )
        }
    }

    return _client
}

export const databaseVersion: DatabaseMetadata["version"] = 1

export const filesFolderPath = resolve(
    cwd(),
    process.env["GDF_FILES_FOLDER"] ?? "./files",
)

export async function storeFileToFolder(
    fileId: string,
    fileExtension: string,
    fileContent: Buffer,
): Promise<void> {
    try {
        const fileName = `${fileId}.${fileExtension}`
        await writeFile(join(filesFolderPath, fileName), fileContent)
    } catch (e) {
        if (
            typeof e === "object" &&
            e !== null &&
            "code" in e &&
            e.code === "ENOENT"
        ) {
            try {
                await mkdir(filesFolderPath, {
                    recursive: true,
                })
            } catch (e) {
                throw new WebsiteError(
                    "database",
                    "Could not create files folder",
                    {
                        httpStatusCode: 500,
                        internalException: e instanceof Error ? e : undefined,
                        internalMessage: JSON.stringify(e),
                    },
                    { e },
                )
            }
            await storeFileToFolder(fileId, fileExtension, fileContent)
            return
        }

        throw new WebsiteError(
            "database",
            "Unknown error writing file to files folder",
            {
                internalException: e instanceof Error ? e : undefined,
                internalMessage: JSON.stringify(e),
            },
            { e },
        )
    }
}

export async function readFileFromFolder(
    fileId: string,
    fileExtension: string,
): Promise<Buffer> {
    try {
        const fileName = `${fileId}.${fileExtension}`
        return await readFile(join(filesFolderPath, fileName))
    } catch (e) {
        if (
            typeof e === "object" &&
            e !== null &&
            "code" in e &&
            e.code === "ENOENT"
        ) {
            throw new WebsiteError(
                "database",
                "File not found",
                {
                    httpStatusCode: 404,
                    httpStatusText: "File not found",
                    internalException: e instanceof Error ? e : undefined,
                    internalMessage: JSON.stringify(e),
                },
                { e },
            )
        }

        throw new WebsiteError(
            "database",
            "Unknown error reading file from files folder",
            {
                internalException: e instanceof Error ? e : undefined,
                internalMessage: JSON.stringify(e),
            },
            { e },
        )
    }
}
