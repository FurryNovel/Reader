import {handleRequest} from "./../dist/server/entry-server.js";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const {pathname} = url;
        if (pathname.startsWith('/api')) {
            return await handleApiRequest(request);
        }
        try {
            if (isAssetUrl(request.url)) {
                url.pathname = '/client' + pathname;
                return await env.ASSETS.fetch(url);
            }
        } catch (e) {
            return new Response(e.stack, {status: 500});
        }
        return await handleRequest(request);
    },
}


async function handleApiRequest(request) {
    return new Response(JSON.stringify({
        time: new Date().toISOString(),
    }));
}

function isAssetUrl(url) {
    const {pathname} = new URL(url);
    return !!(pathname.startsWith('/assets/')
        || pathname.startsWith('/favicon.ico')
        || pathname.startsWith('/robots.txt')
        || pathname.startsWith('/sitemap.xml')
        || pathname.startsWith('/sw.js')
        || pathname.startsWith('/static')
        || pathname.startsWith('/workbox')
        || pathname.startsWith('/manifest.webmanifest')
        || pathname.startsWith('/registerSW.js'));
}
