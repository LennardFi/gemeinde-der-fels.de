const useMediaQuery = (query: string): boolean => {
    return window.matchMedia(query).matches
}

export default useMediaQuery
