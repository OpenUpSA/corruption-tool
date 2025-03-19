import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/:path(*)', async (req, res) => {
    const path = req.params.path;


    let url = `https://kf-kbt.openup.org.za/api/v2/${path}?format=json`;


    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `'Token ${process.env.KOBO_API_TOKEN}'` }
        });
        res.json(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
});

app.listen(4000, () => console.log('Proxy running at http://localhost:4000'));