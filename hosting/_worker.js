// Serve the maintained public GitHub Pages build under the memorable address.
// Fixed upstream and paths prevent this from becoming a general-purpose proxy.
const source = 'https://xuwenwu.github.io/dow-opportunity-finder/';
const files = new Set(['index.html', 'embed.js', 'feed.xml', 'digest.html',
  'data/features.json', 'data/opportunities.json', 'data/stories.json',
  'data/mentors.json', 'data/meta.json']);
export default {
  async fetch(request) {
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', {status:405, headers:{Allow:'GET, HEAD'}});
    const path = new URL(request.url).pathname.slice(1) || 'index.html';
    if (!files.has(path)) return new Response('Not found', {status:404});
    try {
      // No user cookies, query strings, authorization, or form data go upstream.
      const upstream = await fetch(source + path, {method:request.method,
        redirect:'manual', signal:AbortSignal.timeout(15000), cf:{cacheTtl:60,cacheEverything:true}});
      if (upstream.status >= 300 && upstream.status < 400) throw new Error('Unexpected redirect');
      const headers = new Headers(upstream.headers);
      headers.delete('set-cookie');
      headers.set('Cache-Control', 'public, max-age=60');
      headers.set('X-Content-Type-Options', 'nosniff');
      return new Response(upstream.body, {status:upstream.status, headers});
    } catch {
      return new Response('The opportunity finder is temporarily unavailable. Please try again shortly.',
        {status:503, headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}});
    }
  }
};
