import type { RequestEvent } from "@sveltejs/kit"
import { type Dayjs } from "dayjs";

export type MaybePromise<T> = T | Promise<T>;

export type MooseContext = RequestEvent & {
    status: number
    time: Dayjs
    id: string
}

export type MooseHandler = (ctx: MooseContext) => MaybePromise<MooseResult>

export type MooseResult = Response | Json

export type MooseInit = {
    handler: MooseHandler
    errorHandler?: (error: unknown) => MaybePromise<MooseResult | null>
}

export type Json = (
    | string
    | number
    | boolean
    | null
    | undefined
    | Json[]
    | { [key: string]: Json }
)
