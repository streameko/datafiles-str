export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url || (!url.includes('richardsignfish.com') && !url.includes('cybervynx.com'))) {
    return new Response(JSON.stringify({ error: 'URL inválida' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const res = await fetch(url);
  const html = await res.text();

  const match = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  const embedUrl = match ? match[1] : null;

  return new Response(JSON.stringify({ embedUrl }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
