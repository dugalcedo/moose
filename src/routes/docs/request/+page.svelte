<script lang="ts">
    import { esc } from '../../esc.ts'

    const codeImport = `import { request, sharedRequest } from '@dugalcedo/moose'`

    const codeBasic = `<script lang="ts">
    import { request } from '@dugalcedo/moose'
    import type { MathResult } from '../api/math/+server'

    const math = request<MathResult>('/api/math', { method: 'POST' })
<\/script>

<button onclick={() => math.send({ x: 4, y: 2, op: '+' })}>
    Calculate
</button>

{#if math.state.isPending}
    <p>Loading...</p>
{:else if math.state.isError}
    <p>{math.state.error?.message}</p>
{:else if math.state.data}
    <p>Result: {math.state.data.result}</p>
{/if}`

    const codeSignature = `request<T = any>(
    url: string | URL | Request,
    options?: RequestInit & {
        immediate?: boolean   // fire immediately on creation (default: false)
        poll?: number         // start polling at this interval in ms
    }
)`

    const codeState = `math.state.isPending   // boolean — true while a request is in flight
math.state.data        // T | null — parsed response body on success
math.state.error       // Error | null
math.state.isError     // boolean — derived from !!error
math.state.errorData   // any | null — parsed error response body
math.state.res         // Response | null — the raw Response object`

    const codeMethods = `// Fire a request. Cancels any in-flight request first.
math.send()                      // GET or body-less POST
math.send({ x: 4, y: 2 })       // POST with JSON body

// Reset all state (isPending, data, error, etc.)
math.reset()

// Abort any in-flight request
math.cancel()`

    const codePolling = `// Option 1: configure at creation
const status = request<Status>('/api/status', { poll: 5000 })

// Option 2: start/stop manually
status.startPolling(3000)   // polls every 3s
status.stopPolling()

// Option 3: immediate + poll
const live = request<Feed>('/api/feed', { immediate: true, poll: 10000 })`

    const codeShared = `// stores.svelte.ts
import { sharedRequest } from '@dugalcedo/moose'
import type { User } from '../api/user/+server'

export const userReq = sharedRequest<User>('/api/user')

// ComponentA.svelte
import { userReq } from './stores.svelte.ts'
userReq.send()   // ignored if already pending

// ComponentB.svelte — same reactive state object
import { userReq } from './stores.svelte.ts'
const { state } = userReq   // isPending, data, error`
</script>

<svelte:head><title>Moose — request()</title></svelte:head>

<h1><code>request()</code></h1>
<p>Reactive fetch with typed state. Returns an object with <code>state</code>, <code>send()</code>, and control methods. Built on Svelte 5 runes — state updates reactively.</p>

<h2>Import</h2>
<pre><code>{@html esc(codeImport)}</code></pre>

<h2>Basic usage</h2>
<pre><code>{@html esc(codeBasic)}</code></pre>

<h2>Signature</h2>
<pre><code>{@html esc(codeSignature)}</code></pre>
<p>The generic <code>T</code> types <code>state.data</code>. Use the inferred output type from your handler for end-to-end type safety.</p>

<h2>State</h2>
<p>All properties on <code>state</code> are reactive.</p>
<pre><code>{@html esc(codeState)}</code></pre>

<h2>Methods</h2>
<pre><code>{@html esc(codeMethods)}</code></pre>
<p><code>send()</code> cancels any in-flight request before starting a new one, so concurrent calls are safe.</p>

<h2>Polling</h2>
<pre><code>{@html esc(codePolling)}</code></pre>
<p><code>startPolling(ms?)</code> uses the provided interval, or falls back to the <code>poll</code> option set at creation, or 5000ms.</p>

<h2><code>sharedRequest()</code></h2>
<p>Like <code>request()</code>, but intended to be called at module level and shared across components. Concurrent <code>send()</code> calls are deduplicated — if a request is already in flight, additional calls are ignored.</p>
<pre><code>{@html esc(codeShared)}</code></pre>
