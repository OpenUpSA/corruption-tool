import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());

app.get('/:path(*)', async (req, res) => {
    let path = req.params.path;
    let queryString = req.originalUrl.split('?')[1] || '';

    const isAttachment = (path.includes('attachments')); // is an image or file attachment

    let url = `${process.env.KOBO}${path}?${queryString}`;
    // If you want to add your format=json param safely:
    if (!isAttachment) {
        url = `${url}${queryString ? '&' : ''}format=json`;
    }

    console.log(url);

    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Token ${process.env.KOBO_API_TOKEN}` },
            responseType: isAttachment ? 'stream' : 'json'
        });
        if (isAttachment) {
            res.set('Content-Type', response.headers['content-type']);  // or the appropriate content type
            res.set('Content-Disposition', response.headers['content-disposition']);  // or 'attachment' to prompt download
            response.data.pipe(res);
        } else {
            res.json(response.data);
        }
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
});


app.listen(4000, () => console.log('Proxy running at http://localhost:4000'));