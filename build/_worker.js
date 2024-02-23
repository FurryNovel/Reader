
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if (url.pathname.startsWith('/api/')) {
            url.hostname = env.API_HOST;
            return await fetch(new Request(url, request));
        }
        url.pathname = '/client' + url.pathname;
        return env.ASSETS.fetch(new Request(url, request));
    },
}
