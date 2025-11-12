// Try to non-fatally peek one SSE data event; returns null on timeout.
// Never throws; always cancels the reader if we started reading.
export async function tryPeekFirstSseData(
	res: Response,
	{ timeoutMs = 400, maxPreview = 512 } = {}
): Promise<string | null> {
	const [streamToRead, body] = res.body.tee()

	if (!body) return null

	const reader = body.getReader()
	const decoder = new TextDecoder()
	let buf = ""

	const text = await new Response(streamToRead).text()
	console.info({ text })

	// res = new Request(res, { body })

	const timeout = new Promise<null>((resolve) =>
		setTimeout(async () => {
			try {
				await reader.cancel()
			} catch {}
			try {
				reader.releaseLock()
			} catch {}
			resolve(null)
		}, timeoutMs)
	)

	const readOne = (async () => {
		try {
			const { value, done } = await reader.read()
			if (done || !value) return null
			buf += decoder.decode(value, { stream: true })

			const line = buf.split(/\r?\n/).find((l) => l.startsWith("data:"))

			if (!line) return null
			const payload = line.slice(5).trim()
			return payload.length > maxPreview
				? payload.slice(0, maxPreview)
				: payload
		} catch {
			// swallow "Stream was cancelled." and any benign read errors
			return null
		} finally {
			try {
				await reader.cancel()
			} catch {}
			try {
				reader.releaseLock()
			} catch {}
		}
	})()

	return Promise.race([readOne, timeout])
}
