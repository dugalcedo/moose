export const parseBadRes = async (res: Response): Promise<[any, Error]> => {
    const text = await res.text()
    try {
        const parsed = JSON.parse(text)
        const message = parsed?.message ?? parsed?.issues?.[0]?.message ?? res.statusText ?? "unknown"
        return [parsed, new Error(message)]
    } catch {
        return [text, new Error(res.statusText || "unknown")]
    }
}

export const parseGoodRes = async <T = any>(res: Response): Promise<T | string> => {
    const text = await res.text()
    try {
        const parsed = JSON.parse(text)
        return parsed
    } catch {
        return text
    }
}

let n = 0
export const getNextN = () => {
    n++
    return n
}