
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if (url.pathname.startsWith('/api/')) {
            request.url = env.API_URL + url.pathname;
            return fetch(request);
        }
        return env.ASSETS.fetch(request);
    },
}
