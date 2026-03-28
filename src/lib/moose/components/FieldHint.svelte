<script lang="ts">
    import type { Snippet } from "svelte";
    import { getContext } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";
    const {
        ...spanProps
    }: HTMLAttributes<HTMLSpanElement> = $props()

    const ctx = getContext<{ hint: string | Snippet | undefined, hintId: string }>('m-field')
</script>

{#if ctx.hint}
    <span {...spanProps} class="m-form-hint {spanProps?.class}" id={ctx.hintId}>
        {#if typeof ctx.hint === 'string'}
            {ctx.hint}
        {:else}
            {@render ctx.hint()}
        {/if}
    </span>
{/if}
