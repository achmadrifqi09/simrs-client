/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa'
const nextConfig = {
    swcMinify: true,
    async rewrites() {
        return [
            {
                source: '/ambil-antrean',
                destination: '/queue/unit',
            },
            {
                source: '/display-antrian-admisi',
                destination: '/queue/display',
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3001',
                pathname: '/storage/**',
            },
        ],
    },
};

export default withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
})(nextConfig);
