import axios from 'axios';

export async function handler(event) {
    const path = event.path.replace('/.netlify/functions/proxy/', '');
    
    const queryParams = new URLSearchParams(event.queryStringParameters || {});
    queryParams.set('format', 'json'); // force format=json
    
    const url = `${process.env.KOBO}/${path}?${queryParams.toString()}`;

    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Token ${process.env.KOBO_API_TOKEN}` }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (err) {
        return {
            statusCode: err.response?.status || 500,
            body: JSON.stringify({ error: err.message })
        };
    }
}