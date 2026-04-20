import type { RequestEvent } from "@sveltejs/kit"
import type { Json } from "./types.ts"
import { deriveStatusCodeFromNumber } from "./util.ts"
import { ZodError } from "zod"
import { t } from "./util.ts"
import { isDrizzleError, handleDrizzleError } from "./drizzleErrorHandling.ts"

export const handleError = (unknownError: unknown, evt: RequestEvent): Response => {
  // STRING
  if (typeof unknownError === 'string') {
    log(unknownError, evt)
    return Response.json({
      message: unknownError
    }, {
      status: 500
    })
  }

  // NUMBER
  if (typeof unknownError === 'number') {
    const [code, text] = deriveStatusCodeFromNumber(unknownError)
    log(text, evt)
    return Response.json({ message: text }, { status: code })
  }

  // ZOD ERROR
  if (unknownError instanceof ZodError) {
    log("Validation error", evt)
    return Response.json({ type: "zod", issues: unknownError.issues }, { status: 422 })
  }

  // DRIZZLE ERROR
  if (isDrizzleError(unknownError)) {
    return handleDrizzleError(unknownError, evt)
  }

  // ERROR INSTANCE
  if (unknownError instanceof Error) {
    log(unknownError.message, evt)
    return Response.json({ message: unknownError.message }, { status: 500 })
  }

  // ARRAYS / TUPLES
  if (Array.isArray(unknownError)) {
    return handleThrownTuple(unknownError, evt)
  }

  // OBJECT
  if (typeof unknownError === 'object') {
    const obj = (unknownError as any)
    log(obj.log || obj.message || JSON.stringify(obj), evt)
    const [status, statusText] = deriveStatusCodeFromNumber(obj.status)
    return Response.json(obj.json || {}, { status, statusText: obj.statusText || statusText })
  }

  log("Unknown error", evt)
  return Response.json({}, {
    status: 500
  })
}

const handleThrownTuple = (tuple: unknown[], evt: RequestEvent): Response => {
  const [first, second] = tuple

  // NUMBER FIRST: TREAT AS STATUS
  if (typeof first === 'number') {
    if (typeof second === 'string') {
      // NUMBER, STRING
      log(second, evt)
      return Response.json({ message: second }, { status: first, statusText: second })
    }
    log(JSON.stringify(second), evt)
    return Response.json(second, { status: first })
  }

  log(JSON.stringify(tuple), evt)
  return Response.json(tuple, { status: 500 })
}

const log = (msg: string, evt: RequestEvent) => {
  console.log(`[${t()}] (${evt.request.method} ${evt.request.url}) ${msg}`)
}
