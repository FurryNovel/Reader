import {useHead} from "@unhead/vue";
import config from "@/config.js";
import iconUrl from '/static/icon.png?url';

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

export function initRouter(router) {
    data.route = router.currentRoute.value;
    router.afterEach((to) => {
        data.route = to;
        data.title = computeParams.value.title;
        data.keywords = computeParams.value.keywords;
        data.description = computeParams.value.description;
        data.image = computeParams.value.image ? computeParams.value.image : iconUrl;
        data.url = computeParams.value.url ? computeParams.value.url : `${config.base}${data.route?.path || ''}`;
    });
    useHead({
        title: computed(() => {
            console.log(data.title)
            return data.title;
        }),
        meta: computed(() => {
            return [
                {
                    name: 'description',
                    content: data.description,
                },
                {
                    name: 'keywords',
                    content: data.keywords,
                },
                {
                    name: 'og:title',
                    content: data.title,
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
    });
}

export function useMeta(params) {
    if (params === undefined) {
        return;
    }
    if (isRef(params)) {
        watchEffect(() => {
            useMeta(params.value);
        });
    } else {
        data.title = params.title ? params.title : config.title;
        data.keywords = params.keywords ? params.keywords : config.keywords;
        data.description = params.description ? params.description : config.description;
        data.image = params.image ? params.image : iconUrl;
        data.url = params.url ? params.url : `${config.base}${data.route?.path || ''}`;
    }
}
