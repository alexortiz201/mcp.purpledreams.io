import type { Middleware, RequestContext } from "@remix-run/fetch-router"

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

// export function streamLogger({
// 	log = console.info,
// 	corrolationId = crypto.randomUUID(),
// }: loggerOptions = {}): Middleware {
// 	return async (ctx) => logStream({ ctx, log, corrolationId })
// }

type StreamLike = {
	headers: Headers
	body: ReadableStream<Uint8Array>
}
export function isStream(opts: {
	headers: Headers
	body: any
}): opts is StreamLike {
	const contentType = opts.headers.get("content-type") ?? ""
	return /text\/event-stream/i.test(contentType)
}

type loggerOptions = {
	log?: (message: string | object) => void
	corrolationId?: string | number
}

type logExchangeOptions = {
	log: (message: string | object) => void
	corrolationId: string | number
	exchange: Response | Request
	ctx?: RequestContext
}

export const streamToText = async (
	readableStream: ReadableStream<Uint8Array>
): Promise<string> => {
	return await new Response(readableStream).text()
}

type LogResult =
	| { isSse: true; bodyText: null; response: Response }
	| { isSse: false; bodyText: string; response: Response }

type handleParams = logExchangeOptions & {
	stream: ReadableStream<Uint8Array>
	ctx?: RequestContext
}

const handleSse = ({
	exchange,
	log,
	corrolationId,
	stream,
	ctx,
}: handleParams): LogResult => {
	log({
		isSse: true,
		corrolationId,
		url: "url" in exchange ? exchange.url?.toString() : "",
		headers: Object.fromEntries(new Headers(exchange.headers)),
		body: "[SSE stream]",
	})

	if (exchange instanceof Response) {
		return {
			isSse: true,
			bodyText: null,
			response: new Response(stream, exchange),
		}
	}

	// For requests: replace ctx.request so downstream still sees a body
	if (exchange instanceof Request && ctx)
		ctx.request = new Request(exchange, { body: stream })

	return { isSse: true, bodyText: null, response: new Response(null) }
}

const handleNonSse = async ({
	exchange,
	log,
	corrolationId,
	stream,
	streamToRead,
	ctx,
}: handleParams & {
	streamToRead: ReadableStream<Uint8Array>
}): Promise<LogResult> => {
	const bodyText = await streamToText(streamToRead)

	log({
		isSse: false,
		corrolationId,
		url: exchange.url.toString(),
		headers: Object.fromEntries(new Headers(exchange.headers)),
		body: bodyText,
	})

	// For responses: rebuild with the forward stream so upstream can still read it
	if (exchange instanceof Response) {
		return { isSse: false, bodyText, response: new Response(stream, exchange) }
	}

	// For requests: hand the forward stream to downstream
	if (exchange instanceof Request && ctx)
		ctx.request = new Request(exchange, { body: stream })

	// For request branch we return a dummy Response just to satisfy return type;
	// the important part is we replaced ctx.request.
	return { isSse: false, bodyText, response: new Response(null) }
}

async function logExchange({
	log,
	corrolationId,
	exchange,
	ctx,
}: logExchangeOptions): Promise<LogResult> {
	if (!exchange.body) {
		if (exchange instanceof Response) {
			return { isSse: false, bodyText: "", response: exchange }
		}
		return { isSse: false, bodyText: "", response: new Response(null) }
	}

	const [stream, streamToRead] = exchange.body.tee()
	// console.info({ t: "HERE" })
	const isSse = isStream(exchange)

	if (isSse) return handleSse({ exchange, log, corrolationId, stream, ctx })

	return await handleNonSse({
		exchange,
		log,
		corrolationId,
		stream,
		streamToRead,
		ctx,
	})
}

export function exchangeLoggerMiddleware({
	log = console.info,
	corrolationId = crypto.randomUUID(),
}: loggerOptions): Middleware {
	return async (ctx, next) => {
		const { request } = ctx

		log("@Request")
		await logExchange({ log, corrolationId, exchange: request, ctx })

		const res = await next()
		log("@Response")
		const { response } = await logExchange({
			log,
			corrolationId,
			exchange: res,
		})

		return response ?? res
	}
}
