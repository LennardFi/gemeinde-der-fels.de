import { createContext } from "react"

export type TitleContext = [
    string,
    React.Dispatch<React.SetStateAction<string>>
]

export const defaultTitle = "Gemeinde der Fels"

export const TitleContext = createContext<TitleContext>([
    defaultTitle,
    () => {},
])
