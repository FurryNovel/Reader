import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import cookieParser from "cookie-parser";

const resolve = (p) => path.resolve(p)

const app = express();

const manifest = {};

app.use(cookieParser())

const vite = await (await import('vite')).createServer({
    root: resolve('.'),
    logLevel: 'info',
    appType: 'custom',
    server: {
        middlewareMode: true,
        watch: {
            usePolling: true,
            interval: 100,
        },
    },
});
// use vite's connect instance as middleware
app.use(vite.middlewares);


app.use('*', async (req, res) => {
    try {
        const url = req.originalUrl || req.url;
        const template = await vite.transformIndexHtml(url, fs.readFileSync(resolve('index.html'), 'utf-8'));
        const render = (await (vite.ssrLoadModule('/src/entry-server'))).render;
        const renderRes = await render(url, manifest, {
            cookies: req.cookies,
        });
        
        const html = template
            .replace(`<!--app-html-->`, renderRes.html)
            .replace(`<!--preload-links-->`, renderRes.preloadLinks)
            .replace(`<!--head-tags-->`, renderRes.headTags)
            .replace(`null;//'<!--ssr-state-->'`, renderRes.state);
        
        res.status(200).set({'Content-Type': 'text/html'}).end(html);
    } catch (e) {
        res.status(500).end(e.stack);
    }
});


app.listen(3000, () => {
    console.log('http://localhost:3000');
})
