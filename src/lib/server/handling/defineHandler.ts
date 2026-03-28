import type { MooseHandlerInit, MooseResult, InferMooseOutput, InferBody, MooseResult_Standard } from "./types.ts";
import type { RequestHandler } from "@sveltejs/kit";
import type { LayoutParams, RouteId as AppRouteId } from "$app/types";
import type { ZodType } from "zod";
import { handleError } from "./errorHandling.ts";
import { t } from "./util.ts";

export default function defineHandler<
  Params extends LayoutParams<'/'> = LayoutParams<'/'>,
  RouteId extends AppRouteId | null = AppRouteId | null,
  TReturn extends MooseResult = MooseResult,
  TBodySchema extends ZodType | undefined = undefined
>(init: MooseHandlerInit<Params, RouteId, TReturn, TBodySchema>): RequestHandler<Params, RouteId> & {
  inferOutput: InferMooseOutput<Awaited<TReturn>>
  inferInput: InferBody<TBodySchema>
} {

  const requestHandler: RequestHandler<Params, RouteId> & {
    inferOutput: InferMooseOutput<Awaited<TReturn>>
    inferInput: InferBody<TBodySchema>
  } = async (evt) => {
    console.log(`[${t()}] ${evt.request.method} ${evt.request.url}`)

    try {
      let body: InferBody<TBodySchema> | undefined

      if (init.body) {
        body = await init.body.parseAsync(await evt.request.json()) as InferBody<TBodySchema>
      }

      const result: MooseResult = await init.handler({
        ...evt,
        ...(body !== undefined ? { body } : {})
      } as any)

      switch (result.type) {
        case "text":
          return new Response(result.text, {
            status: result.status || 200
          })
        case "custom":
          return result.response
        case "standard":
        default:
          return Response.json((result as MooseResult_Standard).json, {
            status: result.status || 200
          })
      }
    }
    catch (unknownError) {
      return handleError(unknownError, evt)
    }
  }

  requestHandler.inferOutput = null as never
  requestHandler.inferInput = null as never

  return requestHandler as any
}
