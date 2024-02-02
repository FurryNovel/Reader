const HOST = 'novel.tigerkk.me';
const TITLE = '兽人控小说站';

const config = reactive({
    host: HOST,
    base: computed(() => `https://${config.host}`),
    title: TITLE,
});
export default config;
