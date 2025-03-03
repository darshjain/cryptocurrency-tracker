/** @type {import('next').NextConfig} */
const nextConfig = {
    // allow all images 
    images: {
        domains: ["www.iconsdb.com", 'assets.coingecko.com', 'cdn1.iconfinder.com', 'cdn4.iconfinder.com', 'cdn2.iconfinder.com', 'cdn0.iconfinder.com', 'upload.wikimedia.org'],
    },
};

export default nextConfig;
