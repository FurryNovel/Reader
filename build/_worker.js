export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        console.log(url, url.pathname)
        if (
            url.pathname.startsWith('/client')
            || url.pathname.startsWith('/server')
        ) {
            return env.ASSETS.fetch(request);
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
            return env.ASSETS.fetch(new URL(request.url.replace(request.pathname, '/client' + url.pathname)));
        }
        return env.ASSETS.fetch(new URL(request.url.replace(request.pathname, '/client/index.html')));
    },
}
