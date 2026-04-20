<script lang="ts">
    import { esc } from '../../esc.ts'

    const codeImport = `import { defineHandler } from '@dugalcedo/moose/server'`

    const codeBasic = `export const GET = defineHandler({
    handler: async (ctx) => {
        return { json: { message: 'hello' } }
    }
})`

    const codeBody = `import { z } from 'zod'

export const POST = defineHandler({
    body: z.object({
        x: z.number(),
        y: z.number(),
        op: z.enum(['+', '-'])
    }),
    handler: async (ctx) => {
        const { x, y, op } = ctx.body
        return { json: { result: op === '+' ? x + y : x - y } }
    }
})`

    const codeReturnTypes = `// JSON (default)
return { json: { result: 42 } }
return { json: { result: 42 }, status: 201 }

// Plain text
return { type: 'text', text: 'pong' }
return { type: 'text', text: 'pong', status: 201 }

// Raw Response (bypass moose entirely)
return { type: 'custom', response: new Response('...', { status: 200 }) }`

    const codeThrow = `// String → 500  { message: '...' }
throw 'Something went wrong'

// Number → that status code
throw 404
throw 403

// Error instance → 500  { message: error.message }
throw new Error('Database unreachable')

// Object → use status, json, and/or statusText fields
throw { status: 403, json: { message: 'Forbidden' } }
throw { status: 422, json: { message: 'Bad input' }, statusText: 'Unprocessable' }

// Tuple [status, data]
throw [403, { message: 'Forbidden' }]
throw [403, 'Forbidden']   // → { message: 'Forbidden' }

// ZodError (from body parsing) → 422  { type: 'zod', issues: [...] }
// Thrown automatically when body: schema is provided and parsing fails`

    const codeTypes = `// +server.ts
export const POST = defineHandler({
    body: z.object({ x: z.number(), y: z.number() }),
    handler: async (ctx) => {
        return { json: { result: ctx.body.x + ctx.body.y } }
    }
})

export type MathInput  = typeof POST.inferInput   // { x: number, y: number }
export type MathResult = typeof POST.inferOutput  // { result: number }`

    const codeCtx = `export const GET = defineHandler({
    handler: async (ctx) => {
        // ctx is a SvelteKit RequestEvent — all standard fields available:
        const token = ctx.cookies.get('session')
        const userId = ctx.params.id
        const url = ctx.url
        const req = ctx.request

        return { json: { ok: true } }
    }
})`
</script>

<svelte:head><title>Moose — defineHandler</title></svelte:head>

<h1><code>defineHandler</code></h1>
<p>Wraps a SvelteKit request handler. Return a value to respond. Throw to error. No <code>Response</code> objects, no <code>try/catch</code>.</p>

<h2>Import</h2>
<pre><code>{@html esc(codeImport)}</code></pre>

<h2>Basic usage</h2>
<pre><code>{@html esc(codeBasic)}</code></pre>

<h2>Body validation</h2>
<p>Pass a Zod schema to <code>body</code>. The parsed, validated body is available as <code>ctx.body</code>. If parsing fails, a <code>422</code> response is returned automatically.</p>
<pre><code>{@html esc(codeBody)}</code></pre>

<h2>Handler context</h2>
<p><code>ctx</code> is a standard SvelteKit <code>RequestEvent</code> with <code>ctx.body</code> added when a <code>body</code> schema is provided.</p>
<pre><code>{@html esc(codeCtx)}</code></pre>

<h2>Return types</h2>
<p>Three response formats are supported. All accept an optional <code>status</code> field.</p>
<pre><code>{@html esc(codeReturnTypes)}</code></pre>

<h2>Throwing errors</h2>
<p>Anything thrown inside a handler is caught and converted to a response. The conversion rules:</p>
<pre><code>{@html esc(codeThrow)}</code></pre>

<p class="note">The <code>log</code> field on a thrown object is printed to the server console but never sent to the client.</p>

<h2>Type inference</h2>
<p>Use <code>inferInput</code> and <code>inferOutput</code> to extract types from a handler and share them with the frontend.</p>
<pre><code>{@html esc(codeTypes)}</code></pre>
<p><code>inferInput</code> is the Zod-inferred body type. <code>inferOutput</code> is the type of the <code>json</code> field in your return value. These properties exist only for type-level use — their runtime values are <code>null</code>.</p>
