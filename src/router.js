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
import Error from "@/pages/Error.vue";
import {getFallbackLocale, supportedLocales, useI18n} from "@/i18n/index.js";

const items = [
    {
        path: '/',
        redirect: to => {
            // const [locale] =  navigator.language.split('-');
            // if(supportedLocales.hasOwnProperty(locale)){
            //     return `/${locale}`;
            // }
            const locale = getFallbackLocale();
            return `/${locale}`;
        },
        meta: {
            layout: {
                showInNavBar: false,
            },
        },
    },
    {
        path: '/:lang',
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
        path: '/:lang/novel',
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
        path: '/:lang/bookmark',
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
        path: '/:lang/about',
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
        path: '/:lang/settings',
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
        path: '/:lang/search',
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
        path: '/:lang/novel/:id(\\d+)',
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
    {
        path: '/:pathMatch(.*)',
        component: Error,
        meta: {
            title: '页面未找到',
            layout: {
                showInNavBar: false,
            },
        },
    },
].map((item) => {
    return Object.assign(item, {
        isActive(router) {
            return router?.currentRoute?.value?.name === item?.name;
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
        scrollBehavior(to, from, savedPosition) {
            if (savedPosition) {
                return savedPosition
            } else {
                if (to.hash) {
                    return {
                        el: to.hash,
                        behavior: 'smooth',
                    }
                }
                return {
                    top: 0,
                    behavior: 'smooth',
                }
            }
        },
    });
}
