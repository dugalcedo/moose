<script lang="ts">
    import { esc } from '../../esc.ts'

    const codeImport = `import { defineForm } from '@dugalcedo/moose'`

    const codeSignature = `defineForm<RequestBody, ResponseBody, FormData = RequestBody>(init)`

    const codeInit = `{
    url: string | URL | Request   // required
    initialFormData: FormData     // required — shape of your form fields

    validate?: ZodType<FormData>                             // zod schema
             | ((data: FormData, err: ErrFn) => void)       // custom validator

    prepare?: (data: FormData) => RequestBody                // transform before sending

    onGoodRes?: (data: ResponseBody, res: Response) => void
    onBadRes?: (error: Error, data: any, res: Response) => void

    options?: RequestInit   // extra fetch options (method, headers, etc.)
}`

    const codeReturned = `{
    f: {
        data: FormData                   // bind inputs here: bind:value={form.f.data.email}
        errors: Record<string, string[]> // field errors: form.f.errors.email
    },
    request: {
        isPending: boolean
        error: Error | null
        isError: boolean
        errorData: any | null
        resData: ResponseBody | null
    },
    handler: FormEventHandler<HTMLFormElement>   // use as: <form onsubmit={form.handler}>
}`

    const codeZod = `import { defineForm } from '@dugalcedo/moose'
import type { MathInput, MathResult } from '../api/math/+server'
import { z } from 'zod'

const form = defineForm<MathInput, MathResult>({
    url: '/api/math',
    initialFormData: { x: 0, y: 0, op: '+' },
    validate: z.object({
        x: z.number().min(0),
        y: z.number().min(0),
        op: z.enum(['+', '-'])
    }),
    onGoodRes: (data) => {
        alert('Result: ' + data.result)
    }
})`

    const codeCustom = `validate: (data, err) => {
    if (!data.email.includes('@')) {
        err('email', 'Must be a valid email address')
    }
    if (data.password.length < 8) {
        err('password', 'Must be at least 8 characters')
    }
}`

    const codePrepare = `// FormData has a string amount field (from <input type="number">)
// RequestBody expects amount: number

defineForm<RequestBody, ResponseBody, { amount: string }>({
    url: '/api/order',
    initialFormData: { amount: '' },
    prepare: (data) => ({
        amount: Number(data.amount)
    }),
    ...
})`

    const codeTemplate = `<form onsubmit={form.handler}>
    <label>
        X
        <input type="number" bind:value={form.f.data.x} />
        {#each form.f.errors.x ?? [] as msg}
            <span class="error">{msg}</span>
        {/each}
    </label>

    <label>
        Y
        <input type="number" bind:value={form.f.data.y} />
        {#each form.f.errors.y ?? [] as msg}
            <span class="error">{msg}</span>
        {/each}
    </label>

    <button type="submit" disabled={form.request.isPending}>
        {form.request.isPending ? 'Submitting...' : 'Submit'}
    </button>

    {#if form.request.isError}
        <p class="error">{form.request.error?.message}</p>
    {/if}
</form>`

    const codeServerErrors = `// Server throws a ZodError (or defineHandler body: schema fails) →
// { type: 'zod', issues: [{ path: ['email'], message: '...' }, ...] }
//
// defineForm maps these back to form.f.errors automatically.
// No extra client-side code needed.

export const POST = defineHandler({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8)
    }),
    handler: async (ctx) => {
        // If body parsing fails, a 422 with zod issues is returned.
        // Those issues appear in form.f.errors.email / form.f.errors.password.
        return { json: { ok: true } }
    }
})`
</script>

<svelte:head><title>Moose — defineForm()</title></svelte:head>

<h1><code>defineForm()</code></h1>
<p>Form state management with validation, field error tracking, and typed response callbacks. Server-side Zod errors automatically map back to the corresponding field errors.</p>

<h2>Import</h2>
<pre><code>{@html esc(codeImport)}</code></pre>

<h2>Signature</h2>
<pre><code>{@html esc(codeSignature)}</code></pre>
<p>The third generic (<code>FormData</code>) defaults to <code>RequestBody</code>. Use it when your form fields don't match the request body exactly — for example, when you need a <code>prepare</code> transform.</p>

<h2>Init options</h2>
<pre><code>{@html esc(codeInit)}</code></pre>

<h2>Returned object</h2>
<pre><code>{@html esc(codeReturned)}</code></pre>

<h2>Zod validation</h2>
<pre><code>{@html esc(codeZod)}</code></pre>
<p>Validation runs on submit. If there are errors, the request is not sent.</p>

<h2>Custom validation</h2>
<p>Pass a function instead of a Zod schema. Call <code>err(field, message)</code> to add errors.</p>
<pre><code>{@html esc(codeCustom)}</code></pre>

<h2><code>prepare</code></h2>
<p>Transform form data before it's JSON-serialized and sent. Useful when input types don't match the API's expected body.</p>
<pre><code>{@html esc(codePrepare)}</code></pre>

<h2>Template</h2>
<pre><code>{@html esc(codeTemplate)}</code></pre>

<h2>Server-side error mapping</h2>
<p>When the server returns a Zod error response (<code>&#123; type: 'zod', issues: [...] &#125;</code>), <code>defineForm</code> automatically maps the issues back to <code>form.f.errors</code> by field name.</p>
<pre><code>{@html esc(codeServerErrors)}</code></pre>
