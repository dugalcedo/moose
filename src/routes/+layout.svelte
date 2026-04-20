<script lang="ts">
    import { page } from "$app/state";
    import type { Snippet } from "svelte";

    const {
        children
    }: {
        children: Snippet
    } = $props()

    const nav = [
        {
            section: null,
            items: [{ href: '/docs', label: 'Overview' }]
        },
        {
            section: 'Server',
            items: [
                { href: '/docs/define-handler', label: 'defineHandler' },
                { href: '/docs/define-jwt', label: 'defineJwt' },
            ]
        },
        {
            section: 'Client',
            items: [
                { href: '/docs/request', label: 'request()' },
                { href: '/docs/define-form', label: 'defineForm()' },
                { href: '/docs/field', label: 'Field components' },
            ]
        },
    ]
</script>

{#if page.route.id === "/"}
<!-- LANDING PAGE -->
    <main>
        {@render children()}
    </main>
{:else}
<!-- DOCS -->
    <div class="docs-wrap">
        <nav class="docs-nav">
            <a class="docs-home" href="/">Moose</a>
            {#each nav as group}
                {#if group.section}
                    <p class="nav-section">{group.section}</p>
                {/if}
                {#each group.items as item}
                    <a
                        href={item.href}
                        class="nav-link"
                        class:active={page.url.pathname === item.href}
                    >{item.label}</a>
                {/each}
            {/each}
        </nav>
        <main class="docs-main">
            {@render children()}
        </main>
    </div>
{/if}

<style>
    .docs-wrap {
        display: flex;
        min-height: 100vh;
        font-family: system-ui, sans-serif;
        color: #1a1a1a;
    }

    .docs-nav {
        width: 210px;
        flex-shrink: 0;
        padding: 1.5rem 1rem;
        border-right: 1px solid #ddd;
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
        position: sticky;
        top: 0;
        height: 100vh;
        overflow-y: auto;
        box-sizing: border-box;
    }

    .docs-home {
        font-weight: bold;
        font-size: 1.1rem;
        text-decoration: none;
        color: #1a1a1a;
        margin-bottom: 1rem;
        display: block;
    }

    .nav-section {
        margin: 1rem 0 0.25rem;
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #999;
        padding: 0 0.5rem;
    }

    .nav-link {
        display: block;
        padding: 0.25rem 0.5rem;
        text-decoration: none;
        color: #333;
        border-radius: 3px;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .nav-link:hover {
        background: #f0f0f0;
    }

    .nav-link.active {
        font-weight: 600;
        background: #ebebeb;
    }

    .docs-main {
        flex: 1;
        padding: 2.5rem 2rem;
        max-width: 760px;
        line-height: 1.65;
        box-sizing: border-box;
    }

    :global(.docs-main h1) {
        font-size: 2rem;
        margin: 0 0 0.5rem;
    }

    :global(.docs-main h2) {
        font-size: 1.25rem;
        margin: 2rem 0 0.4rem;
        padding-top: 2rem;
        border-top: 1px solid #eee;
    }

    :global(.docs-main h2:first-of-type) {
        border-top: none;
        padding-top: 0;
    }

    :global(.docs-main h3) {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #888;
        margin: 1.5rem 0 0.3rem;
    }

    :global(.docs-main p) {
        margin: 0.4rem 0;
        max-width: 65ch;
    }

    :global(.docs-main ul, .docs-main ol) {
        padding-left: 1.5rem;
        margin: 0.5rem 0;
    }

    :global(.docs-main li) {
        margin: 0.2rem 0;
    }

    :global(.docs-main pre) {
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 1rem;
        overflow-x: auto;
        margin: 0.6rem 0 1rem;
        font-size: 0.875rem;
        line-height: 1.5;
    }

    :global(.docs-main code) {
        font-family: ui-monospace, monospace;
    }

    :global(.docs-main :not(pre) > code) {
        background: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 3px;
        padding: 0.1em 0.35em;
        font-size: 0.875em;
    }

    :global(.docs-main table) {
        border-collapse: collapse;
        width: 100%;
        margin: 0.75rem 0 1rem;
        font-size: 0.9rem;
    }

    :global(.docs-main th, .docs-main td) {
        text-align: left;
        padding: 0.4rem 0.75rem;
        border: 1px solid #ddd;
    }

    :global(.docs-main th) {
        background: #f5f5f5;
        font-weight: 600;
    }

    :global(.docs-main .note) {
        background: #f9f9e8;
        border: 1px solid #e0e0a0;
        border-radius: 4px;
        padding: 0.6rem 0.9rem;
        font-size: 0.9rem;
        margin: 0.75rem 0;
    }
</style>
