<script lang="ts">
    import { page } from "$app/state";
    import type { Snippet } from "svelte";

    const {
        children
    }: {
        children: Snippet
    } = $props()
</script>

{#if page.route.id === "/"}
<!-- LANDING PAGE -->
    <main>
        {@render children()}
    </main>
{:else}
<!-- DOCS -->
    <aside>
    </aside>
    <main>
        {@render children()}
    </main>
{/if}
