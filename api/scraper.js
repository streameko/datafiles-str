import { load } from 'cheerio';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Falta el parámetro ?url=' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);

    // Buscar iframe dentro del HTML
    const iframe = $('iframe').attr('src') || null;

    return res.status(200).json({ iframe });
  } catch (err) {
    return res.status(500).json({ error: 'Falló el scraping', detalle: err.message });
  }
}
