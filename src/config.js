const HOST = 'novel.tigerkk.me';
const TITLE = '兽人控小说站';

const config = reactive({
    host: HOST,
    base: computed(() => `https://${config.host}`),
    title: TITLE,
    keywords: '兽人控,兽人小说,兽人漫画,兽人同人,兽人文学',
    description: '兽人控小说站是一个专为兽人控打造的聚合在线阅读平台。在这里，你可以找到各种平台各种兽人相关的小说，从兽人与人类的爱恨情仇，到兽人之间的种族斗争，从兽人的历史文化，到兽人的奇幻冒险，应有尽有。你可以随时随地享受阅读的乐趣，无需下载或安装任何软件。还可以自由切换翻译，选择你喜欢的阅读模式。',
});
export default config;
