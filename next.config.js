/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [{ hostname: 'files.edgestore.dev' }],
	},
	experimental: {
		optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
	},
}

module.exports = nextConfig
