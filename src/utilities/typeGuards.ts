/**
 * For use in auth context to check if the response is a user object. Ts stuff.
 * @param response 
 * @returns 
 */
export function isUser(response: any): response is { username: string; email: string; id: number } {
    return response && typeof response.username === 'string' &&
        typeof response.email === 'string' &&
        typeof response.id === 'number';
}
