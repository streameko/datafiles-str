import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Falta el parámetro ?url=' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new', // Usa 'new' para evitar errores en Vercel o Render
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
      return res.status(200).json({ iframe: null, mensaje: 'No se encontró ningún iframe visible con JS activo' });
    }

    return res.status(200).json({ iframe: iframeSrc });
  } catch (err) {
    return res.status(500).json({ error: 'Falló Puppeteer', detalle: err.message });
  }
}
