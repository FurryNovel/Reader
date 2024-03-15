import {useHead} from "@unhead/vue";
import config from "@/config.js";
import iconUrl from '/static/icon.png?url';
import {getLocale, supportedLocales, useI18n} from "@/i18n/index.js";

const data = reactive({
    route: null,
    title: null,
    keywords: null,
    description: null,
    image: null,
    url: null,
});

const computeParams = computed(() => {
    return {
        title: config.title,
        keywords: config.keywords,
        description: config.description,
        image: iconUrl,
        ...data.route?.meta,
    };
});

function initParams(route) {
    data.route = route.value;
    watchEffect(() => {
        data.title = computeParams.value.title;
        data.keywords = computeParams.value.keywords;
        data.description = computeParams.value.description;
        data.image = computeParams.value.image ? computeParams.value.image : iconUrl;
        data.url = computeParams.value.url ? computeParams.value.url : `${config.base}${data.route?.path || ''}`;
    });
}

export function initMeta(router) {
    const {t, locale} = useI18n(router);
    initParams(router.currentRoute);
    router.afterEach((to) => {
        data.route = to;
    });
    useHead({
        title: computed(() => {
            return `${t(data.title)} - ${t(config.title)}`;
        }),
        meta: computed(() => {
            return [
                {
                    name: 'description',
                    content: t(data.description),
                },
                {
                    name: 'keywords',
                    content: t(data.keywords),
                },
                {
                    name: 'og:site_name',
                    content: t(config.title),
                },
                {
                    name: 'og:title',
                    content: t(data.title),
                },
                {
                    name: 'og:description',
                    content: data.description,
                },
                {
                    name: 'og:image',
                    content: data.image,
                },
                {
                    name: 'og:url',
                    content: data.url
                },
            ];
        }),
        link: computed(() => {
            let _locale = locale();
            return Object.values(supportedLocales).map(locale => {
                return {
                    rel: 'alternate',
                    href: data.url.replace(`/${_locale}`, `/${locale.id}`),
                    hreflang: locale.id,
                };
            })
        }),
    });
}

export function useMeta(params) {
    if (params === undefined) {
        return;
    }
    if (isRef(params)) {
        params = params?.value ?? {};
    }
    data.title = params.title ? params.title : config.title;
    data.keywords = params.keywords ? params.keywords : config.keywords;
    data.description = params.description ? params.description : config.description;
    data.image = params.image ? params.image : iconUrl;
    data.url = params.url ? params.url : `${config.base}${data.route?.path || ''}`;
}
