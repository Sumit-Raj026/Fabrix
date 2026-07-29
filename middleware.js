export const config = {
  matcher: '/(.*)',
};

export default function middleware(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  const botRegex = /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator|whatsapp/i;

  if (botRegex.test(userAgent) && !url.pathname.startsWith('/api') && url.pathname !== '/sitemap.xml') {
    const prerenderUrl = new URL(`/api/prerender?url=${encodeURIComponent(request.url)}`, request.url);
    return Response.redirect(prerenderUrl, 307);
  }
}
