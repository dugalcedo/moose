import 'dotenv/config'
import jwt from 'jsonwebtoken'
import * as types from './moose.types.ts'

const COOKIE_NAME = 'i-gave-a-moose-a-muffin'

export const parseRequiredToken = <PayloadType extends types.MooseJwtPayload>(ctx: types.MooseContext): PayloadType => {
    try {
        const cookie = ctx.cookies.get(COOKIE_NAME)
        if (!cookie) throw new Error("not logged in")

        const parsed = jwt.verify(cookie, process.env.JWT_SECRET??"")
        if (
            Array.isArray(parsed)
            || typeof parsed !== 'object'
        ) {
            console.error("when using jwt+moose, payloads can only be object literals, and this was the payload:", parsed)
            throw new Error("not logged in")
        }

        return Object(parsed) as any
    } catch (error) {
        throw error
    }
}

export const parseOptionalToken = <PayloadType extends types.MooseJwtPayload>(ctx: types.MooseContext): PayloadType | null => {
    try {
        const payload = parseRequiredToken(ctx)
        return payload as any
    } catch {
        return null
    }
}

export const signToken = (ctx: types.MooseContext, payload: types.MooseJwtPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET??"")
    ctx.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        path: '/',
        maxAge: 14*24*60*60
    })
}