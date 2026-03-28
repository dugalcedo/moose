import type { FormEventHandler } from "svelte/elements"
import type { MooseFetchOptions } from "./types.ts"
import { parseBadRes, parseGoodRes } from "./util.ts"
import type { ZodType } from "zod"

type MooseFormInit<
    RequestBodyType = any,
    ResponseBodyType = any,
    FormDataType = RequestBodyType,
> = {
    url: string | URL | Request
    options?: RequestInit & MooseFetchOptions
    validate?: ZodType<FormDataType> | MooseFormValidator<FormDataType>
    prepare?: (formData: FormDataType) => RequestBodyType | Promise<RequestBodyType>
    initialFormData: FormDataType
    onGoodRes?: (data: ResponseBodyType, res: Response) => void
    onBadRes?: (error: Error, data: any, res: Response) => void
}

type MooseFormValidator<FormDataType> = (data: FormDataType, err: (key: string, msg: string) => void) => void | Promise<void>

type MooseFormErrorObj = Record<string, string[]>

type MooseFormRequestState<
    ResponseBodyType = any,
> = {
    isPending: boolean
    error: Error | null
    errorData: any | null
    isError: boolean
    resData: ResponseBodyType | null
}

type MooseFormFormState<FormDataType> = {
    data: FormDataType
    errors: MooseFormErrorObj
}

export default function defineForm<
    RequestBodyType = any,
    ResponseBodyType = any,
    FormDataType = RequestBodyType
>(init: MooseFormInit<RequestBodyType, ResponseBodyType, FormDataType>) {

    const request: MooseFormRequestState<ResponseBodyType> = $state({
        isPending: false,
        error: null,
        errorData: null,
        get isError() { return !!this.error },
        resData: null
    })

    const f: MooseFormFormState<FormDataType> = $state({
        errors: {},
        data: init.initialFormData
    })

    const err = (key: string, msg: string) => {
        if (!f.errors[key]) f.errors[key] = [] as string[]
        f.errors[key].push(msg)
    }

    const handler: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        f.errors = {}

        if (init.validate) {
            if (typeof init.validate === 'function') {
                await init.validate(f.data, err)
            } else {
                const result = init.validate.safeParse(f.data)
                if (!result.success) {
                    for (const issue of result.error.issues) {
                        const key = issue.path?.[0]
                        if (key != null) err(String(key), issue.message)
                    }
                }
            }
        }

        if (Object.keys(f.errors).length) return

        const body = init.prepare
            ? await init.prepare(f.data)
            : f.data as unknown as RequestBodyType

        request.isPending = true
        request.error = null
        request.errorData = null
        request.resData = null

        let res: Response
        try {
            res = await fetch(init.url, {
                ...init.options,
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    ...(init.options?.headers ?? {})
                }
            })
        } catch (error) {
            request.error = error as Error
            request.isPending = false
            return
        }

        if (!res.ok) {
            const [errorData, error] = await parseBadRes(res)
            request.error = error
            request.errorData = errorData
            if (errorData?.type === 'zod' && Array.isArray(errorData.issues)) {
                for (const issue of errorData.issues) {
                    const key = issue.path?.[0]
                    if (key != null) err(String(key), issue.message)
                }
            }
            request.isPending = false
            init.onBadRes?.(error, errorData, res)
            return
        }

        const result = await parseGoodRes<ResponseBodyType>(res)
        if (typeof result === 'string') {
            request.error = new Error(`Invalid JSON: ${result}`)
            request.errorData = result
            request.isPending = false
            return
        }

        request.resData = result
        request.isPending = false
        init.onGoodRes?.(result, res)
    }

    return {
        f,
        request,
        handler
    }
}
