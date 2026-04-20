# @dugalcedo/moose

A minimal toolkit for full-stack SvelteKit. Server-side request handling, reactive fetching, and form state — with Zod validation and end-to-end type inference.

```sh
npm i @dugalcedo/moose
```

Not a UI library. No CSS imposed. Svelte 5 only.

---

## `defineHandler` — server endpoints

Write endpoints without touching `Response` objects or `try/catch`. Return a value to respond. Throw to error.

```ts
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
})
```

Export inferred types for the frontend. No duplication, no drift.

```ts
export type MathInput  = typeof POST.inferInput
export type MathResult = typeof POST.inferOutput
```

Thrown errors are automatically caught and serialized:

| Thrown | Response |
|---|---|
| `ZodError` | 422 with structured `{ type: "zod", issues }` |
| Drizzle unique constraint violation | 409 with `{ message: "<column> is already taken" }` |
| Drizzle query error | 500 with `{ message: "Database query failed" }` |
| `Error` | 500 with `{ message }` |
| `[status, message]` | `status` with `{ message }` |
| number | derived status code |
| string | 500 with `{ message }` |

Drizzle errors are detected from the underlying driver (PostgreSQL, MySQL, SQLite) without any configuration. A JWT helper is also included.

---

## `request()` — reactive fetching

Reactive fetch with typed state. `isPending`, `data`, and `error` update automatically.

```svelte
<script lang="ts">
    import { request } from '@dugalcedo/moose'
    import type { MathResult } from './+server'

    const math = request<MathResult>('/api/math', { method: 'POST' })
</script>

<button onclick={() => math.send({ x: 4, y: 2, op: '+' })}>
    Calculate
</button>

{#if math.state.isPending}
    <p>Loading...</p>
{:else if math.state.isError}
    <p>Error: {math.state.error?.message}</p>
{:else if math.state.data}
    <p>Result: {math.state.data.result}</p>
{/if}
```

Use `startPolling(ms)` to poll on an interval. Use `sharedRequest()` at module level to share state across components.

---

## `defineForm()` — form state

Form state with Zod or custom validation. Server-side Zod errors automatically map back to field errors.

```svelte
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
</script>

<form onsubmit={form.handler}>
    <input type="number" bind:value={form.f.data.x} />
    <span>{form.f.errors.x?.[0]}</span>

    <input type="number" bind:value={form.f.data.y} />
    <span>{form.f.errors.y?.[0]}</span>

    <button type="submit" disabled={form.request.isPending}>
        Calculate
    </button>
</form>
```

Use a `prepare` function to transform form data before it's sent. Use `onBadRes` to handle error responses.

---

## `Field` / `FieldError` / `FieldHint` — form components

Optional, unstyled components that wire up IDs and aria attributes automatically. No CSS is included or imposed.

```svelte
<script lang="ts">
    import { Field, FieldError, FieldHint } from '@dugalcedo/moose'
</script>

<Field
    label="Email"
    error={form.f.errors.email}
    hint="We won't share your address."
>
    <input type="email" bind:value={form.f.data.email} />
    <FieldError />
    <FieldHint />
</Field>
```

`FieldError` and `FieldHint` are optional — handle errors and hints however you like. You don't have to use `Field` at all.
