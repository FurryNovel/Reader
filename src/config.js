const HOST = 'www.furrynovel.com';
const TITLE = '兽人控小说站';

const config = reactive({
    host: HOST,
    base: computed(() => `https://${config.host}`),
    api: `https://api.furrynovel.com/api`,
    title: TITLE,
    keywords: '兽人控, 兽人小说, 兽人同人, 兽人文学, 兽人同人小说, 兽人同人站, 福瑞控, 福瑞控小说, 福瑞控文学, 虎兽人小说, 龙兽人小说, 狼兽人小说, 熊兽人小说',
    description: '兽人控小说站是一个专为兽人控打造的聚合在线阅读平台。在这里，你可以找到各种平台各种兽人相关的小说，从兽人与人类的爱恨情仇，到兽人之间的种族斗争，从兽人的历史文化，到兽人的奇幻冒险，应有尽有。你可以随时随地享受阅读的乐趣，无需下载或安装任何软件。还可以自由切换翻译，选择你喜欢的阅读模式。',
    links: [
        {
            logo: '/static/fec.png',
            link: 'https://www.furrycons.cn/',
            name: 'FEC·兽展日历',
            desc: 'FEC·兽展日历致力于为您提供最新最全的位于中国大陆境内的兽展相关资讯整合，来这里寻找感兴趣的展会，叫上朋友一起来玩吧！'
        },
    ],
});
export default config;
