import type { Middleware } from "@remix-run/fetch-router"

export interface streamLoggerOptions {
	/**
	 * The function to use to log messages. Defaults to `console.log`.
	 */
	log?: (message: string | object) => void
	corrolationId?: string | number
}

/*
const tokens: Record<string, () => string> = {
			corrolationId: () => corrolationId.toString(),
			date: () => formatApacheDate(start),
			dateISO: () => start.toISOString(),
			duration: () => String(end.getTime() - start.getTime()),
			contentLength: () => response.headers.get("Content-Length") ?? "-",
			contentType: () => response.headers.get("Content-Type") ?? "-",
			host: () => url.host,
			hostname: () => url.hostname,
			method: () => request.method,
			path: () => url.pathname + url.search,
			pathname: () => url.pathname,
			port: () => url.port,
			protocol: () => url.protocol,
			query: () => url.search,
			referer: () => request.headers.get("Referer") ?? "-",
			search: () => url.search,
			status: () => String(response.status),
			statusText: () => response.statusText,
			url: () => url.href,
			userAgent: () => request.headers.get("User-Agent") ?? "-",
		}
*/

const streamToText = async (
	readableStream: ReadableStream<Uint8Array>
): Promise<string> => {
	return await new Response(readableStream).text()
}

export function streamLogger({
	log = console.log,
	corrolationId = crypto.randomUUID(),
}: streamLoggerOptions = {}): Middleware {
	return async (ctx) => {
		const { request, url } = ctx
		if (!request.body) return

		const [streamToRead, stream] = request.body.tee()
		const body = await streamToText(streamToRead)

		// hand second stream to downstream middleware
		ctx.request = new Request(request, { body: stream })

		log({
			corrolationId,
			url: url.toString(),
			headers: Object.fromEntries(request.headers),
			body,
			request,
		})
	}
}
