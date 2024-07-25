addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Check if the request is for the root directory
  if (url.pathname === '/') {
      return new Response('This is a proxy for the Telegram API.', {
          status: 200,
          headers: {
              'Content-Type': 'text/plain'
          }
      })
  }
  
  // Set up the proxy URL to forward the request to the Telegram API
  url.hostname = 'api.telegram.org'
  url.protocol = 'https'
  
  // Prepare the request headers
  const newHeaders = new Headers(request.headers)
  newHeaders.set('X-Forwarded-Host', request.headers.get('Host'))
  newHeaders.set('X-Forwarded-Server', request.headers.get('Host'))
  newHeaders.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP'))
  
  // Set up the new request
  const proxyRequest = new Request(url.toString(), {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: 'follow'
  })
  
  // Fetch the response from the Telegram API
  const response = await fetch(proxyRequest)
  
  // Return the response back to the client
  return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
  })
}
