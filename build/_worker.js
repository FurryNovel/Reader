export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if (url.pathname.startsWith('/api/')) {
            url.href = url.href.replace(url.hostname, env.API_HOST);
            url.hostname = env.API_HOST;
            return await fetch(new Request(url, request));
        } else if (
            url.pathname.startsWith('/assets/')
            || url.pathname.startsWith('/static/')
            || url.pathname.indexOf('.') !== -1
        ) {
            url.href = url.href.replace(url.pathname, '/client' + url.pathname);
            url.pathname = '/client' + url.pathname;
            return env.ASSETS.fetch(new Request(url, request));
        }
        url.href = url.href.replace(url.pathname, '/client/index.html');
        url.pathname = '/client/index.html';
        return env.ASSETS.fetch(new Request(url, request));
    },
}
