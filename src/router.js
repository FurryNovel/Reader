import {
    createMemoryHistory,
    createRouter as _createRouter,
    createWebHistory,
} from 'vue-router';
const items = [
    {
        path: '/',
        alias: '/index',
        name: 'index',
        component: () => import('./pages/index.vue'),
        showNav: true,
        meta: {
            title: '主页',
            icon: {
                "text": "\uf3ce",
                "selectedText": "\uf3ce",
                "fontSize": "18px",
                "color": "#2B2E3D",
                "selectedColor": "#008AFF",
            },
        },
    },
    {
        path: '/bookmark',
        name: 'bookmark',
        component: () => import('./pages/bookmark.vue'),
        showNav: true,
        meta: {
            title: '书架',
            icon: {
                "text": "\ue0bb",
                "selectedText": "\ue0bb",
                "fontSize": "18px",
                "color": "#2B2E3D",
                "selectedColor": "#008AFF",
            },
        },
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('./pages/about.vue'),
        showNav: true,
        meta: {
            title: '关于',
            icon: {
                "text": "\uf05a",
                "selectedText": "\uf05a",
                "fontSize": "18px",
                "color": "#2B2E3D",
                "selectedColor": "#008AFF",
            },
        },
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('./pages/about.vue'),
        showNav: false,
        meta: {
            title: '设置',
        },
    },
].map((item) => {
    return Object.assign(item, {
        isActive (router){
            return router?.currentRoute?.value?.path === item?.path;
        }
    });
});

export const routes = items;

export function createRouter() {
    return _createRouter({
        history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
        routes: items,
    });
}
