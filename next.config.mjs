/** @type {import('next').NextConfig} */
const nextConfig = {
    // Optimize compilation speed
    swcMinify: true,
    powers: {
        // This is a placeholder for any futuristic optimizations in the canary
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    experimental: {
        optimizePackageImports: [
            'three',
            '@react-three/fiber',
            '@react-three/drei',
            'lucide-react'
        ],
        // Speed up development startup
        turbo: {
            rules: {
                // Custom rules if needed
            },
        },
    },
    // Prevent source map generation in development to speed up builds
    productionBrowserSourceMaps: false,
};

export default nextConfig;
