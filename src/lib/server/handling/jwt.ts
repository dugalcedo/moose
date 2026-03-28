import jwt from 'jsonwebtoken'
import type { SignOptions, VerifyOptions } from 'jsonwebtoken'
import type { Json } from './types.ts'
import { type ZodType } from 'zod'

export type JwtMooseObjValidator = (unvalidatedObj: { [key: string]: Json }) => void | Promise<void>;

export type JwtMooseInit = {
    secret: string
    signOptions?: SignOptions
    verifyOptions?: VerifyOptions
    validateAfterVerify?: JwtMooseObjValidator | ZodType;
    validateBeforeSign?: JwtMooseObjValidator | ZodType;
    validateAfterDecode?: JwtMooseObjValidator | ZodType;
}

export type JwtMoosePayload = (
    { [key: string]: Json }
)

export const defineJwt = <PayloadType extends JwtMoosePayload = JwtMoosePayload>(init: JwtMooseInit) => {
    const sign = async (payload: PayloadType, signOptions?: SignOptions) => {
        try {
            if (init.validateBeforeSign) await validateObj(payload, init.validateBeforeSign);
            const token = jwt.sign(payload, init.secret, signOptions || init.signOptions)
            return token
        } catch (error) {
            throw {
                status: 500,
                log: `Failed signing token: ${(error as any)?.message || "unknown reason"}`
            }
        }
    }

    const verify = async (token: string, verifyOptions?: VerifyOptions) => {
        try {
            const result = jwt.verify(token, init.secret, verifyOptions || init.verifyOptions)

            if (result === null || Array.isArray(result) || typeof result !== 'object') {
                throw {
                    status: 401,
                    // json will be passed to client
                    json: { message: "you have been logged out" },
                    log: `Failed verifying token: Payload was invalid type`,
                    data: result
                }
            }

            if (init.validateAfterVerify) await validateObj(result as any, init.validateAfterVerify);

            return result as PayloadType
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw {
                    status: 401,
                    json: { message: "you have been logged out" },
                    log: `Failed verifying token: ${error.message}`
                }
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw {
                    status: 401,
                    json: { message: "you have been logged out" },
                    log: `Failed verifying token: ${error.message}`
                }
            } else {
                throw error
            }
        }
    }

    const decode = async (token: string) => {
        const result = jwt.decode(token)

        if (result === null || Array.isArray(result) || typeof result !== 'object') {
            throw {
                status: 401,
                json: { message: "you have been logged out" },
                log: `Failed decoding token: Payload was invalid type`
            }
        }

        if (init.validateAfterDecode) await validateObj(result, init.validateAfterDecode);

        return result as PayloadType
    }

    return { sign, verify, decode }
}

// ===== HELPERS =====

const validateObj = async (obj: { [key: string]: Json }, validator: JwtMooseObjValidator | ZodType) => {
    if (typeof validator === 'function') {
        await validator(obj)
    } else {
        await validator.parseAsync(obj)
    }
}