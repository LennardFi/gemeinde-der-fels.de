import { Maybe } from "@/typings"
import { useEffect, useState } from "react"

export type useRandomImageReturns = (
    id: string,
    height: number,
    width: number,
) => Maybe<string>

const useRandomImage = (): useRandomImageReturns => {
    const [isClientSideRendering, setIsClientSideRendering] = useState(false)

    useEffect(() => {
        setIsClientSideRendering(true)
    }, [])

    const getImageLinks: useRandomImageReturns = (id, height, width) => {
        if (!isClientSideRendering) {
            return undefined
        }

        return `https://picsum.photos/seed/${id}/${width}/${height}`
    }

    return getImageLinks
}

export default useRandomImage
