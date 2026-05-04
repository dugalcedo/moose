import type { RequestHandler } from '@sveltejs/kit'
import * as types from './moose.types.ts'
import dayjs from 'dayjs'
import { logHandlerBegin, logHandlerEnd, logHandlerError } from './logger.ts'

export default function moose(init: types.MooseInit): RequestHandler {
    const SVELTEKIT_REQUEST_HANDLER: RequestHandler = async (evt) => {

        const time = dayjs()

        const ctx: types.MooseContext = {
            ...evt,
            status: 200,
            time,
            id: time.format('YYYYMMDDHHmm')
        }

        logHandlerBegin(ctx)

        // ===== TRY GETTING RESULT FROM HANDLER =====
        try {            
            const result = await init.handler(ctx)
    
            if (result instanceof Response) {
                return result
            }

            return mooseResultToResponse(result, ctx)
        } catch (error) {

            logHandlerError(ctx, error)
            
            // --- IF A CUSTOM ERROR HANDLER WAS PROVIDED ---
            if (init.errorHandler) {
                // The devuser can return null if they want to "cancel" their error handler and re-delegate the error back to moose.
                const errorHandlerResult = await init.errorHandler(error)
                if (errorHandlerResult !== null) {
                    // -- use the custom moose result --
                    if (errorHandlerResult instanceof Response) return errorHandlerResult
                    return mooseResultToResponse(errorHandlerResult, ctx)
                }
                // else continue with the default error-handling pattern
            }
            // --- END OF CUSTOM ERROR HANDLING ---

            return unknownToResponse(error, ctx)
        } finally {
            logHandlerEnd(ctx)
        }
    }

    return SVELTEKIT_REQUEST_HANDLER
}

// ========== HELPER FUNCTIONS ==========

const mooseResultToResponse = (mr: types.Json, ctx: types.MooseContext): Response => {
    return Response.json(mr, {
        status: ctx.status
    })
}

const unknownToResponse = (u: unknown, ctx: types.MooseContext): Response => {
    let status = ctx.status >= 400 ? ctx.status : 500;

    let body = (u as any)?.client;
    if (!isJsonStringifiable(body)) body = {};

    return Response.json(body, {
        status
    })
}

// ========== UTILITIES ==========

const isJsonStringifiable = (x: unknown): x is types.Json => {
    return (
        (typeof x === 'object')
        || (typeof x === 'string')
        || (typeof x === 'boolean')
        || (x === undefined)
        || (typeof x === 'number' && !isNaN(x))
    )
}
