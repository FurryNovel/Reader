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
    append: {},
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
        data.append = {};
    });
    useHead({
        title: computed(() => {
            return `${t(data.title)} - ${t(config.title)}`;
        }),
        meta: computed(() => {
            return Object.entries({
                'description': t(data.description),
                'keywords': t(data.keywords) + ', ' + t(computeParams.value.keywords),
                'og:site_name': t(config.title),
                'og:title': t(data.title),
                'og:description': t(data.description),
                'og:image': data.image,
                'og:url': data.url,
                ...data.append,
            }).map(([name, content]) => {
                return {
                    name,
                    content,
                };
            }).concat([
                {
                    'http-equiv': 'content-language',
                    content: locale(),
                },
            ]);
        }),
        link: computed(() => {
            let _locale = locale();
            return Object.values(supportedLocales).map(locale => {
                return {
                    rel: 'alternate',
                    href: data.url.replace(`/${_locale}`, `/${locale.id}`),
                    hreflang: locale.id,
                };
            });
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
    data.append = params.append ? params.append : {};
}
