<template>
	<template v-if="props.listStyle === 'style1'">
		<div v-if="!data.loading" ref="parent" class="h-full w-full flex-col">
			<div class="mb-4 flex flex-row flex-wrap items-center max-sm:justify-evenly">
				<template v-for="(item,idx) in data.items" :key="item.id">
					<div class="relative flex h-auto group">
						<ClientOnly>
							<div v-if="item.local_status && item.local_status !== true"
							     @click="onClickBlurContent(item, isMobile)"
							     class="absolute top-0 left-0 z-40 m-2 flex select-none flex-col justify-center rounded-lg bg-transparent/5 transition duration-300 max-h-[242px] min-h-[242px] align-items-center sm:group-hover:-translate-y-2 sm:group-hover:scale-110 sm:group-hover:shadow-2xl sm:group-hover:z-50">
								<div class="z-30 w-full flex-1 rounded-lg backdrop-blur">
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								</div>
								<div v-if="props.desc" :class="{
                            'z-51 flex-col justify-center hidden group-hover:max-sm:hidden transition duration-300 w-0 rounded-xl backdrop-blur p-5 text-sm group-hover:w-[256px] max-h-[242px] min-h-[242px] group-hover:fixed group-hover:flex group-hover:shadow-2xl dark:text-white':true,
                            'group-hover:ml-[128px]':(idx + 1) % perLineCount < dialogRightPerLineCount && (idx ) % perLineCount < dialogRightPerLineCount,
                            'group-hover:-ml-[256px]':(idx + 1) % perLineCount >= dialogRightPerLineCount || (idx) % perLineCount >= dialogRightPerLineCount,
						}" :data-idx="idx">
									<p class="text-center text-xs text-gray-700 dark:text-white"
									   v-html="convertLocalStatusToMessage(item?.local_status)"></p>
									<div class="flex items-center justify-center px-5 py-3">
										<Button class="w-32 font-bold text-primary-500 dark:text-white" size="small"
										        @click="item.local_status = true;">
											{{ t('显示') }}
										</Button>
									</div>
								</div>
							</div>
						</ClientOnly>
						<router-link
								class="top-0 left-0 m-2 flex h-auto select-none flex-col rounded-xl bg-gray-50 transition duration-300 w-[128px] align-items-center sm:group-hover:-translate-y-2 sm:group-hover:scale-110 sm:group-hover:shadow-2xl sm:group-hover:z-[41] dark:bg-surface-500 dark:text-white"
								:to="{name:'info',params:{ id:item.id }}" :draggable="false">
							<div v-if="props.image"
							     class="relative flex w-32 flex-1 flex-col items-center justify-between overflow-hidden rounded-xl max-h-[178px] min-h-[178px] aspect-[10/16]">
								<img :alt="`${item.name}(cover)`" :draggable="false" :src="item.cover" loading="lazy"
								     class="absolute h-full w-full object-cover aspect-[140/186]"/>
							</div>
							<div class="flex flex-col items-center justify-center m-2 transition duration-300 text-xs font-bold !line-clamp-1 h-[16px] leading-[16px]">
								{{ item.name }}
							</div>
							<div v-if="props.author"
							     class="flex flex-col m-2 transition duration-300 text-xs !line-clamp-1 h-[16px]">
								{{ item.author.nickname }}
							</div>
							<div v-if="props.desc" :class="{
                            'z-50 flex-col justify-between hidden group-hover:max-sm:hidden transition duration-300 w-0 rounded-xl bg-gray-50 p-5 text-sm group-hover:w-[256px] max-h-[242px] min-h-[242px] group-hover:fixed group-hover:flex group-hover:shadow-2xl dark:bg-surface-500 dark:text-white':true,
                            'group-hover:ml-[128px]':(idx + 1) % perLineCount < dialogRightPerLineCount && (idx ) % perLineCount < dialogRightPerLineCount,
                            'group-hover:-ml-[256px]':(idx + 1) % perLineCount >= dialogRightPerLineCount || (idx) % perLineCount >= dialogRightPerLineCount,
						}" :data-idx="idx">
								<div class="mb-1">
									<div class="mb-1 font-bold">{{ t('简介') }}</div>
									<div v-if="item.desc.length > 0" v-safe-html="item.desc"
									     class="overflow-hidden whitespace-pre-line h-[80px] line-clamp-[4]">
									</div>
									<div v-else class="overflow-hidden whitespace-pre-line h-[80px] line-clamp-[4]">
										{{ t('无') }}
									</div>
								</div>
								<div class="overflow-hidden flex1">
									<div class="mb-1 font-bold">{{ t('标签') }}</div>
									<div class="flex flex-wrap gap-1 overflow-hidden max-h-[63px]">
										<div v-for="tag in item.tags"
										     class="mr-1 mb-1 w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 text-xs leading-6 text-slate-700 py-0.5 dark:bg-surface-400 dark:text-white">
											{{ tag }}
										</div>
									</div>
								</div>
							</div>
						</router-link>
					</div>
				</template>
			</div>
		</div>
		<div v-else ref="parent" class="h-full w-full flex-col">
			<div class="mb-4 flex flex-row flex-wrap items-center max-sm:justify-evenly">
				<template v-for="idx in props.limit">
					<div class="m-2 flex h-auto select-none flex-col rounded-xl transition duration-300 w-[128px] group align-items-center sm:hover:-translate-y-2 sm:hover:scale-110 sm:hover:shadow-2xl sm:hover:z-40 dark:bg-surface-500 dark:text-white">
						<div v-if="props.image"
						     class="relative flex w-32 flex-1 flex-col items-center justify-between overflow-hidden rounded-xl max-h-[178px] min-h-[178px] aspect-[10/16]">
							<Skeleton borderRadius="10px" class="absolute h-full w-full object-cover aspect-[140/186]"
							          height="100%"
							          width="100%"></Skeleton>
						</div>
						<Skeleton
								class="flex flex-col ml-1 mt-2 transition duration-300 text-xs !line-clamp-1"
								height="16px"
								width="50%"></Skeleton>
						<Skeleton height="16px"
						          width="70%"
						          class="flex flex-col ml-1 mt-2 mb-2 transition duration-300 text-xs !line-clamp-1">
						</Skeleton>
					</div>
				</template>
			</div>
		</div>
	</template>
	<template v-if="props.listStyle === 'style2'">
		<div v-if="!data.loading" ref="parent" class="h-full w-full flex-col">
			<div class="mb-4 flex flex-row flex-wrap items-center max-sm:justify-center">
				<template v-for="(item,idx) in data.items">
					<div class="relative flex h-auto w-full flex-col group">
						<ClientOnly>
							<div v-if="item.local_status && item.local_status !== true"
							     class="absolute top-0 right-0 bottom-0 left-0 m-2 flex flex-1 rounded-xl bg-transparent/5 z-[41]">
								<div class="z-30 flex h-full flex-1 flex-col items-center justify-center gap-3 rounded-lg backdrop-blur">
									<p class="text-center text-xs text-gray-700 dark:text-white"
									   v-html="convertLocalStatusToMessage(item?.local_status)"></p>
									<Button class="w-32 font-bold text-primary-500 dark:text-white" size="small"
									        @click="item.local_status = true;">
										{{ t('显示') }}
									</Button>
								</div>
							</div>
						</ClientOnly>
						<router-link :to="{name:'info',params:{ id:item.id }}" :draggable="false"
						             class="m-2 flex h-auto flex-1 select-none flex-row overflow-hidden rounded-xl bg-gray-50 transition duration-300 align-items-center sm:group-hover:shadow-2xl sm:group-hover:z-40 dark:bg-surface-500 dark:text-white">
							<div v-if="props.image"
							     class="relative flex w-32 flex-col items-center justify-between overflow-hidden rounded-xl max-sm:hidden max-h-[178px] min-h-[178px] aspect-[10/16]">
								<img :src="item.cover" :alt="`${item.name}(cover)`" :draggable="false" loading="lazy"
								     class="absolute h-full w-full object-cover aspect-[140/186]"/>
							</div>
							<div class="flex flex-1 flex-col gap-2 px-4 py-2">
								<div class="flex flex-col justify-start gap-2">
									<div class="flex justify-center transition duration-300 text-lg font-bold !line-clamp-1 h-[20px] leading-[20px]">
										{{ item.name }}
									</div>
									<div v-if="props.author"
									     class="flex transition duration-300 text-xs !line-clamp-1 h-[16px]">
										{{ t('作者：%s', item.author.nickname) }}
									</div>
								</div>
								<div class="flex flex-1 flex-col justify-between gap-1">
									<div v-if="props.desc" class="mb-1 text-xs">
										<div v-if="item.desc.length > 0"
										     class="overflow-hidden whitespace-pre-line text-sm line-clamp-[2]"
										     v-safe-html="item.desc">
										</div>
										<div v-else class="overflow-hidden whitespace-pre-line line-clamp-[2]">
											{{ t('无') }}
										</div>
									</div>
									<div v-if="props.withChapters" class="mb-1">
										<div v-if="item.latest_chapters && item.latest_chapters.length > 0"
										     class="overflow-hidden whitespace-pre-line rounded-lg bg-slate-100 px-2 text-xs leading-6 text-slate-700 line-clamp-[2] dark:bg-surface-400 dark:text-white">
											{{ t('最新章节：%s', item.latest_chapters[0].name) }}
										</div>
									</div>
									<div v-if="props.desc" class="overflow-hidden flex1">
										<div class="flex flex-wrap gap-1 overflow-hidden max-h-[65px]">
											<div v-for="tag in item.tags"
											     class="mr-1 mb-1 w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 text-xs leading-6 text-slate-700 py-0.5 dark:bg-surface-400 dark:text-white">
												{{ tag }}
											</div>
										</div>
									</div>
								</div>
							</div>
						</router-link>
					</div>
				</template>
			</div>
		</div>
		<div v-else ref="parent" class="h-full w-full flex-col">
			<div class="mb-4 flex flex-row flex-wrap items-center max-sm:justify-center">
				<template v-for="idx in props.limit">
					<div class="m-2 flex h-auto w-full select-none flex-row rounded-xl bg-white transition duration-300 group align-items-center sm:hover:shadow-2xl sm:hover:z-40 dark:bg-surface-500 dark:text-white">
						<div v-if="props.image"
						     class="relative flex w-32 flex-col items-center justify-between overflow-hidden rounded-xl max-sm:hidden max-h-[178px] min-h-[178px] aspect-[10/16]">
							<Skeleton borderRadius="10px" class="absolute h-full w-full object-cover aspect-[140/186]"
							          height="100%"
							          width="100%"></Skeleton>
						</div>
						<div class="flex flex-1 flex-col p-2">
							<div class="flex max-sm:flex-col">
								<Skeleton borderRadius="10px"
								          class="flex justify-center m-2 transition duration-300 text-lg font-bold !line-clamp-1 h-[16px] leading-[16px]"
								          width="60px"></Skeleton>
								<Skeleton
										class="flex sm:m-2 max-sm:mx-2 transition duration-300 text-xs !line-clamp-1 h-[16px]"
										width="60px"></Skeleton>
							</div>
							<div class="flex flex-1 flex-col justify-between p-2">
								<div class="mb-1">
									<Skeleton class="overflow-hidden whitespace-pre-line line-clamp-[2]"
									          width="200px"></Skeleton>
								</div>
								<div class="overflow-hidden flex1">
									<div class="flex flex-wrap overflow-hidden max-h-[65px]">
										<Skeleton
												class="mr-1 mb-1 w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 text-xs leading-6 text-slate-700 py-0.5"
												width="40px"></Skeleton>
										<Skeleton
												class="mr-1 mb-1 w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 text-xs leading-6 text-slate-700 py-0.5"
												width="40px"></Skeleton>
										<Skeleton
												class="mr-1 mb-1 w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 text-xs leading-6 text-slate-700 py-0.5"
												width="40px"></Skeleton>
										<Skeleton
												class="mr-1 mb-1 w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 text-xs leading-6 text-slate-700 py-0.5"
												width="40px"></Skeleton>
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>
			</div>
		</div>
	</template>
	<template v-if="props.showPagination">
		<Paginator :rows="15" :rowsPerPageOptions="null" :totalRecords="data.maxPage * 15"
		           @page="onChangePage"></Paginator>
	</template>
