import fetch from 'node-fetch';
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

    const iframes = [];
    $('iframe').each((_, el) => {
      const src = $(el).attr('src');
      if (src) iframes.push(src);
    });

    if (iframes.length === 0) {
      return res.status(200).json({ iframe: null, mensaje: 'No se encontró ningún iframe' });
    }

    // Regresa el primero como antes, pero mostrando todos si lo necesitas
    return res.status(200).json({ iframe: iframes[0], encontrados: iframes });
  } catch (err) {
    return res.status(500).json({ error: 'Falló el scraping', detalle: err.message });
  }
}
