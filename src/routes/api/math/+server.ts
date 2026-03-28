import { defineHandler } from "$lib/server/index.js"
import { z } from 'zod'

export const GET = defineHandler({
    handler: async () => {
        const n = Math.floor(Math.random()*100)

        await new Promise(r => setTimeout(r, 1000))

        if (n < 50) throw {json: {
            message: "oops"
        }}

        return {json: {
            number: n
        }}
    }
})

export const POST = defineHandler({
    body: z.object({
        x: z.number(),
        y: z.number(),
        op: z.enum(['+', '-'])
    }),
    handler: async (evt) => {
        return {json: {
            result: evt.body.op === '+' ? (evt.body.x+evt.body.y) : (evt.body.x-evt.body.y)
        }}
    }
})

export type MathResult = typeof GET.inferOutput
export type MathPostInput = typeof POST.inferInput
export type MathPostResult = typeof POST.inferOutput