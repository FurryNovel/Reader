import path from 'node:path';
import {initCloudflareEnv, render} from '@/entry-server.js';
import template from './dist/client/index.html?raw';
import manifest from './dist/client/.vite/ssr-manifest.json?raw';
import express from 'express';

const app = express();

const assets = express.static(path.join('./../client'));
app.use('/', async (req, res, next) => {
    if (req.url.endsWith('/')) {
        return next();
    }
    return assets(req, res, next);
});

app.get('*', async (req, res) => {
    try {
        const renderRes = await render(req.originalUrl, manifest, {
            cookies: req.headers.cookie,
            headers: new Headers(req.headers),
        });
        res.status(200).send(
            template
                .replace(`<!--app-html-->`, renderRes.html)
                .replace(`<!--preload-links-->`, renderRes.preloadLinks)
                .replace(`<!--head-tags-->`, renderRes.headTags)
                .replace(`null;//'<!--ssr-state-->'`, renderRes.state),
        );
    } catch (e) {
        res.status(500).send(e.stack);
    }
});

app.listen(3000, () => {
    console.log('http://localhost:3000');
})
