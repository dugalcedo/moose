<script lang="ts">
    import { getContext } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";

    const {
        parentAttributes = {},
        childAttributes = {}
    } : {
        parentAttributes?: HTMLAttributes<HTMLSpanElement>
        childAttributes?: HTMLAttributes<HTMLSpanElement>
    } = $props()

    const ctx = getContext<{ errors: string[] | undefined, errorId: string }>('m-field')
</script>

{#if ctx.errors?.length}
    <span {...parentAttributes} class="m-form-errors {parentAttributes.class}" id={ctx.errorId}>
        {#each ctx.errors as msg}
            <span {...childAttributes} class="m-form-error {childAttributes.class}">{msg}</span>
        {/each}
    </span>
{/if}
