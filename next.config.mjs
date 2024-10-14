/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/ambil-antrean',
                destination: '/queue/polyclinic',
            },
        ]
    },
};

export default nextConfig;
