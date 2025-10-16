import { renderToString } from "@remix-run/dom/server"
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from "react"

const Node = ({ resourceUrl }: { resourceUrl: string }) => {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="color-scheme" content="light dark" />
				<script src={resourceUrl} type="module" />
			</head>
			<body css={{ margin: 0 }}>
				<div id="💿" />
			</body>
		</html>
	)
}

export async function getResourceRenderToString(resourceUrl: string) {
	return await renderToString(<Node resourceUrl={resourceUrl} />)
}
