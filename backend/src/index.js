const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const linksRouter = require('./routes/links');
const dayjs = require('dayjs');


require('dotenv').config();
const app = express();
const prisma = new PrismaClient();


app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://tiny-link-the-url-shortener.vercel.app"
    ]
}));
app.use(express.json());


app.get('/healthz', (req, res) => {
    res.json({ ok: true, version: '1.0' });
});


app.use('/api/links', linksRouter(prisma));


// Redirect route: GET /:code
app.get('/:code', async (req, res) => {
    const { code } = req.params;
    const link = await prisma.link.findUnique({ where: { code } });
    if (!link) return res.status(404).send('Not found');


    // increment click and update lastClicked
    await prisma.link.update({
        where: { code },
        data: { totalClicks: { increment: 1 }, lastClicked: new Date() }
    });


    res.redirect(302, link.targetUrl);
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));