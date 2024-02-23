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
        return await env.ASSETS.fetch('http://hostname.invalid/client/index.html');
    },
}
