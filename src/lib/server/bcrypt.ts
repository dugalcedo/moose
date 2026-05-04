import bcrypt from 'bcryptjs'

export const toHash = (str: string): string => {
    return bcrypt.hashSync(str, 6)
}

export const compareStringToHash = (str: string, hash: string) => {
    return bcrypt.compareSync(str, hash)
}