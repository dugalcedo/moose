
<script lang="ts">
    function esc(s: string): string {
        return s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
    }

    const codeDefineHandlerServer = `\
// src/routes/api/math/+server.ts
import { defineHandler } from '@dugalcedo/moose/server'
import { z } from 'zod'

export const GET = defineHandler({
    handler: async () => {
        return { json: { number: Math.floor(Math.random() * 100) } }
    }
})

export const POST = defineHandler({
    body: z.object({
        x: z.number(),
        y: z.number(),
        op: z.enum(['+', '-'])
    }),
    handler: async (evt) => {
        const { x, y, op } = evt.body
        return { json: { result: op === '+' ? x + y : x - y } }
    }
})`

    const codeDefineHandlerTypes = `\
// Export inferred types — no duplication, no drift
export type MathInput  = typeof POST.inferInput
export type MathResult = typeof POST.inferOutput`

    const codeRequest = `\
<script lang="ts">
    import { request } from '@dugalcedo/moose'
    import type { MathResult } from './+server'

    const math = request<MathResult>('/api/math', { method: 'POST' })
<\/script>

<button onclick={() => math.send({ x: 4, y: 2, op: '+' })}>
    Calculate
</button>

{#if math.state.isPending}
    <p>Loading...</p>
{:else if math.state.isError}
    <p>Error: {math.state.error?.message}</p>
{:else if math.state.data}
    <p>Result: {math.state.data.result}</p>
{/if}`

    const codeDefineForm = `\
<script lang="ts">
    import { defineForm } from '@dugalcedo/moose'
    import type { MathInput, MathResult } from './+server'
    import { z } from 'zod'

    const form = defineForm<MathInput, MathResult>({
        url: '/api/math',
        initialFormData: { x: 0, y: 0, op: '+' },
        validate: z.object({
            x: z.number(),
            y: z.number(),
            op: z.enum(['+', '-'])
        }),
        onGoodRes: (data) => {
            alert('Result: ' + data.result)
        }
    })
<\/script>

<form onsubmit={form.handler}>
    <input type="number" bind:value={form.f.data.x} />
    <span>{form.f.errors.x?.[0]}</span>

    <input type="number" bind:value={form.f.data.y} />
    <span>{form.f.errors.y?.[0]}</span>

    <button type="submit" disabled={form.request.isPending}>
        Calculate
    </button>
</form>`

    const codeField = `\
<script lang="ts">
    import { Field, FieldError, FieldHint } from '@dugalcedo/moose'
<\/script>

<Field
    label="Email"
    error={form.f.errors.email}
    hint="We won't share your address."
>
    <input type="email" bind:value={form.f.data.email} />
    <FieldError />
    <FieldHint />
</Field>`
</script>

<div class="landing">

    <!-- 1. HERO -->
    <section class="hero">
        <h1>
            Moose
            <small style="font-size:0.3em">v0.1.1</small>
        </h1>
        <p>A minimal toolkit for full-stack SvelteKit. Server-side request handling, reactive fetching, and form state management — with Zod validation and end-to-end type inference.</p>
        <pre class="install"><code>npm i @dugalcedo/moose</code></pre>
        <div class="pills">
            <span>Minimal</span>
            <span>Flexible</span>
            <span>Unopinionated</span>
            <span>Not a UI library</span>
        </div>
    </section>

    <!-- 2. defineHandler -->
    <section>
        <h2><code>defineHandler</code></h2>
        <p>The core of Moose. Write endpoints without touching <code>Response</code> objects or <code>try/catch</code>. Return a value to respond. Throw to error.</p>
        <pre><code>{@html esc(codeDefineHandlerServer)}</code></pre>
        <p>Attach inferred types to your exports. Use them on the frontend without duplicating your schema.</p>
        <pre><code>{@html esc(codeDefineHandlerTypes)}</code></pre>
        <p>Thrown <code>ZodError</code>s are automatically serialized and returned as error responses. A JWT helper is also included.</p>
    </section>

    <!-- 3. request() -->
    <section>
        <h2><code>request()</code></h2>
        <p>Reactive fetch with typed state. Works like fetch utilities you may already be familiar with — <code>isPending</code>, <code>data</code>, and <code>error</code> update automatically.</p>
        <pre><code>{@html esc(codeRequest)}</code></pre>
        <p>Use <code>startPolling(ms)</code> to poll on an interval. Use <code>sharedRequest()</code> at module level to share state across components.</p>
    </section>

    <!-- 4. defineForm() -->
    <section>
        <h2><code>defineForm()</code></h2>
        <p>Form state with Zod or custom validation. Use <code>prepare</code> to transform values before sending. Server-side Zod errors automatically map back to field errors.</p>
        <pre><code>{@html esc(codeDefineForm)}</code></pre>
        <p>Use <code>onGoodRes</code> and <code>onBadRes</code> callbacks to handle the response.</p>
    </section>

    <!-- 5. Field / FieldError / FieldHint -->
    <section>
        <h2><code>Field</code> / <code>FieldError</code> / <code>FieldHint</code></h2>
        <p>Optional, unstyled components that wire up IDs and aria attributes automatically. No CSS is included or imposed.</p>
        <pre><code>{@html esc(codeField)}</code></pre>
        <p><code>FieldError</code> and <code>FieldHint</code> are optional — handle errors and hints however you like. You don't have to use <code>Field</code> at all.</p>
    </section>

    <!-- 6. Install + links -->
    <section class="footer-cta">
        <pre class="install"><code>npm i @dugalcedo/moose</code></pre>
        <a href="/docs">Full docs →</a>
    </section>

</div>

<style>
    .landing {
        max-width: 760px;
        margin: 0 auto;
        padding: 2rem 1rem 4rem;
        font-family: system-ui, sans-serif;
        line-height: 1.6;
        color: #1a1a1a;
    }

    section {
        margin-bottom: 4rem;
    }

    h1 {
        font-size: 3rem;
        margin: 0 0 0.5rem;
    }

    h2 {
        font-size: 1.5rem;
        margin: 0 0 0.5rem;
    }

    p {
        margin: 0.5rem 0;
        max-width: 65ch;
    }

    pre {
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 1rem;
        overflow-x: auto;
        margin: 0.75rem 0;
        font-size: 0.875rem;
        line-height: 1.5;
    }

    code {
        font-family: ui-monospace, monospace;
    }

    pre.install {
        display: inline-block;
        padding: 0.4rem 1rem;
        margin: 0.75rem 0;
    }

    .hero p {
        font-size: 1.1rem;
        margin-bottom: 1rem;
    }

    .pills {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-top: 1rem;
    }

    .pills span {
        background: #efefef;
        border: 1px solid #ccc;
        border-radius: 999px;
        padding: 0.2rem 0.75rem;
        font-size: 0.85rem;
    }

    .footer-cta {
        border-top: 1px solid #ddd;
        padding-top: 2rem;
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .footer-cta pre {
        margin: 0;
    }

    .footer-cta a {
        font-size: 1rem;
        color: #1a1a1a;
    }
</style>