</template>

<script setup>
import Skeleton from 'primevue/skeleton';
import {loadNovels} from "@/api/novels.js";
import {useConfigProvider} from "@/provider/config.js";
import {onServerData, provideServerData} from "@/utils/ssr.js";
import {useId} from "vue-unique-ssr-id";
import {useI18n} from "@/i18n/index.js";
import {isMobile} from "@/utils/device.js";
import dialog from "@/utils/dialog.js";

const {t, locale, _t} = useI18n();
const ssrId = useId();
const parent = ref(null);

const configProvider = useConfigProvider();

const props = defineProps({
    type: {
        type: String,
        default: 'latest',
    },
    order: {
        type: String,
        default: 'desc',
        validator(value) {
            return ['desc', 'asc'].includes(value);
        },
    },
    listStyle: {
        type: String,
        default: 'style1',
    },
    desc: {
        type: Boolean,
        default: true,
    },
    image: {
        type: Boolean,
        default: true,
    },
    author: {
        type: Boolean,
        default: true,
    },
    tags: {
        type: Array,
        default: null,
    },
    userId: {
        default: null,
    },
    keyword: {
        default: null,
    },
    ids: {
        default: null,
    },
    withChapters: {
        type: Boolean,
        default: false,
    },
    applyFilter: {
        type: Boolean,
        default: true,
    },
    limit: {
        default: 15,
    },
    showPagination: {
        type: Boolean,
        default: false,
    },
});

