import App from './App.vue';
import {createSSRApp} from 'vue';
import {createRouter} from './router';
import "./assets/main.css";

export function createApp() {
    const app = createSSRApp(App);
    const router = createRouter();
    app.use(router);
    return {app, router};
}
