import Website from "@/typings"

const theme: Website.Design.Theme = {
    background: {
        default: "hsl(0, 0%, 98%)",
        defaultFont: "hsl(0, 0%, 14%)",
        highlighted: "hsl(0, 0%, 86%)",
        highlightedFont: "hsl(0, 0%, 6%)",
        faded: "",
        fadedFont: "",
    },
    accent: {
        default: "hsl(0, 0%, 20%)",
        defaultFont: "hsl(0, 0%, 88%)",
        highlighted: "hsl(0, 0%, 25%)",
        highlightedFont: "hsl(0, 0%, 98%)",
        faded: "hsl(0, 0%, 80%)",
        fadedFont: "hsl(0, 0%, 8%)",
    },
    primary: {
        default: "hsl(180, 100%, 25%)",
        highlighted: "hsl(180, 100%, 30%)",
        faded: "hsl(180, 33%, 70%)",
        defaultFont: "hsl(0, 100%, 98%)",
        highlightedFont: "hsl(0, 100%, 98%)",
        fadedFont: "hsl(0, 0%, 8%)",
    },
    secondary: {
        default: "",
        defaultFont: "",
        faded: "",
        fadedFont: "",
        highlighted: "",
        highlightedFont: "",
    },
}

export default theme
