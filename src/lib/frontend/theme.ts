import Website from "@/typings"

const theme: Website.Design.Theme = {
    base: {
        default: "hsl(0, 0%, 98%)",
        highlighted: "hsl(0, 0%, 86%)",
        defaultFont: "hsl(0, 0%, 20%)",
        highlightedFont: "hsl(0, 0%, 25%)",
        faded: "",
        fadedFont: "",
    },
    primary: {
        default: "hsl(0, 0%, 20%)",
        highlighted: "hsl(0, 0%, 30%)",
        faded: "hsl(0, 0%, 80%)",
        defaultFont: "hsl(0, 0%, 95%)",
        highlightedFont: "hsl(0, 0%, 100%)",
        fadedFont: "hsl(0, 0%, 20%)",
    },
    secondary: {
        default: "hsl(11, 62%, 37%)",
        highlighted: "hsl(23, 52%, 56%)",
        faded: "hsl(23, 44%, 82%)",
        defaultFont: "hsl(0, 0%, 95%)",
        highlightedFont: "hsl(0, 0%, 100%)",
        fadedFont: "hsl(0, 0%, 20%)",
    },
    accent: {
        default: "hsl(201, 37%, 38%)",
        highlighted: "hsl(201deg 37% 46%)",
        faded: "hsl(201deg 37% 83%)",
        defaultFont: "hsl(0, 0%, 95%)",
        highlightedFont: "hsl(0, 0%, 100%)",
        fadedFont: "hsl(0, 0%, 20%)",
    },
}

export default theme
