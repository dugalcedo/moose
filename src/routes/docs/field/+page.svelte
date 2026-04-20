<script lang="ts">
    import { esc } from '../../esc.ts'

    const codeImport = `import { Field, FieldError, FieldHint } from '@dugalcedo/moose'`

    const codeExample = `<Field label="Password" error={form.f.errors.password} hint="At least 8 characters.">
    <input type="password" bind:value={form.f.data.password} />
    <FieldError />
    <FieldHint />
</Field>`

    const codeRendered = `<div class="m-field">
    <label class="m-label" for="m-id-3">Password</label>
    <input
        type="password"
        id="m-id-3"
        aria-describedby="m-id-3-error m-id-3-hint"
        aria-invalid="true"
    />
    <span class="m-form-errors" id="m-id-3-error">
        <span class="m-form-error">Must be at least 8 characters</span>
    </span>
    <span class="m-form-hint" id="m-id-3-hint">At least 8 characters.</span>
</div>`

    const codeFieldProps = `{
    children: Snippet           // required — the input element goes here

    label?: string | Snippet    // rendered as a <label for={id}>
    error?: string[]            // passed to FieldError via context
    hint?: string | Snippet     // passed to FieldHint via context

    labelLast?: boolean         // render label after children (default: false)
    inputId?: string            // override the auto-generated id
    autoId?: boolean            // auto-assign id + aria attrs (default: true)

    labelAttributes?: HTMLLabelAttributes
    fieldAttributes?: HTMLAttributes<HTMLDivElement>
}`

    const codeFieldErrorProps = `{
    parentAttributes?: HTMLAttributes<HTMLSpanElement>   // the .m-form-errors wrapper
    childAttributes?: HTMLAttributes<HTMLSpanElement>    // each .m-form-error span
}`

    const codeSnippetLabel = `<Field error={form.f.errors.name}>
    {#snippet label()}
        Name <span class="required">*</span>
    {/snippet}
    <input bind:value={form.f.data.name} />
    <FieldError />
</Field>`

    const codeNoComponents = `<!-- You don't have to use Field at all. -->
<label for="email">Email</label>
<input id="email" bind:value={form.f.data.email} />
{#each form.f.errors.email ?? [] as msg}
    <span>{msg}</span>
{/each}`

    const codeContext = `import { getContext } from 'svelte'
import type { Snippet } from 'svelte'

const ctx = getContext<{
    id: string
    errorId: string
    hintId: string
    errors: string[] | undefined
    hint: string | Snippet | undefined
}>('m-field')`
</script>

<svelte:head><title>Moose — Field components</title></svelte:head>

<h1>Field components</h1>
<p>Optional, unstyled components for building accessible form fields. No CSS is included or imposed.</p>

<h2>Import</h2>
<pre><code>{@html esc(codeImport)}</code></pre>

<h2>Example</h2>
<pre><code>{@html esc(codeExample)}</code></pre>
<p>With <code>autoId</code> enabled (the default), Field assigns a unique <code>id</code> to the first <code>input</code>, <code>select</code>, or <code>textarea</code> inside it, then sets <code>aria-describedby</code> and <code>aria-invalid</code> accordingly.</p>

<h3>Rendered output</h3>
<pre><code>{@html esc(codeRendered)}</code></pre>

<h2>Field props</h2>
<pre><code>{@html esc(codeFieldProps)}</code></pre>

<h2>FieldError props</h2>
<p>Only renders when there are errors. Each error message gets its own <code>&lt;span class="m-form-error"&gt;</code>.</p>
<pre><code>{@html esc(codeFieldErrorProps)}</code></pre>

<h2>FieldHint props</h2>
<p>Only renders when <code>hint</code> is truthy. Accepts any <code>&lt;span&gt;</code> attributes spread directly onto it.</p>

<h2>CSS classes</h2>
<table>
    <thead>
        <tr><th>Class</th><th>Element</th></tr>
    </thead>
    <tbody>
        <tr><td><code>.m-field</code></td><td>The Field wrapper <code>&lt;div&gt;</code></td></tr>
        <tr><td><code>.m-label</code></td><td>The <code>&lt;label&gt;</code></td></tr>
        <tr><td><code>.m-form-errors</code></td><td>FieldError wrapper <code>&lt;span&gt;</code></td></tr>
        <tr><td><code>.m-form-error</code></td><td>Each individual error <code>&lt;span&gt;</code></td></tr>
        <tr><td><code>.m-form-hint</code></td><td>The FieldHint <code>&lt;span&gt;</code></td></tr>
    </tbody>
</table>

<h2>Snippet labels</h2>
<p>Pass a Svelte snippet to <code>label</code> for richer label content.</p>
<pre><code>{@html esc(codeSnippetLabel)}</code></pre>

<h2>Skipping Field entirely</h2>
<p><code>FieldError</code> and <code>FieldHint</code> read from Field's context — they only work inside a <code>Field</code>. But you're not required to use any of these components.</p>
<pre><code>{@html esc(codeNoComponents)}</code></pre>

<h2>Context API</h2>
<p>Field sets a Svelte context under the key <code>'m-field'</code>. Read it to build your own custom error/hint components.</p>
<pre><code>{@html esc(codeContext)}</code></pre>
