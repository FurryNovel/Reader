import {
    createMemoryHistory,
    createRouter as _createRouter,
    createWebHistory,
} from 'vue-router';

import Index from './pages/index.vue';
import Novel from './pages/info.vue';
import Chapter from './pages/chapter.vue';
import List from './pages/list.vue';
import Bookmark from './pages/bookmark.vue';
import About from './pages/about.vue';
import Settings from './pages/settings.vue';


const items = [
    {
        path: '/',
        alias: '/index',
        name: 'index',
        component: Index,
        meta: {
            title: '主页',
            icon: {
                "text": "fa-regular fa-mobile",
                "selectedText": "fa-regular fa-mobile",
            },
            layout: {
                showInNavBar: true,
            },
        },
    },
    {
        path: '/novel',
        name: 'list',
        component: List,
        props: {
            mode: 'list',
        },
        meta: {
            title: '书库',
            icon: {
                "text": "fa-regular fa-book-bookmark",
                "selectedText": "fa-regular fa-book-bookmark",
            },
            layout: {
                showInNavBar: true,
            },
        },
    },
    {
        path: '/bookmark',
        name: 'bookmark',
        component: Bookmark,
        meta: {
            title: '书架',
            icon: {
                "text": "fa-regular fa-star",
                "selectedText": "fa-regular fa-star",
            },
            layout: {
                showInNavBar: true,
            },
        },
    },
    {
        path: '/about',
        name: 'about',
        component: About,
        meta: {
            title: '关于',
            icon: {
                "text": "fa-regular fa-circle-info",
                "selectedText": "fa-regular fa-circle-info",
            },
            layout: {
                showInNavBar: true,
            },
        },
    },
    {
        path: '/settings',
        name: 'settings',
        component: Settings,
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
        component: List,
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
                component: Chapter,
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
                component: Novel,
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
