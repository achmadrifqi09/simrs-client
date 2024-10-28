/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa'
const nextConfig = {
    swcMinify: true,
    async rewrites() {
        return [
            {
                source: '/ambil-antrean',
                destination: '/queue/polyclinic',
            },
        ]
    },
};

export default withPWA({
    // dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    // skipWaiting: true,
    sw: '/sw.js'
})(nextConfig);
