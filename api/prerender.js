export default async function handler(req, res) {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const prerenderUrl = `https://service.prerender.io/${targetUrl}`;
    
    const response = await fetch(prerenderUrl, {
      headers: {
        'X-Prerender-Token': 'HQsOIJRkxwIty8zfm0Hj',
        'User-Agent': req.headers['user-agent'] || 'Vercel-Prerender-Proxy'
      }
    });

    const body = await response.text();
    
    // Ensure we set the correct content type
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    // Pass along the status code from Prerender (e.g. 200, 301, 404)
    res.status(response.status).send(body);
  } catch (error) {
    console.error('Error proxying to Prerender:', error);
    res.status(500).send('Internal Server Error');
  }
}
