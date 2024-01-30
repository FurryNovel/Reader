import {createApp} from './main.js';

const {app, router} = createApp();

router.isReady().then(() => {
    app.mount('#app');
});
