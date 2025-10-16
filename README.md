# Purpledreams MCP Server on a Cloudflare worker

> Purpledreams.io's mcp server. WIP with many things coming. This will have some experimental libs and utils.

Taking inspiration from [Kent C. Dodds](https://github.com/kentcdodds/cloudflare-remix-vite-mcp)
These are a few key point reminders for myslef below but for more details take a look at the README from the project above.

> Note key distinction about the architecture is:
> - worker lives the cloudflare worker (server-side) and widgets live in a browser context.
> - The different tsconfigs for each directory enforce this along with the build.

### Architecture Overview
This mcp app implements widgets as MCP tools that can be used by AI assistants. The architecture consts of several key components:

1. **MCP Server** - A Cloudflare Durable Object that implements the Model
   Context Protocol
2. **Widget System** - Interactive UI components built with Remix 3 that can be
   embedded in AI chats
3. **Two-way Communication** - Widgets can both receive initial state from the
   AI and send messages back
4. **Static Assets** - Widget bundles served from Cloudflare's CDN

#### Initial State Configuration

When an AI assistant invokes the calculator tool, it can pass initial state
parameters:

- `display` - The initial display value
- `previousValue` - A value already entered (e.g., "I want to add 5 to a
  number")
- `operation` - The pending operation (+, -, \*, /)
- `waitingForNewValue` - Whether the calculator is ready for new input
- `errorState` - Whether to start in an error state

This means the AI can pre-configure the calculator based on the user's request.
For example, if a user says "I want to add 5 to something," the AI can invoke
the calculator with `previousValue: 5`, `operation: '+'`, and
`waitingForNewValue: true`.

#### Separate Build Process

The project uses two separate build processes:

1. **Widget Build** (Vite) - Builds the calculator UI into standalone JavaScript
   bundles
   - Input: `worker/widgets/calculator/index.tsx`
   - Output: `dist/public/widgets/calculator.js`
   - Format: ES modules with all dependencies bundled

2. **Worker Build** (Wrangler) - Builds the Cloudflare Worker with MCP server
   - Input: `worker/index.tsx`
   - Output: Worker bundle deployed to Cloudflare
   - Includes: MCP protocol handlers, tool registration, widget serving

### Deployment

1. **Build for Production**

   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare**

   ```bash
   npm run deploy
   ```

3. **Use with ChatGPT**

   Once deployed, you can add this MCP server to ChatGPT by providing the
   deployment URL + `/mcp` endpoint.