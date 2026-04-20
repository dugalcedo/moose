<script lang="ts">
    import { esc } from '../../esc.ts'

    const codeImport = `import { defineJwt } from '@dugalcedo/moose/server'`

    const codeSignature = `defineJwt<PayloadType extends { [key: string]: Json }>(init)`

    const codeInit = `{
    secret: string               // required — signing secret

    signOptions?: SignOptions     // jsonwebtoken SignOptions (e.g. expiresIn)
    verifyOptions?: VerifyOptions // jsonwebtoken VerifyOptions

    // Optional validation hooks — run at the respective stage
    validateBeforeSign?: ZodType | ((payload, err) => void)
    validateAfterVerify?: ZodType | ((payload, err) => void)
    validateAfterDecode?: ZodType | ((payload, err) => void)
}`

    const codeReturned = `{
    sign:   (payload: PayloadType, signOptions?: SignOptions) => Promise<string>
    verify: (token: string, verifyOptions?: VerifyOptions)   => Promise<PayloadType>
    decode: (token: string)                                   => Promise<PayloadType>
}`

    const codeSetup = `// src/lib/server/auth.ts
import { defineJwt } from '@dugalcedo/moose/server'
import { z } from 'zod'
import { JWT_SECRET } from '$env/static/private'

export type SessionPayload = { userId: string; role: 'user' | 'admin' }

export const auth = defineJwt<SessionPayload>({
    secret: JWT_SECRET,
    signOptions: { expiresIn: '7d' },
    validateAfterVerify: z.object({
        userId: z.string(),
        role: z.enum(['user', 'admin'])
    })
})`

    const codeUsage = `import { defineHandler } from '@dugalcedo/moose/server'
import { auth } from '$lib/server/auth'

// Sign a token (e.g. on login)
export const POST = defineHandler({
    handler: async (ctx) => {
        // ... validate credentials ...
        const token = await auth.sign({ userId: 'abc123', role: 'user' })
        ctx.cookies.set('session', token, { path: '/', httpOnly: true })
        return { json: { ok: true } }
    }
})

// Verify a token (e.g. on protected endpoints)
export const GET = defineHandler({
    handler: async (ctx) => {
        const token = ctx.cookies.get('session') ?? ''
        const payload = await auth.verify(token)
        // payload is SessionPayload — throws 401 if invalid/expired
        return { json: { userId: payload.userId } }
    }
})`

    const codeVerifyError = `// verify() throws on failure — integrates directly with defineHandler's error handling:
// { status: 401, json: { message: 'you have been logged out' } }
//
// Thrown on:
//   - invalid signature
//   - expired token (TokenExpiredError)
//   - payload failed validateAfterVerify
//
// decode() does NOT check the signature — only use it when you've already
// verified the token and just need to read the payload without re-verifying.`
</script>

<svelte:head><title>Moose — defineJwt</title></svelte:head>

<h1><code>defineJwt</code></h1>
<p>Creates a typed JWT helper with sign, verify, and decode methods. Built on <code>jsonwebtoken</code>. Integrates with <code>defineHandler</code>'s error handling — <code>verify()</code> throws a <code>401</code> response on failure.</p>

<h2>Import</h2>
<pre><code>{@html esc(codeImport)}</code></pre>

<h2>Signature</h2>
<pre><code>{@html esc(codeSignature)}</code></pre>
<p><code>PayloadType</code> must be a plain JSON object type. It types the <code>sign()</code> argument and the return value of <code>verify()</code> and <code>decode()</code>.</p>

<h2>Init options</h2>
<pre><code>{@html esc(codeInit)}</code></pre>

<h2>Returned object</h2>
<pre><code>{@html esc(codeReturned)}</code></pre>

<h2>Setup</h2>
<p>Create one instance per token type and export it from a server-only module.</p>
<pre><code>{@html esc(codeSetup)}</code></pre>

<h2>Usage in handlers</h2>
<pre><code>{@html esc(codeUsage)}</code></pre>

<h2>Error behavior</h2>
<pre><code>{@html esc(codeVerifyError)}</code></pre>
<p class="note"><code>sign()</code> throws <code>&#123; status: 500 &#125;</code> on signing failure, but this should be rare in practice.</p>
