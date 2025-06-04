import express from 'express';
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/scrape', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Falta el parámetro ?url=' });

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const iframeSrc = await page.evaluate(() => {
      const iframe = document.querySelector('iframe');
      return iframe ? iframe.src : null;
    });

    await browser.close();

    if (!iframeSrc) {
      return res.status(200).json({ iframe: null, mensaje: 'No se encontró iframe visible con JS activo' });
    }

    res.json({ iframe: iframeSrc });
  } catch (err) {
    res.status(500).json({ error: 'Falló Puppeteer', detalle: err.message });
  }
});

app.listen(port, () => {
  console.log(`Streameko scraper activo en http://localhost:${port} 🚀`);
});
