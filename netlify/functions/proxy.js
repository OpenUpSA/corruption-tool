import axios from 'axios';

export async function handler(event) {
    const path = event.path.replace('/.netlify/functions/proxy/', '');
    
    const queryParams = new URLSearchParams(event.queryStringParameters || {});
    const isAttachment = path.includes('attachments'); // is an image or file attachment
    if (!isAttachment) queryParams.set('format', 'json'); // force format=json
    
    const url = `${process.env.KOBO}/${path}?${queryParams.toString()}`;

    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Token ${process.env.KOBO_API_TOKEN}` },
            responseType: isAttachment ? 'stream' : 'json'
        });
        if (isAttachment) {
            const chunks = [];
            for await (const chunk of response.data) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);

            // return as image/file
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': response.headers['content-type'],
                    'Content-Disposition': response.headers['content-disposition']
                },
                body: buffer.toString('base64'),
                isBase64Encoded: true
            };
        }

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