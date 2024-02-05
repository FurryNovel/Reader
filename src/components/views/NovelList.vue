<template>
	<template v-if="props.listStyle === 'style1'">
		<div class="border-1 surface-border border-round flex-col h-full w-full">
			<div v-for="line in perLineItems" :key="line.map(item => item.id).join()">
				<div :style="{height: `${itemHeight}px`}" class="flex max-sm:block flex-row items-center mb-4">
					<div v-for="item in line"
					     class="flex flex-row align-items-center m-2 mb-0 h-52 rounded bg-gray-50 transition duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-110">
						<div class="flex flex-1 flex-col justify-between items-center h-full w-32 rounded-xl relative overflow-hidden">
							<img :alt="`${item.name}(cover)`" :src="item.cover"
							     class="object-cover absolute h-full w-full"></img>
						</div>
						<div class="flex flex-col">
							
							{{ item.name }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</template>
</template>

<script setup>
import {getReqId, unWrapper} from "@/api/api.js";
import {loadNovels} from "@/api/novels.js";
import {useConfigProvider} from "@/provider/config.js";
import {useServerSideRenderStore} from "@/stores/ssr.js";
import {useDeviceInfo} from "@/utils/device.js";

const vm = getCurrentInstance();

const ssrStore = useServerSideRenderStore();
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
    showLoadingComponent: {
        type: Boolean,
        default: false,
    },
    useSlot: {
        type: Boolean,
        default: false,
    },
    withChapters: {
        type: Boolean,
        default: false,
    },
    applyFilter: {
        type: Boolean,
        default: true,
    },
    maxLine: {
        default: null,
    }
});
const data = reactive({
    page: 1,
    items: [],
    loading: false,
    hasMore: true,
    reqId: '',
});

const isMounted = ref(false);

const hateTags = computed(() => configProvider.hateTags);
const tags = computed(() => (configProvider?.tags || []).concat(props.tags || []));

const perLineCount = computed(() => {
    return {
        style1: 5,
        style2: 10,
    }[props.listStyle] || 4;
});
const perLineItems = computed(() => {
    let result = [];
    for (let i = 0; i < data.items.length; i += perLineCount.value) {
        if (props.maxLine && result.length >= props.maxLine) {
            break;
        }
        const line = data.items.slice(i, i + perLineCount.value);
        // if (line.length < perLineCount.value) {
        // 	line.push(...Array(perLineCount.value - line.length).fill(null));
        // }
        result.push(line);
    }
    return result;
});

const itemHeight = computed(() => {
    const rem = 13;
    return (isMounted && useDeviceInfo().value.isMobile) ? rem * 16 * perLineCount : rem * 16;
});

onServerPrefetch(() => new Promise((resolve) => {
    data.page = 1;
    loadData().then((items) => {
        // noinspection JSValidateTypes
        data.items = items;
        ssrStore.save(vm.id, items);
    }).finally(() => {
        resolve();
    });
}));

onBeforeMount(() => {
    unWrapper(loadData(), data, 'items');
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
    data.reqId = vm.id;
    if (!import.meta.env.SSR) {
        const prefetch = ssrStore.find(data.reqId);
        if (prefetch) {
            return prefetch;
        }
    }
    return loadNovels({params, ignoreReq: import.meta.env.SSR})
}

</script>

<style scoped>
</style>
