<template>
	<template v-if="props.listStyle === 'style1'">
		<div v-if="!data.loading" ref="parent" class="h-full w-full flex-col">
			<div class="mb-4 flex flex-row flex-wrap items-center max-sm:justify-evenly">
				<template v-for="(item,idx) in data.items">
					<router-link
							class="m-2 flex h-auto select-none flex-col rounded-xl bg-gray-50 transition duration-300 w-[128px] group align-items-center sm:hover:-translate-y-2 sm:hover:scale-110 sm:hover:shadow-2xl sm:hover:z-40"
							:to="{name:'info',params:{ id:item.id }}" :draggable="false">
						<div class="relative flex w-32 flex-1 flex-col items-center justify-between overflow-hidden rounded-xl max-h-[178px] min-h-[178px] aspect-[10/16]">
							<img :alt="`${item.name}(cover)`" :draggable="false" :src="item.cover"
							     class="absolute h-full w-full object-cover aspect-[140/186]"/>
						</div>
						<div class="flex flex-col items-center justify-center m-2 transition duration-300 text-xs font-bold !line-clamp-1 h-[16px] leading-[16px]">
							{{ item.name }}
						</div>
						<div class="flex flex-col m-2 transition duration-300 text-xs !line-clamp-1 h-[16px]">
							{{ item.author.nickname }}
						</div>
						<div :class="{
                            'z-50 flex-col justify-between hidden group-hover:max-sm:hidden transition duration-300 w-0 rounded-xl bg-gray-50 p-5 text-sm group-hover:w-[256px] max-h-[242px] min-h-[242px] group-hover:fixed group-hover:flex group-hover:shadow-2xl':true,
                            'group-hover:ml-[128px]':(idx + 1) % perLineCount < dialogRightPerLineCount && (idx ) % perLineCount < dialogRightPerLineCount,
                            'group-hover:-ml-[256px]':(idx + 1) % perLineCount >= dialogRightPerLineCount || (idx) % perLineCount >= dialogRightPerLineCount,
						}" :data-idx="idx">
							<div class="mb-1">
								<div class="mb-1 font-bold">简介</div>
								<div v-if="item.desc.length > 0"
								     class="overflow-hidden whitespace-pre-line h-[80px] line-clamp-[4]"
								     v-html="item.desc">
								</div>
								<div v-else class="overflow-hidden whitespace-pre-line h-[80px] line-clamp-[4]">无
								</div>
							</div>
							<div class="overflow-hidden flex1">
								<div class="mb-1 font-bold">标签</div>
								<div class="flex flex-wrap overflow-hidden max-h-[65px]">
									<div v-for="tag in item.tags"
									     class="mr-1 mb-1 w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 text-xs leading-6 text-slate-700 py-0.5">
										{{ tag }}
									</div>
								</div>
							</div>
						</div>
					</router-link>
				</template>
			</div>
		</div>
		<div v-if="data.loading" ref="parent" class="h-full w-full flex-col">
			<div class="mb-4 flex flex-row flex-wrap items-center max-sm:justify-evenly">
				<template v-for="idx in 20">
					<div class="m-2 flex h-auto select-none flex-col rounded-xl border-gray-50 border-2 transition duration-300 w-[128px] group align-items-center sm:hover:-translate-y-2 sm:hover:scale-110 sm:hover:shadow-2xl sm:hover:z-40">
						<div class="relative flex w-32 flex-1 flex-col items-center justify-between overflow-hidden rounded-xl max-h-[178px] min-h-[178px] aspect-[10/16]">
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
					<router-link :to="{name:'info',params:{ id:item.id }}" :draggable="false"
					             class="m-2 flex h-auto w-full select-none flex-row rounded-xl bg-gray-50 transition duration-300 group align-items-center sm:hover:shadow-2xl sm:hover:z-40">
						<div class="relative flex w-32 flex-col items-center justify-between overflow-hidden rounded-xl max-sm:hidden max-h-[178px] min-h-[178px] aspect-[10/16]">
							<img :alt="`${item.name}(cover)`" :draggable="false" :src="item.cover"
							     class="absolute h-full w-full object-cover aspect-[140/186]"/>
						</div>
						<div class="flex flex-1 flex-col p-2">
							<div class="flex max-sm:flex-col">
								<div class="flex justify-center m-2 transition duration-300 text-lg font-bold !line-clamp-1 h-[16px] leading-[16px]">
									{{ item.name }}
								</div>
								<div class="flex sm:m-2 max-sm:mx-2 transition duration-300 text-xs !line-clamp-1 h-[16px]">
									作者：{{ item.author.nickname }}
								</div>
							</div>
							<div class="flex flex-1 flex-col justify-between p-2">
								<div class="mb-1">
									<div v-if="item.desc.length > 0"
									     class="overflow-hidden whitespace-pre-line line-clamp-[2]"
									     v-html="item.desc">
									</div>
									<div v-else class="overflow-hidden whitespace-pre-line line-clamp-[2]">
										无
									</div>
								</div>
								<div class="overflow-hidden flex1">
									<div class="flex flex-wrap overflow-hidden max-h-[65px]">
										<div v-for="tag in item.tags"
										     class="mr-1 mb-1 w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 text-xs leading-6 text-slate-700 py-0.5">
											{{ tag }}
										</div>
									</div>
								</div>
							</div>
						</div>
					</router-link>
				</template>
			</div>
		</div>
		<div v-if="data.loading" ref="parent" class="h-full w-full flex-col">
			<div class="mb-4 flex flex-row flex-wrap items-center max-sm:justify-center">
				<template v-for="idx in 20">
					<div class="m-2 flex h-auto w-full select-none flex-row rounded-xl bg-white border-gray-50 border-2 transition duration-300 group align-items-center sm:hover:shadow-2xl sm:hover:z-40">
						<div class="relative flex w-32 flex-col items-center justify-between overflow-hidden rounded-xl max-sm:hidden max-h-[178px] min-h-[178px] aspect-[10/16]">
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
        default: null,
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

const hateTags = computed(() => configProvider.hateTags);
const tags = computed(() => (configProvider?.tags || []).concat(props.tags || []));


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
    data.items = res.data;
    data.page = res.page;
    data.maxPage = res.maxPage;
}).catch(() => {
    data.loading = true;
    return loadData().then((res) => {
        data.items = res.data;
        data.page = res.page;
        data.maxPage = res.maxPage;
    });
});

onServerPrefetch(() => {
    return loadData().then((res) => {
        provideServerData({
            reqId: ssrId,
            data: res,
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
        hate_tags: props.applyFilter ? hateTags.value : null,
    };
    return loadNovels({params, ignoreReq: import.meta.env.SSR}).then((res) => {
        data.loading = false;
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
        data.items = res.data;
        data.page = res.page;
        data.maxPage = res.maxPage;
    });
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
            data.items = res.data;
            data.page = res.page;
            data.maxPage = res.maxPage;
        });
    },
});
</script>

<style scoped>
</style>
