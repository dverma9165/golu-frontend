import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const BACKEND_URL = 'https://golu-backend.onrender.com/api/files';
const CLIENT_URL = 'https://www.dikshadesign.in';
const OUTPUT_FILE = path.join(__dirname, 'public', 'sitemap.xml');

const staticRoutes = [
    { url: '/', priority: 1.0, freq: 'daily' },
    { url: '/about', priority: 0.6, freq: 'monthly' },
    { url: '/terms', priority: 0.6, freq: 'monthly' },
    { url: '/contact', priority: 0.6, freq: 'monthly' }
];


async function generateSitemap() {
    console.log('Starting Sitemap Generation...');

    try {
        // 1. Fetch Products
        // We use a high limit to try and fetch all products for the sitemap
        console.log(`Fetching products from ${BACKEND_URL}...`);
        const { data } = await axios.get(`${BACKEND_URL}?limit=5000`);

        // API returns { files: [...], ... }
        const products = data?.files || [];
        console.log(`Fetched ${products.length} products.`);

        // 2. Build XML
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Static Pages
        staticRoutes.forEach(route => {
            xml += `
  <url>
    <loc>${CLIENT_URL}${route.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.freq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
        });

        // Category Pages (moved here)
        xml += `
  <url>
    <loc>${CLIENT_URL}/cdr-downloads</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${CLIENT_URL}/psd-downloads</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

        // Product Pages
        products.forEach(product => {
            // Use updatedAt if available, else createdAt, else now
            const dateStr = product.updatedAt || product.createdAt || new Date().toISOString();
            const lastMod = new Date(dateStr).toISOString().split('T')[0];

            xml += `
  <url>
    <loc>${CLIENT_URL}/product/${product._id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

        });



        xml += `
</urlset>`;

        // 3. Write to File
        fs.writeFileSync(OUTPUT_FILE, xml);
        console.log(`✅ Sitemap successfully generated at: ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('❌ Error generating sitemap:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('   Configured Backend URL:', BACKEND_URL);
            console.error('   Make sure your backend server is running!');
        }
    }
}

generateSitemap();