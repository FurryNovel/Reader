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
        meta: {
            title: '主页',
            icon: {
                "text": "\uf3ce",
                "selectedText": "\uf3ce",
            },
            layout: {
                showInNavBar: true,
            },
        },
    },
    {
        path: '/novel',
        name: 'list',
        component: () => import('./pages/list.vue'),
        props: {
            mode: 'list',
        },
        meta: {
            title: '书库',
            icon: {
                "text": "\ue0bb",
                "selectedText": "\ue0bb",
            },
            layout: {
                showInNavBar: true,
            },
        },
    },
    {
        path: '/bookmark',
        name: 'bookmark',
        component: () => import('./pages/bookmark.vue'),
        meta: {
            title: '书架',
            icon: {
                "text": "\uf005",
                "selectedText": "\uf005",
            },
            layout: {
                showInNavBar: true,
            },
        },
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('./pages/about.vue'),
        meta: {
            title: '关于',
            icon: {
                "text": "\uf05a",
                "selectedText": "\uf05a",
            },
            layout: {
                showInNavBar: true,
            },
        },
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('./pages/settings.vue'),
        meta: {
            title: '设置',
            layout: {
                showInNavBar: false,
            },
        },
    },
    {
        path: '/search',
        name: 'search',
        component: () => import('./pages/list.vue'),
        props: {
            mode: 'search'
        },
        meta: {
            title: '搜索',
            layout: {
                showInNavBar: false,
            },
        },
    },
    {
        path: '/novel/:id(\\d+)',
        meta: {
            layout: {
                showInNavBar: false,
            },
        },
        children: [
            {
                path: 'chapter/:cid(\\d+)',
                name: 'chapter',
                component: () => import('./pages/chapter.vue'),
                props: {},
                meta: {
                    title: '章节',
                    style: {
                        navBar: '',
                    },
                    layout: {
                        showInNavBar: false,
                        navBar: false,
                    },
                },
            },
            {
                path: '',
                name: 'info',
                component: () => import('./pages/info.vue'),
                props: {},
                meta: {
                    title: '小说详情',
                    layout: {
                        showInNavBar: false,
                    },
                },
            }
        ],
    },
].map((item) => {
    return Object.assign(item, {
        isActive(router) {
            return router?.currentRoute?.value?.path === item?.path;
        },
        meta: {
            ...item.meta,
        },
    });
});

export const routes = items;

export function createRouter() {
    return _createRouter({
        history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
        routes: items,
    });
}
