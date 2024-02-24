import {render} from '@/entry-server';
import template from '@/../dist/client/index.html?raw';
import manifest from '@/../dist/client/.vite/ssr-manifest.json?raw';
import express from "express";

const app = express();

app.listen(3000, () => {
    console.log('http://localhost:3000');
})


export default {
    async fetch(request) {
        try {
            const url = request.originalUrl || request.url;
            const renderRes = await render(url, manifest, {
                cookies: request.headers.get('cookie'),
            });
            return new Response(
                template
                    .replace(`<!--app-html-->`, renderRes.html)
                    .replace(`<!--preload-links-->`, renderRes.preloadLinks)
                    .replace(`<!--head-tags-->`, renderRes.headTags)
                    .replace(`null;//'<!--ssr-state-->'`, renderRes.state),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/html',
                    },
                },
            );
        } catch (e) {
            return new Response(e.stack, {status: 500});
        }
    },
}
