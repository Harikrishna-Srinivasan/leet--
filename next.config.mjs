/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    experimental: {
        optimizePackageImports: [
            'three',
            '@react-three/fiber',
            '@react-three/drei',
            'lucide-react',
        ],
        serverActions: {
            allowedOrigins: [
                'http://localhost:3000',
                process.env.AUTH_URL,
                '*',
            ].filter(Boolean),
        },
    },
    productionBrowserSourceMaps: false,
};

export default nextConfig;
