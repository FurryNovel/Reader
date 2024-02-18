import {createApp} from './main.js';

const {app, router} = await createApp();

router.isReady().then(() => {
    app.mount('#app');
});
