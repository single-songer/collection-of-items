require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const port = process.env.PORT || 3000;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'] // 支持两种本地地址
}));
app.get('/api/search', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.state(400).json({ error: '缺少query参数' })
    }
    try {
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: TMDB_API_KEY,
                query: query.trim(),
                language: 'zh-CN'
            }
        })
        res.json(response.data)

    } catch (error) {
        console.error('TMDB 请求失败:', error.message);
        if (error.response?.state === 401) {
            return res.status(401).json({ error: 'TMDB 请求失败' });
        } else {
            return res.status(500).json({ error: '服务器错误' });
        }
    }
    // https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=zh-CN
})
app.listen(port, () => console.log(`✅后端运行在 http://localhost:${port}`));