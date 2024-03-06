//@from "@/entry-server.js";
import {handleRequest} from "./../dist/server/entry-server.js";
//@from "@/utils/CloudflareEnv.js";
import {initCloudflareEnv} from "./../dist/server/entry-server.js";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const {pathname} = url;
        if (pathname.startsWith('/api')) {
            return await handleApiRequest(request);
        }
        return await checkRedirects(request).then(async () => {
            try {
                const cache = await caches.default;
                const cacheWrapper = {
                    put: async (key, value) => {
                        await cache.put(key, value);
                    },
                    match: async (key) => {
                        return await cache.match(key);
                    },
                }
                initCloudflareEnv({
                    env,
                    cache: cacheWrapper
                });
                if (isAssetUrl(request.url)) {
                    url.pathname = '/client' + pathname;
                    return env.ASSETS.fetch(url);
                } else if (url.searchParams.has('client_entry')) {
                    url.pathname = '/client/index.html';
                    return env.ASSETS.fetch(url);
                }
            } catch (e) {
                return new Response(e.stack, {status: 500});
            }
            return handleRequest(request, env);
        }).catch((response) => {
            return response;
        });
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
        || pathname.startsWith('/index.html')
        || pathname.startsWith('/sitemap.xml')
        || pathname.startsWith('/sw.js')
        || pathname.startsWith('/static')
        || pathname.startsWith('/workbox')
        || pathname.startsWith('/manifest.webmanifest')
        || pathname.startsWith('/registerSW.js'));
}

function checkRedirects(request) {
    let redirectTo = null;
    const url = new URL(request.url);
    const routes = [
        {
            path: '/pages/index/index',
            to: '/',
        },
        {
            path: '/pages/index/about',
            to: '/about',
        },
        {
            path: '/pages/novel/list',
            to: '/novel'
        },
        {
            path: '/pages/novel/bookmark',
            to: '/bookmark'
        },
        {
            path: '/pages/index/settings',
            to: '/settings'
        },
        {
            path: /\/pages\/novel\/info/g,
            to() {
                return `/novel/${url.searchParams.get('id')}`;
            }
        },
        {
            path: /\/pages\/novel\/chapter/g,
            to() {
                return `/novel/${url.searchParams.get('novel_id')}/chapter/${url.searchParams.get('id')}`;
            }
        },
    ];
    for (let route of routes) {
        if (route.path instanceof RegExp) {
            if (route.path.test(url.pathname)) {
                redirectTo = route;
                break;
            }
        } else if (url.pathname.startsWith(route.path)) {
            redirectTo = route;
            break;
        }
    }
    if (redirectTo){
        if (typeof redirectTo.to === 'function') {
            redirectTo = redirectTo.to();
        } else {
            redirectTo = redirectTo.to;
        }
    }
    if (redirectTo) {
        return Promise.reject(new Response(null, {
            status: 301,
            headers: {
                'Location': redirectTo,
            }
        }));
    }
    return Promise.resolve();
}
