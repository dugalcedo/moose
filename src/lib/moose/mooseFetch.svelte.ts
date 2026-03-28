import { parseBadRes, parseGoodRes } from "./util.ts"
import type { MooseFetchOptions } from "./types.ts"

export type MooseFetchState<T = any> = {
    isPending: boolean
    error: Error | null
    isError: boolean
    res: Response | null
    errorData: any | null
    data: T | null
}

export default function request<T = any>(
    url: string | URL | Request,
    options?: RequestInit & MooseFetchOptions
) {
    const state: MooseFetchState<T> = $state({
        isPending: options?.immediate ?? false,
        error: null,
        get isError() { return !!this.error },
        res: null,
        errorData: null,
        data: null,
    })

    let controller: AbortController | null = null
    let pollInterval: ReturnType<typeof setInterval> | null = null

    const reset = () => {
        state.error = null
        state.isPending = true
        state.res = null
        state.data = null
    }

    const cancel = () => {
        if (controller) {
            controller.abort()
            controller = null
        }
        state.isPending = false
    }

    const send = async (body?: Record<string, any>) => {
        // Cancel any in-flight request before starting a new one
        if (controller) controller.abort()

        reset()
        controller = new AbortController()

        const fetchOptions: RequestInit = { ...options, signal: controller.signal }

        if (body !== undefined) {
            fetchOptions.body = JSON.stringify(body)
            fetchOptions.headers = {
                'Content-Type': 'application/json',
                ...(options?.headers ?? {})
            }
        }

        // Get response
        let res: Response
        try {
            res = await fetch(url, fetchOptions)
        } catch (error) {
            if ((error as any)?.name === 'AbortError') return
            state.error = error as Error
            state.isPending = false
            controller = null
            return
        }

        controller = null
        state.res = res

        // Handle bad response
        if (!res.ok) {
            const [errorData, error] = await parseBadRes(res)
            state.error = error
            state.errorData = errorData
            state.isPending = false
            return
        }

        // Handle good response
        const result = await parseGoodRes<T>(res)
        if (typeof result === 'string') {
            state.error = new Error(`Invalid JSON: ${result}`)
            state.errorData = result
            state.isPending = false
            return
        }

        state.data = result
        state.isPending = false
    }

    const stopPolling = () => {
        if (pollInterval !== null) {
            clearInterval(pollInterval)
            pollInterval = null
        }
    }

    const startPolling = (ms?: number) => {
        stopPolling()
        const interval = ms ?? options?.poll ?? 5000
        pollInterval = setInterval(() => send(), interval)
    }

    // Fire immediately if requested
    if (options?.immediate) send()

    // Start polling if configured
    if (options?.poll) startPolling(options.poll)

    return { state, send, reset, cancel, startPolling, stopPolling }
}

/**
 * Like request(), but intended to be called at module level and shared across
 * components. Deduplicates concurrent send() calls — if a request is already
 * in flight, additional send() calls are ignored until it completes.
 *
 * Usage:
 *   // stores.svelte.ts
 *   export const userRequest = sharedRequest<User>("/api/user")
 *
 *   // ComponentA.svelte / ComponentB.svelte
 *   import { userRequest } from './stores.svelte.ts'
 *   const { state, send } = userRequest  // same reactive state
 */
export function sharedRequest<T = any>(
    url: string | URL | Request,
    options?: RequestInit & MooseFetchOptions
) {
    const req = request<T>(url, options)
    const baseSend = req.send

    req.send = async (body?: Record<string, any>) => {
        if (req.state.isPending) return
        return baseSend(body)
    }

    return req
}
