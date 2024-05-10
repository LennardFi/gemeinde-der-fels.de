/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: [],
    poweredByHeader: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "picsum.photos",
                pathname: "**/*",
                port: "",
            },
            {
                protocol: "https",
                hostname: "placekitten.com",
                pathname: "**/*",
                port: "",
            },
        ],
    },
    experimental: {
        instrumentationHook: true,
    },
    async headers() {
        return [
            {
                // matching all API routes
                source: "/",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET" },
                    { key: "Access-Control-Allow-Headers", value: "*" },
                ],
            },
        ]
    },
}

module.exports = nextConfig
