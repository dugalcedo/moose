<svelte:head><title>Moose — Overview</title></svelte:head>

<h1>Overview</h1>
<p>Moose is a minimal toolkit for full-stack SvelteKit. It handles the boilerplate around server endpoints, reactive fetching, and form state so you can focus on the logic.</p>

<h2>Install</h2>
<pre><code>npm i @dugalcedo/moose</code></pre>

<h2>What's included</h2>

<table>
    <thead>
        <tr><th>Export</th><th>From</th><th>What it does</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><code>defineHandler</code></td>
            <td><code>@dugalcedo/moose/server</code></td>
            <td>Wrap SvelteKit request handlers. Return to respond, throw to error.</td>
        </tr>
        <tr>
            <td><code>defineJwt</code></td>
            <td><code>@dugalcedo/moose/server</code></td>
            <td>Create a typed JWT helper with sign, verify, and decode.</td>
        </tr>
        <tr>
            <td><code>request</code></td>
            <td><code>@dugalcedo/moose</code></td>
            <td>Reactive fetch with typed state: isPending, data, error.</td>
        </tr>
        <tr>
            <td><code>sharedRequest</code></td>
            <td><code>@dugalcedo/moose</code></td>
            <td>Like <code>request()</code>, but deduplicated and shareable across components.</td>
        </tr>
        <tr>
            <td><code>defineForm</code></td>
            <td><code>@dugalcedo/moose</code></td>
            <td>Form state with validation, field errors, and typed callbacks.</td>
        </tr>
        <tr>
            <td><code>Field</code></td>
            <td><code>@dugalcedo/moose</code></td>
            <td>Unstyled wrapper that auto-assigns IDs and aria attributes.</td>
        </tr>
        <tr>
            <td><code>FieldError</code></td>
            <td><code>@dugalcedo/moose</code></td>
            <td>Renders field errors from the nearest Field's context.</td>
        </tr>
        <tr>
            <td><code>FieldHint</code></td>
            <td><code>@dugalcedo/moose</code></td>
            <td>Renders a hint from the nearest Field's context.</td>
        </tr>
    </tbody>
</table>

<h2>How the pieces fit together</h2>

<p>The typical flow from server to client:</p>

<ol>
    <li>Define an endpoint with <code>defineHandler</code> and export inferred types from it.</li>
    <li>Use those types with <code>request()</code> or <code>defineForm()</code> on the frontend — no schema duplication.</li>
    <li>Optionally use <code>Field</code>, <code>FieldError</code>, and <code>FieldHint</code> to wire up form accessibility automatically.</li>
</ol>

<p>Zod validation errors thrown server-side are automatically formatted and, when using <code>defineForm()</code>, automatically mapped back to the correct form field errors on the client.</p>

<h2>Svelte version</h2>
<p>Moose requires Svelte 5. It uses runes (<code>$state</code>, <code>$derived</code>, <code>$effect</code>) internally.</p>
