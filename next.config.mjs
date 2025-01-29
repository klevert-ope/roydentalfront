/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	productionBrowserSourceMaps: false,
	reactProductionProfiling: true,
	compress: true,
};

export default nextConfig;
