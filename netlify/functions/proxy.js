import axios from 'axios';

export async function handler(event) {
    const path = event.path.replace('/.netlify/functions/proxy/', '');
    const url = `${process.env.KOBO}/${path}?format=json`;

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