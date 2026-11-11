
import handler, { createServerEntry } from '@tanstack/react-start/server-entry'

export default createServerEntry({
  async fetch(request, opts) {
    const url = new URL(request.url)

    if (url.hostname === 'boncote.bousbtp.workers.dev') {
      url.hostname = 'bon-cote.fr'
      url.protocol = 'https:'
      return Response.redirect(url.toString(), 308)
    }

    try {
      return await handler.fetch(request, opts)
    } catch (error) {
      console.error('BONCOTE_WORKER_EXCEPTION:', error)

      return new Response(
        'BONCOTE server error. Check Cloudflare Worker logs.',
        {
          status: 500,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
          },
        },
      )
    }
  },
})
