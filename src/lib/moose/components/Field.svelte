<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLAttributes, HTMLLabelAttributes } from "svelte/elements";
    import { setContext } from "svelte";
    import { getNextN } from "../util.ts";

    const {
        children,
        label,
        labelAttributes = {},
        fieldAttributes = {},
        inputId,
        autoId = true,
        error,
        hint,
        labelLast
    }: {
        children: Snippet
        label?: string | Snippet
        labelAttributes?: HTMLLabelAttributes
        fieldAttributes?: HTMLAttributes<HTMLDivElement>
        inputId?: string
        autoId?: boolean
        error?: string[]
        hint?: string | Snippet
        labelLast?: boolean
    } = $props()

    const id = $derived(inputId || `m-id-${getNextN()}`);
    let fieldDiv: null | HTMLDivElement = $state(null)

    setContext('m-field', {
        get id() { return id },
        get errorId() { return `${id}-error` },
        get hintId() { return `${id}-hint` },
        get errors() { return error },
        get hint() { return hint },
    })

    $effect(() => {
        if (fieldDiv && autoId) {
            const input = fieldDiv.querySelector("input, select, textarea")
            if (input) {
                input.setAttribute("id", id)
                const describedBy = [
                    error?.length ? `${id}-error` : null,
                    hint ? `${id}-hint` : null,
                ].filter(Boolean).join(' ')
                if (describedBy) input.setAttribute("aria-describedby", describedBy)
                else input.removeAttribute("aria-describedby")
                if (error?.length) input.setAttribute("aria-invalid", "true")
                else input.removeAttribute("aria-invalid")
            }
        }
    })
</script>

<div 
    bind:this={fieldDiv} 
    class="m-field"
    {...fieldAttributes}
>
    {#if labelLast}
        {@render children()}
    {/if}
    {#if label}
        <label 
            class="m-label"
            {...labelAttributes} 
            for={id}
        >
            {#if typeof label === 'string'}
                {label}
            {:else}
                {@render label()}
            {/if}
        </label>
    {/if}
    {#if !labelLast}
        {@render children()}
    {/if}
</div>