const data = reactive({
    page: 1,
    maxPage: 1,
    items: [],
    //status
    loading: false,
    //device
    clientWidth: 0,
});

const isMounted = ref(false);

const hateTags = computed(() => configProvider.getHateTags());
const tags = computed(() => (configProvider.getTags() || []).concat(props.tags || []));


const perLineCount = computed(() => {
    const width = data.clientWidth;
    if (width) {
        return Math.floor((width - 80) / 128);
    }
    return 8;
});
const dialogRightPerLineCount = computed(() => {
    const width = data.clientWidth;
    if (width) {
        let count = Math.floor((width - 80) / 128);
        if (width % 128 < 256) {
            count -= 1;
        }
        return count;
    }
    return 8;
});

onServerData((res) => {
    data.items = filterNovels(res.data);
    data.page = res.page;
    data.maxPage = res.maxPage;
    if (configProvider?.filter?.strictMode) {
        return Promise.reject();
    }
}).catch(() => {
    data.loading = true;
    return loadData().then((res) => {
        data.items = filterNovels(res.data);
        data.page = res.page;
        data.maxPage = res.maxPage;
    });
});

onServerPrefetch(() => {
    const instance = getCurrentInstance();
    return loadData().then((res) => {
        provideServerData({
            reqId: ssrId,
            data: res,
            instance: instance,
        });
        data.items = res.data;
        data.page = res.page;
        data.maxPage = res.maxPage;
    }).catch(err => {
        console.log(err)
    });
});

