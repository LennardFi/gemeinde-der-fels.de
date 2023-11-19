/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    transpilePackages: [],
    poweredByHeader: false,
    images: {
        domains: ["picsum.photos", "placekitten.com"],
    },
}

module.exports = nextConfig
