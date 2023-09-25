import { create } from "zustand"

export interface NewsListZustand {
    filter: string
}

const useNewsListZustand = create<NewsListZustand>()((state) => ({
    filter: "",
}))

export default useNewsListZustand
