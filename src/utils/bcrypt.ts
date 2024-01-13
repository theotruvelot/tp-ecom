import * as bcrypt from 'bcrypt';


export async function encodePassword(rawPassword: string) {
    const SALT = bcrypt.genSaltSync(10);
    return bcrypt.hash(rawPassword, SALT);
}

export async function  comparePassword(rawPassword: string, hashPassword: string) {
    return bcrypt.compare(rawPassword, hashPassword);
}