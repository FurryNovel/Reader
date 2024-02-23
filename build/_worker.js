
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if (url.pathname.startsWith('/api/')) {
            url.hostname = env.API_HOST;
            return await fetch(new Request(url, request));
        }else if (
            url.pathname.startsWith('/assets/')
            || url.pathname.startsWith('/static/')
            || url.pathname.indexOf('.') !== -1
        ) {
            url.pathname = '/client' + url.pathname;
            return env.ASSETS.fetch(new Request(url, request));
        }
        url.pathname = '/client/index.html';
        return env.ASSETS.fetch(new Request(url, request));
    },
}
