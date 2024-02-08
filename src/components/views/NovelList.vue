<template>
	<template v-if="props.listStyle === 'style1'">
		<div v-if="!data.loading" ref="parent" class="h-full w-full flex-col border-1 surface-border border-round">
			<div class="mb-4 flex flex-row flex-wrap items-center max-sm:justify-center">
				<template v-for="(item,idx) in data.items">
					<div class="m-2 flex h-auto select-none flex-col rounded-xl bg-gray-50 transition duration-300 w-[128px] group align-items-center sm:hover:-translate-y-2 sm:hover:scale-110 sm:hover:shadow-2xl sm:hover:z-40">
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
                            'group-hover:ml-[128px]':perLine !== idx + 1,
                            'group-hover:-ml-[256px]':perLine === idx + 1,
						}" :data-idx="idx">
							<div class="mb-1">
								<div class="mb-1 font-bold">简介</div>
								<div v-if="item.desc.length > 0"
								     class="overflow-hidden whitespace-pre-line h-[80px] line-clamp-[4]"
								     v-html="item.desc">
								</div>
								<div v-else class="overflow-hidden whitespace-pre-line h-[80px] line-clamp-[4]">无</div>
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
					</div>
				</template>
			</div>
		</div>
	</template>
	<template v-if="props.listStyle === 'style2'">
		<div v-if="!data.loading" ref="parent" class="h-full w-full flex-col border-1 surface-border border-round">
			<div class="mb-4 flex flex-row flex-wrap items-center max-sm:justify-center">
				<template v-for="(item,idx) in data.items">
					<div class="m-2 flex h-auto select-none flex-row rounded-xl bg-gray-50 transition duration-300 w-full group align-items-center sm:hover:shadow-2xl sm:hover:z-40">
						<div class="relative max-sm:hidden flex w-32 flex-col items-center justify-between overflow-hidden rounded-xl max-h-[178px] min-h-[178px] aspect-[10/16]">
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
							<div class="flex-1 flex flex-col justify-between p-2">
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
					</div>
				</template>
			</div>
		</div>
	</template>
</template>

<script setup>
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
    loading: false,
});

const isMounted = ref(false);

const hateTags = computed(() => configProvider.hateTags);
const tags = computed(() => (configProvider?.tags || []).concat(props.tags || []));

const perLine = computed(() => {
    const width = parent.value?.clientWidth;
    if (width) {
        return Math.floor((width - 80) / 128);
    }
    return 8;
});

onServerData((res) => {
    data.items = res.data;
    data.page = res.page;
    data.maxPage = res.maxPage;
}).catch(() => {
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

onMounted(() => {
    isMounted.value = true;
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
        return {
            data: res.data,
            page: res.page,
            maxPage: Math.ceil(res.total / res.pageSize),
        };
    });
}

</script>

<style scoped>
</style>
