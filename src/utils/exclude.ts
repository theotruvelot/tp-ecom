//function to exclude password from user object
import { User } from '@prisma/client';

export function exclude(user: User, excludeFields: string[]): User {
    const newUser = { ...user };
    excludeFields.forEach((field) => delete newUser[field]);
    return newUser;
}
