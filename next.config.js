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
}

module.exports = nextConfig
