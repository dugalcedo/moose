import { defineHandler } from "$lib/server/index.js";
import { z } from 'zod'

const CURRENCY_CONVERT_MAP: Record<string, Record<string, number>> = {
    USD: {
        EUR: 0.9,
        SEK: 9,
        GBP: 0.75
    },
    EUR: {
        USD: 1.11,
        SEK: 10.0,
        GBP: 0.83
    },
    SEK: {
        USD: 0.11,
        EUR: 0.10,
        GBP: 0.083
    },
    GBP: {
        USD: 1.33,
        EUR: 1.20,
        SEK: 12.0
    }
}

export const POST = defineHandler({
    body: z.object({
        from: z.enum(Object.keys(CURRENCY_CONVERT_MAP), "no"),
        to: z.enum(Object.keys(CURRENCY_CONVERT_MAP), "nope"),
        amount: z.number()
    }),
    handler: async (evt) => {
        await new Promise(r => setTimeout(r, 1000))

        const {from, to, amount} = evt.body

        const factor = CURRENCY_CONVERT_MAP[from]?.[to];

        if (factor === undefined) throw {json: {
            status: 400,
            message: "invalid input"
        }}

        return {json: {
            result: amount * factor
        }}
    }
})

export type CurrencyInput = typeof POST.inferInput
export type CurrencyOutput = typeof POST.inferOutput