const resize = () => {
    data.clientWidth = parent.value?.clientWidth;
};

onMounted(() => {
    isMounted.value = true;
    window.addEventListener('resize', resize);
    resize();
});

onUnmounted(() => {
    window.removeEventListener('resize', resize);
});

function loadData() {
    const params = {
        page: data.page,
        order_by: props.type,
        order: props.order,
        user_id: props.userId,
        keyword: props.keyword,
        ids: props.ids,
        with_chapters: props.withChapters,
        tags: props.applyFilter ? tags.value : props.tags,
        hate_tags: (props.applyFilter && !import.meta.env.SSR) ? hateTags.value : null,
        limit: props.limit,
    };
    return loadNovels({
        params,
        ignoreReq: import.meta.env.SSR,
        lang: locale(),
    }).then((res) => {
        nextTick(() => {
            data.loading = false;
        });
        return {
            data: res.data,
            page: res.page,
            maxPage: Math.ceil(res.total / res.pageSize),
        };
    });
}

function onChangePage({page}) {
    data.loading = true;
    data.page = page + 1;
    scrollToTop();
    loadData().then((res) => {
        data.items = filterNovels(res.data);
        data.page = res.page;
        data.maxPage = res.maxPage;
    });
}

function convertLocalStatusToMessage(status) {
    let content = '';
    switch (status) {
        case 'language':
            content = t('已根据您的语言设置隐藏该内容。');
            break;
        case 'user':
            content = t('已根据您的偏好设置隐藏该内容。');
            break;
        case 'r18':
            content = t('已根据您的安全模式设置隐藏该内容。');
            break;
        case true:
            return '';
        default:
            content = '';
    }
    content += (content ? '<br>' : '') + t('您可以在设置中修改内容过滤。');
    return content;
}

function onClickBlurContent(item, showAlert) {
    if (showAlert) {
        dialog.alert({
            title: t('提示'),
            content: convertLocalStatusToMessage(item.local_status),
            confirmBtn: t('显示'),
            cancelBtn: t('取消'),
        }).then(() => {
            item.local_status = true
        }).catch(() => {
        
        })
    }
}

function scrollToTop() {
    if (import.meta.env.SSR) return;
    window.scroll({
        top: 0,
        behavior: 'smooth'
    });
}

defineExpose({
    reload() {
        data.loading = true;
        loadData().then((res) => {
            data.items = filterNovels(res.data);
            data.page = res.page;
            data.maxPage = res.maxPage;
        });
    },
});


function filterNovels(items) {
    return items.map(item => {
        item.local_status = configProvider.checkTagsHideStatus(item.tags, _t);
        return item;
    });
}
</script>

<style scoped>
</style>
