import { DrizzleError, DrizzleQueryError, TransactionRollbackError } from "drizzle-orm/errors"
import type { RequestEvent } from "@sveltejs/kit"
import { t } from "./util.ts"

const log = (msg: string, evt: RequestEvent) => {
  console.log(`[${t()}] (${evt.request.method} ${evt.request.url}) ${msg}`)
}

export const isDrizzleError = (e: unknown): e is DrizzleError | DrizzleQueryError =>
  e instanceof DrizzleError || e instanceof DrizzleQueryError

// Returns [status, clientMessage] by inspecting the raw driver error
const parseQueryError = (e: DrizzleQueryError): [number, string] => {
  const cause = e.cause as any

  // PostgreSQL unique violation (code 23505)
  if (cause?.code === '23505') {
    const column = cause.detail?.match(/Key \((.+?)\)=/)?.[1]
    return [409, column ? `${column} is already taken` : "A unique constraint was violated"]
  }

  // SQLite unique violation
  if (typeof cause?.message === 'string' && cause.message.includes('UNIQUE constraint failed')) {
    const column = cause.message.split('UNIQUE constraint failed: ')[1]?.split('.').at(-1)
    return [409, column ? `${column} is already taken` : "A unique constraint was violated"]
  }

  // MySQL/MySQL2 duplicate entry (errno 1062)
  if (cause?.errno === 1062) {
    const column = (cause.sqlMessage as string | undefined)?.match(/for key '(?:.+\.)?(.+?)'/)?.[1]
    return [409, column ? `${column} is already taken` : "A unique constraint was violated"]
  }

  return [500, "Database query failed"]
}

export const handleDrizzleError = (e: DrizzleError | DrizzleQueryError, evt: RequestEvent): Response => {
  if (e instanceof TransactionRollbackError) {
    log("Transaction rolled back", evt)
    return Response.json({ message: "Transaction rolled back" }, { status: 500 })
  }

  if (e instanceof DrizzleQueryError) {
    const [status, message] = parseQueryError(e)
    log(`Query error: ${e.message}`, evt)
    return Response.json({ message }, { status })
  }

  log(`Drizzle error: ${e.message}`, evt)
  return Response.json({ message: e.message || "Database error" }, { status: 500 })
}
