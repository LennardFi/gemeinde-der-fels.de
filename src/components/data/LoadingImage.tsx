import { asyncSleep } from "@/lib/shared/develop"
import { Maybe } from "@/typings"
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import Image, { ImageProps } from "next/image"
import { useEffect, useState } from "react"
import Skeleton from "../feedback/Skeleton"

export type RandomImagePlaceholder = [width: number, height: number]

export type LoadingImageProps = Omit<ImageProps, "src"> & {
    height: number
    width: number
    src: string | StaticImport | RandomImagePlaceholder
}

export default function LoadingImage({
    height,
    width,
    onLoadingComplete,
    src,
    style,
    ...rest
}: LoadingImageProps) {
    const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(
        null,
    )
    const [isClientSideRendered, setIsClientSideRendered] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [randomImageSeed, setRandomImageSeed] = useState(0)
    const [renderedDimensions, setRenderedDimensions] =
        useState<Maybe<[width: number, height: number]>>(undefined)

    useEffect(() => {
        setIsClientSideRendered(true)
        setRandomImageSeed(Math.random())
    }, [])

    useEffect(() => {
        if (containerRef !== null) {
            const resize = () => {
                if (width > containerRef.clientWidth) {
                    const newValue: RandomImagePlaceholder = [
                        containerRef.clientWidth,
                        (100 / containerRef.clientWidth) * (width / height),
                    ]
                    console.log("containerRef", newValue)
                    setRenderedDimensions(newValue)
                    return
                }

                // if (height > containerRef.clientHeight) {
                //     const newValue: RandomImagePlaceholder = [
                //         (100 / containerRef.clientHeight) * (width / height),
                //         containerRef.clientHeight,
                //     ]
                //     console.log("containerRef", newValue)
                //     setRenderedDimensions(newValue)
                //     return
                // }
                const newValue: RandomImagePlaceholder = [
                    containerRef.clientWidth,
                    containerRef.clientHeight,
                ]
                console.log("containerRef", newValue)
                setRenderedDimensions(newValue)
            }
            const handler = () => resize()
            document.addEventListener("resize", handler)
            resize()
            return () => document.removeEventListener("resize", handler)
        }
    }, [containerRef, width])

    if (Array.isArray(src)) {
        return (
            <div
                ref={(ref) => {
                    console.log("setting ref")
                    setContainerRef(ref)
                }}
                style={{
                    height: `min(100%, ${renderedDimensions?.[1] ?? height}px)`,
                    width: `min(100%, ${renderedDimensions?.[0] ?? width}px)`,
                }}
            >
                {!isClientSideRendered ? (
                    <Skeleton width="100%" height="100%" />
                ) : (
                    <>
                        {isLoading ? (
                            <Skeleton width="100%" height="100%" />
                        ) : null}
                        <Image
                            height={height}
                            width={width}
                            onLoadingComplete={async (img) => {
                                await asyncSleep(10_000)
                                setIsLoading(false)
                                onLoadingComplete?.(img)
                            }}
                            src={`https://picsum.photos/seed/${randomImageSeed}/${src[0]}/${src[1]}`}
                            style={
                                isLoading
                                    ? {
                                          //   display: "none",
                                          height: 0,
                                          opacity: 0,
                                          overflow: "hidden",
                                          ...style,
                                      }
                                    : {
                                          maxHeight: "100%",
                                          maxWidth: "100%",
                                          ...style,
                                      }
                            }
                            {...rest}
                        />
                    </>
                )}
            </div>
        )
    }

    return (
        <Image
            {...rest}
            height={height}
            width={width}
            onLoadingComplete={onLoadingComplete}
            src={src}
            style={style}
        />
    )
}
