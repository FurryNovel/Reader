import {render} from '@/entry-server';
import template from '@/../dist/client/index.html?raw';
import manifest from '@/../dist/client/.vite/ssr-manifest.json?raw';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if (
            url.pathname.startsWith('/client')
            || url.pathname.startsWith('/server')
        ) {
            return await env.ASSETS.fetch(`http://hostname.invalid${url.pathname}`);
        }
        if (url.pathname.startsWith('/api/')) {
            url.href = url.href.replace(url.hostname, env.API_HOST);
            url.hostname = env.API_HOST;
            return fetch(new Request(url, request));
        } else if (
            url.pathname.startsWith('/assets/')
            || url.pathname.startsWith('/static/')
            || url.pathname.indexOf('.') !== -1
        ) {
            return await env.ASSETS.fetch('http://hostname.invalid/client' + url.pathname);
        }
        const renderRes = await render(url.pathname, manifest, {
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
    },
}
