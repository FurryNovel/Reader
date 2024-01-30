import {createApp} from './main.js';
import {renderToString} from 'vue/server-renderer';

export async function render(url) {
    const {app, router} = createApp();
    
    // noinspection ES6MissingAwait
    router.push(url);
    await router.isReady();

    const ctx = {};
    const html = await renderToString(app, ctx);
    return {html};
}
