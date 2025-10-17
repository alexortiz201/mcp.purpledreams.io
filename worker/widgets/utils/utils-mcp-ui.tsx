import { renderToString } from "@remix-run/dom/server"

export const getResourceUrl = (resourcePath: string, baseUrl: string) =>
	new URL(resourcePath, baseUrl).toString()

export async function getResourceRenderToString({
	resourcePath,
	baseUrl,
}: {
	resourcePath: string
	baseUrl: string
}): Promise<string> {
	return await renderToString(
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="color-scheme" content="light dark" />
				<script src={getResourceUrl(resourcePath, baseUrl)} type="module" />
			</head>
			<body css={{ margin: 0 }}>
				<div id="💿" />
			</body>
		</html>
	)
}
