import type { RequestEvent } from "@sveltejs/kit"
import type { LayoutParams, RouteId as AppRouteId } from "$app/types"
import type { ZodType } from "zod"

export type Json = (
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: Json }
  | Json[]
)

export type MaybePromise<T = any> = T | Promise<T>;


interface MooseResult_Base {
  status?: StatusCode
  type?: (
    | "standard"
    | "text"
    | "custom"
  )
}

export interface MooseResult_Standard<T extends Json = Json> extends MooseResult_Base {
  type?: "standard"
  json: T
}

export interface MooseResult_Custom extends MooseResult_Base {
  type?: "custom"
  response: Response
}

export interface MooseResult_Text extends MooseResult_Base {
  type?: "text"
  text: string
}

export type MooseResult = (
  | MooseResult_Standard
  | MooseResult_Text
  | MooseResult_Custom
)

export type InferMooseOutput<T> = T extends any
  ? T extends { text: string } ? string
  : T extends { response: Response } ? unknown
  : T extends { json: infer J } ? J
  : never
  : never

export type InferBody<TBodySchema> = TBodySchema extends ZodType<infer U> ? U : never

export type MooseContext<
  Params extends LayoutParams<'/'> = LayoutParams<'/'>,
  RouteId extends AppRouteId | null = AppRouteId | null,
  TBodySchema extends ZodType | undefined = undefined
> = RequestEvent<Params, RouteId> & (TBodySchema extends ZodType ? { body: InferBody<TBodySchema> } : {})

export type MooseHandler<
  Params extends LayoutParams<'/'> = LayoutParams<'/'>,
  RouteId extends AppRouteId | null = AppRouteId | null,
  TReturn extends MooseResult = MooseResult,
  TBodySchema extends ZodType | undefined = undefined
> = (ctx: MooseContext<Params, RouteId, TBodySchema>) => MaybePromise<TReturn>

export type MooseHandlerInit<
  Params extends LayoutParams<'/'> = LayoutParams<'/'>,
  RouteId extends AppRouteId | null = AppRouteId | null,
  TReturn extends MooseResult = MooseResult,
  TBodySchema extends ZodType | undefined = undefined
> = {
  body?: TBodySchema
  handler: MooseHandler<Params, RouteId, TReturn, TBodySchema>
}

export enum StatusCode {
  // 1xx Informational
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  EARLY_HINTS = 103,

  // 2xx Success
  SUCCESS = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MULTI_STATUS = 207,
  ALREADY_REPORTED = 208,
  IM_USED = 226,

  // 3xx Redirection
  MULTIPLE_CHOICES = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  USE_PROXY = 305,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,

  // 4xx Client Errors
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  CONTENT_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  IM_A_TEAPOT = 418,
  MISDIRECTED_REQUEST = 421,
  UNPROCESSABLE_CONTENT = 422,
  LOCKED = 423,
  FAILED_DEPENDENCY = 424,
  TOO_EARLY = 425,
  UPGRADE_REQUIRED = 426,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  VARIANT_ALSO_NEGOTIATES = 506,
  INSUFFICIENT_STORAGE = 507,
  LOOP_DETECTED = 508,
  NOT_EXTENDED = 510,
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}
