<template>
	<div class="flex h-full w-full flex-col">
		<NavBar v-if="data.keyword === '' && props.mode === 'search'" :append-buttons="['back', 'home']"
		        :hide-buttons="['icon']" :show-in="['mobile']"/>
		<div class="flex flex-1 flex-col rounded bg-white text-black sm:p-10 dark:bg-surface-600 dark:text-white">
			<template v-if="data.mode === 'list' || data.keyword !== ''">
				<div class="m-2 flex items-center justify-between pl-2">
					<div class="text-2xl font-bold">
						<Button v-if="data.mode === 'search'" class="text-sm text-primary-500" label="返回" outlined
						        severity="secondary" size="small"
						        @click="data.keyword = ''">
							<i class="fa-regular fa-chevron-left"></i>
						</Button>
						<template v-if="data.mode === 'search'">
							搜索
						</template>
						<template v-else-if="data.type === 'latest'">
							最新小说
						</template>
						<template v-else>
							热门小说
						</template>
					</div>
					<div class="mr-2 flex gap-3">
						<SelectButton v-model="data.type" :allowEmpty="false" :options="[{ name: '最新', value: 'latest'},{ name: '热门', value: 'popular'}]"
						              aria-labelledby="basic"
						              optionLabel="name"
						              optionValue="value" size="small"
						              @change="reloadNovels"/>
						<Button class="text-sm text-primary-500 dark:text-white" label="条件筛选" size="small"
						        @click="showFilter">
							<i class="mr-2 fa-regular fa-filter"></i>
							条件筛选
						</Button>
					</div>
				</div>
				<NovelList ref="novelList" v-ssr :author="false" :desc="false" :ids="null" :keyword="data.keyword"
				           :limit="8" :show-pagination="true"
				           :tags="data.tags" :type="data.type"
				           :userId="null" listStyle="style2" order="desc"/>
			</template>
			<template v-else>
				<div class="flex flex-col items-center justify-center min-h-[calc(100vh-208px)] max-sm:h-full w-full">
					<InputGroup class="flex w-full flex-row items-center justify-center duration-200 group">
						<InputGroupAddon class="bg-white !border-r-0 group-hover:border-primary-500">
							<i class="fa-regular fa-magnifying-glass text-surface-400 dark:text-surface-600"></i>
						</InputGroupAddon>
						<InputText id="keyword" v-model="data.preKeyword"
						           class="w-5/12 max-sm:w-max !border-l-0 focus:ring-0 hover:border-surface-300 group-hover:border-primary-500 !duration-0"
						           placeholder="请输入关键字：小说名、作者名、简介等"/>
						<Button class="dark:text-white" label="搜索" @click="data.keyword = data.preKeyword"/>
					</InputGroup>
				</div>
			</template>
		</div>
	</div>
	<OverlayPanel ref="filtersPanel">
		<div class="rounded-xl p-3 w-[300px] flex flex-col gap-3">
			<div class="flex flex-col gap-2">
				<span class="font-bold">名称</span>
				<InputText id="keyword" v-model="data.preKeyword" class="text-sm"
				           placeholder="请输入关键字：小说名、作者名、简介等"
				           size="small"/>
			</div>
			<div class="flex flex-col gap-2">
				<span class="font-bold">标签</span>
				<InputText id="keyword" v-model="data.preTags" class="text-sm"
				           placeholder="使用半角逗号间隔多个标签"
				           size="small"/>
			</div>
			<div class="flex items-center justify-end gap-2">
				<Button class="dark:text-white" label="确定" size="small" @click="applyFilters"></Button>
				<Button label="清除" outlined severity="secondary" size="small" text
				        @click="clearFilters"></Button>
			</div>
		</div>
	</OverlayPanel>
</template>

<script setup>
import NovelList from "@/components/views/NovelList.vue";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import NavBar from "@/components/layout/NavBar.vue";
import OverlayPanel from 'primevue/overlaypanel';
import SelectButton from "primevue/selectbutton";

const filtersPanel = ref(null);
const novelList = ref(null);
const router = useRouter();
const data = reactive({
    preKeyword: '',
    preTags: '',
    keyword: '',
    tags: [],
    type: 'popular',
    order: 'desc',
    mode: 'list',
});

const props = defineProps({
    mode: {
        type: String,
        default: 'list',
    },
});

watchEffect(() => {
    let next = {};
    if (data.keyword !== '') {
        next.keyword = data.keyword;
    }
    if (props.mode) {
        next.mode = props.mode;
    }
    if (data.tags && data.tags.length > 0) {
        next.tags = data.tags;
    }
    if (data.type) {
        next.type = data.type;
    }
    data.keyword = next?.keyword || '';
    data.mode = next.mode;
    router.replace({
        query: next,
    });
});

function onInit() {
    if (router.currentRoute.value.query.keyword) {
        data.keyword = router.currentRoute.value.query.keyword;
        data.preKeyword = data.keyword;
    }
    if (router.currentRoute.value.query.mode) {
        data.mode = router.currentRoute.value.query.mode;
    } else {
        data.mode = props.mode;
    }
    if (router.currentRoute.value.query.tags) {
        if (typeof router.currentRoute.value.query.tags === 'string') {
            data.tags = router.currentRoute.value.query.tags.split(',').filter(tag => tag !== '');
        } else {
            data.tags = router.currentRoute.value.query.tags.filter(tag => tag !== '');
        }
        data.preTags = data.tags.join(',');
    }
    if (router.currentRoute.value.query.type) {
        data.type = router.currentRoute.value.query.type;
    } else {
        data.type = 'popular';
    }
}

onInit();

onBeforeRouteLeave((to, from, next) => {
    next();
    if (to.name !== from.name && ['list', 'search'].includes(to.name)) {
        onInit();
    }
});

function showFilter(event) {
    filtersPanel.value.toggle(event);
}

function applyFilters() {
    let tags = data.preTags.split(',');
    if (tags && tags.length > 0) {
        tags = tags.map(tag => tag.trim());
    } else {
        tags = [];
    }
    data.keyword = data.preKeyword;
    data.tags = tags;
    reloadNovels();
    filtersPanel.value.hide();
}

function clearFilters() {
    data.preKeyword = '';
    data.preTags = '';
    data.keyword = '';
    data.tags = [];
    reloadNovels();
    filtersPanel.value.hide();
}

function reloadNovels() {
    nextTick(() => {
        novelList.value?.reload();
    });
}
</script>

<style scoped>

</style>
