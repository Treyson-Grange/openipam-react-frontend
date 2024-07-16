export async function getCSRFToken(apiUrl: string): Promise<{ csrfToken: string, sessionID: string }> {
    try {
        const response = await fetch(`${apiUrl}/get_csrf/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch CSRF token');
        }
        const data = await response.json();
        return { csrfToken: data.csrfToken, sessionID: data.session_id };
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
}

export async function apiCall(url: string, method: string, body: Record<string, any> | null, csrftoken: string): Promise<any> {
    const options: RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        credentials: 'include',
        body: body ? JSON.stringify(body) : null
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`${response.status}`);
    }
    return response.json();
}
