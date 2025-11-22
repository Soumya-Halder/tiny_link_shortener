const express = require('express');
const shortid = require('shortid');
const validateUrl = require('../utils/validateUrl');


module.exports = (prisma) => {
    const router = express.Router();


    // Create link
    router.post('/', async (req, res) => {
        const { targetUrl, code } = req.body;
        if (!targetUrl || !validateUrl(targetUrl)) {
            return res.status(400).json({ error: 'Invalid URL' });
        }


        const finalCode = code ? code : shortid.generate().replace(/[^A-Za-z0-9]/g, '').slice(0, 7);
        const codeRegex = /^[A-Za-z0-9]{6,8}$/;
        if (!codeRegex.test(finalCode)) {
            return res.status(400).json({ error: 'Code must match [A-Za-z0-9]{6,8}' });
        }


        // check unique
        const exists = await prisma.link.findUnique({ where: { code: finalCode } });
        if (exists) return res.status(409).json({ error: 'Code already exists' });


        const created = await prisma.link.create({
            data: { code: finalCode, targetUrl }
        });


        res.status(201).json(created);
    });


    // List all
    router.get('/', async (req, res) => {
        const items = await prisma.link.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(items);
    });


    // Get single
    router.get('/:code', async (req, res) => {
        const { code } = req.params;
        const item = await prisma.link.findUnique({ where: { code } });
        if (!item) return res.status(404).json({ error: 'Not found' });
        res.json(item);
    });


    // Delete
    router.delete('/:code', async (req, res) => {
        const { code } = req.params;
        try {
            await prisma.link.delete({ where: { code } });
            res.status(204).send();
        } catch (err) {
            res.status(404).json({ error: 'Not found' });
        }
    });


    return router;
};