
import handler, { createServerEntry } from '@tanstack/react-start/server-entry'

export default createServerEntry({
  fetch(request, opts) {
    const url = new URL(request.url)

    if (url.hostname === 'boncote.bousbtp.workers.dev') {
      url.hostname = 'bon-cote.fr'
      url.protocol = 'https:'
      return Response.redirect(url.toString(), 308)
    }

    return handler.fetch(request, opts)
  },
})
