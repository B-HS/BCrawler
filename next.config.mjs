/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img2.quasarzone.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'image.fmkorea.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn2.ppomppu.co.kr',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.ppomppu.co.kr',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'media.tenor.com',
                pathname: '/**',
            },
        ],
    },
}

export default nextConfig
