export async function getCSRFToken(): Promise<string> {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/v2/get_csrf/', {
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
        return data.csrfToken;
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
