import * as types from './moose.types.ts'
import { type Dayjs } from 'dayjs'

export const logHandlerBegin = (ctx: types.MooseContext) => {
    console.log(); // empty line
    console.log(`[${formatTime(ctx.time)}] NEW REQUEST: ${ctx.request.method} @ ${ctx.request.url} (id: #${ctx.id})`)
}

export const logHandlerEnd = (ctx: types.MooseContext) => {
    console.log(`--- END OF REQUEST #${ctx.id} ---`)
    console.log(); // empty line
}

export const logHandlerError = (ctx: types.MooseContext, error: unknown) => {
    console.log(`!!! ERROR IN REQUEST #${ctx.id} !!!`)
    console.error(error)
    console.log("!!! END OF ERROR !!!")
}

// ----- HELPERS -----

const formatTime = (d: Dayjs) => {
    return d.format('YY-MM-DD HH:mm')
}