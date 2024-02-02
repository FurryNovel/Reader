import fs from 'node:fs'
import path from 'node:path'
import express from 'express'

const isProd = (process.env.NODE_ENV === 'production');

const resolve = (p) => path.resolve(p)

const app = express();

const manifest = isProd
    ? JSON.parse(
        fs.readFileSync(
            resolve('dist/client/.vite/ssr-manifest.json'),
            'utf-8',
        ),
    )
    : {};

let vite = {};
if (isProd) {
    const compression = await import('compression');
    const serveStatic = await import('serve-static');
    app.use(
        compression.default()
    );
    app.use(
        serveStatic.default(
            resolve('./dist/client'),
            {
                index: false
            }
        )
    );
} else {
    vite = await (await import('vite')).createServer({
        root: resolve('.'),
        logLevel: 'info',
        appType: 'custom',
        server: {
            middlewareMode: true,
            watch: {
                // During tests we edit the files too fast and sometimes chokidar
                // misses change events, so enforce polling for consistency
                usePolling: true,
                interval: 100,
            },
        },
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
}


app.use('*', async (req, res) => {
    try {
        const url = req.originalUrl || req.url;
        const template = isProd ? fs.readFileSync(resolve('./dist/client/index.html'), 'utf-8') : await vite.transformIndexHtml(url, fs.readFileSync(resolve('index.html'), 'utf-8'));
        const render = (isProd ? (await import('./dist/server/entry-server.js')).render : await vite.ssrLoadModule('/src/entry-server')).render;

        const renderRes = await render(url, manifest);
        
        const html = template
            .replace(`<!--app-html-->`, renderRes.html)
            .replace(`<!--preload-links-->`, renderRes.preloadLinks)
            .replace(`<!--head-tags-->`, renderRes.headTags);
        
        res.status(200).set({'Content-Type': 'text/html'}).end(html);
    } catch (e) {
        if (!isProd){
            vite && vite.ssrFixStacktrace(e);
            console.error(e.stack);
        }
        res.status(500).end(e.stack);
    }
});


app.listen(3000, () => {
    console.log('http://localhost:3000');
})
