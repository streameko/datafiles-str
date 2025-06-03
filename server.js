import express from 'express';
import fetch from 'node-fetch';
import { load } from 'cheerio';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

// Soporte para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Scraper endpoint
app.get('/api/scrape', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Falta el parámetro ?url=' });

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);
    const iframe = $('iframe').attr('src') || null;
    res.json({ iframe });
  } catch (e) {
    res.status(500).json({ error: 'Falló el scraping', detalle: e.message });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Streameko scraper activo en http://localhost:${port} 🚀`);
});
