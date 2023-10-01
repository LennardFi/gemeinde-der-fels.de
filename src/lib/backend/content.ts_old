import { readFile, readdir, stat } from "fs/promises"
import { basename, extname, resolve } from "path"
import { remark } from "remark"
import remarkHtml from "remark-html"
import { parse } from "yaml"
import Website from "../../typings"

/**
 * @deprecated
 */
export const contentPath: string = "../../../../content"

/**
 * @deprecated
 */
const getFiles = async (dirPath: string): Promise<string[]> => {
    const subDirs = await readdir(dirPath)
    const files = await Promise.all(
        subDirs.map(async (subdir) => {
            const res = resolve(dirPath, subdir)
            return (await stat(res)).isDirectory() ? getFiles(res) : [res]
        })
    )
    return files.reduce((a, f) => a.concat(f), [])
}

/**
 * @deprecated
 */
export const listContentFiles = async (
    contentType: Website.Content.Core.ContentType,
    filter: Website.Content.Core.ContentFilesFilter
) => {
    const files = await getFiles(resolve(__dirname, contentPath, contentType))

    return files.filter((path) => {
        if (filter.fileType !== undefined) {
            if (
                filter.fileType === "markdown" &&
                extname(path) !== ".md" &&
                extname(path) !== ".mdx"
            ) {
                return false
            }

            if (filter.fileType === "json" && extname(path) !== ".json") {
                return false
            }
        }
        return true
    })
}

/**
 * @deprecated
 */
const parseMarkdownMetaDataString = <MetaDataFormat>(
    metaDataString: string
): MetaDataFormat => {
    return parse(metaDataString) as MetaDataFormat
}

/**
 * @deprecated
 */
export const readJsonContent = async <T>(
    contentFilePath: string
): Promise<Website.Content.Core.JsonContent<T>> => {
    const fileContent = await readFile(contentFilePath, {
        encoding: "utf8",
    })

    const value = JSON.parse(fileContent)

    return {
        content: value,
        fileContent,
        fileName: basename(contentFilePath),
        path: contentFilePath,
    }
}

export const markdownFileUrlSearchParam = "markdownPath"
export const imageFileUrlSearchParam = "imagePath"

/**
 * @deprecated
 */
export const readMarkdownContent = async <MetaDataFormat>(
    contentFilePath: string
): Promise<Website.Content.Core.MarkdownContent<MetaDataFormat>> => {
    const markdownCompiler = remark().use(remarkHtml)

    const fileContent = await readFile(contentFilePath, {
        encoding: "utf8",
    })

    const metaDataStringMatch = fileContent.match(/^---\n([\s\S]*?)\n---/)

    // Read markdown content
    const [metaData, description] = [
        parseMarkdownMetaDataString<MetaDataFormat>(
            metaDataStringMatch?.[1] ?? ""
        ),

        fileContent.substring((metaDataStringMatch?.[0] ?? "").length),
    ]

    return {
        description: String(
            await markdownCompiler.process(
                description.replaceAll(
                    /!\[(.*?)\]\((.*?)\)/gm,
                    (subString, imageCaption, imagePath) => {
                        return `![${imageCaption}](/api/markdown/image?markdownPath=${encodeURIComponent(
                            contentFilePath
                        )}&imagePath=${encodeURIComponent(imagePath)})`
                    }
                )
            )
        ),
        fileExtension: extname(contentFilePath),
        fileName: basename(contentFilePath),
        path: contentFilePath,
        metaData,
    }
}

/**
 * @deprecated
 */
export const readFileContent = async (
    contentFilePath: string
): Promise<Website.Content.Core.RawFileContent> => {
    const content = await readFile(contentFilePath)

    return {
        fileName: basename(contentFilePath),
        path: contentFilePath,
    }
}
