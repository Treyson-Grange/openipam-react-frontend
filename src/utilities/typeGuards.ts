import { UserResponse } from '../types/api';
/**
 * For use in auth context to check if the response is a user object. Ts stuff.
 * @param response
 * @returns
 */
export function isUser(
    response: UserResponse,
): response is { username: string; email: string; id: number } {
    return (
        response &&
        typeof response.username === 'string' &&
        typeof response.email === 'string' &&
        typeof response.id === 'number'
    );
}
