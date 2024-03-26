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
						        @click="clearFilters">
							<i class="fa-regular fa-chevron-left"></i>
						</Button>
						<template v-if="data.mode === 'search'">
							{{ t('搜索') }}
						</template>
						<template v-else-if="data.type === 'latest'">
							{{ t('最新小说') }}
						</template>
						<template v-else>
							{{ t('热门小说') }}
						</template>
					</div>
					<div class="mr-2 flex gap-3">
						<SelectButton v-model="data.type" :allowEmpty="false"
						              :options="[{ name: t('最新'), value: 'latest'},{ name: t('热门'), value: 'popular'}]"
						              aria-labelledby="basic"
						              optionLabel="name"
						              optionValue="value" size="small"
						              @change="reloadNovels"/>
						<Button class="text-sm font-bold text-primary-500 dark:text-white" label="条件筛选" size="small"
						        @click="showFilter">
							<i class="mr-2 fa-regular fa-filter"></i>
							{{ t('条件筛选') }}
						</Button>
					</div>
				</div>
				<NovelList ref="novelList" v-if="data.searchMode === 'keyword'"
				           v-ssr :ids="null" :keyword="data.keyword"
				           :limit="8" :show-pagination="true"
				           :tags="data.tags" :type="data.type"
				           :userId="null" listStyle="style2" order="desc"/>
				<NovelList ref="novelList" v-if="data.searchMode === 'tag'"
				           v-ssr :ids="null"
				           :limit="8" :show-pagination="true"
				           :tags="[data.keyword]" :type="data.type"
				           :userId="null" listStyle="style2" order="desc"/>
			</template>
			<template v-else>
				<div class="flex flex-col items-center justify-center min-h-[calc(100vh-146px)] max-sm:h-[calc(100vh-64px)]">
					<div class=" w-full p-10 max-w-[800px]">
						<TabView @tabChange="e => data.searchMode = searchModes[e.index].value"
						         :activeIndex="searchModes.findIndex(v => v.value === data.searchMode)">
							<TabPanel v-for="mode in searchModes" :header="mode.name"></TabPanel>
						</TabView>
						<InputGroup
								class="flex w-full flex-row items-center justify-center duration-200 mt-[-30px]">
							<InputGroupAddon class="bg-white !border-r-0 group-hover:border-primary-500 flex">
								<i class="fa-regular fa-magnifying-glass text-surface-400 dark:text-surface-600"></i>
							</InputGroupAddon>
							<InputText id="keyword" v-model="data.preKeyword"
							           class="w-5/12 max-sm:w-max !border-l-0 focus:ring-0 hover:border-surface-300 group-hover:border-primary-500 !duration-0 flex-1"
							           :placeholder="t(data.searchMode === 'keyword' ? '请输入关键字：小说名、作者名、简介等' : '请输入标签')"/>
							<Button class="dark:text-white px-5" :label="t('搜索')"
							        @click="applyFilters"/>
						</InputGroup>
					</div>
				</div>
			</template>
		</div>
	</div>
	<OverlayPanel ref="filtersPanel">
		<div class="flex flex-col gap-3 rounded-xl p-3 w-[300px]">
			<div class="flex flex-col gap-2">
				<span class="font-bold">{{ t('名称') }}</span>
				<InputText id="keyword" v-model="data.preKeyword" class="text-sm"
				           :placeholder="t('请输入关键字：小说名、作者名、简介等')"
				           size="small"/>
			</div>
			<div class="flex flex-col gap-2">
				<span class="font-bold">{{ t('标签') }}</span>
				<TagSelect v-model="data.preTags" class="text-sm" size="small"/>
			</div>
			<div class="flex items-center justify-end gap-2">
				<Button class="dark:text-white" :label="t('确定')" size="small" @click="applyFilters"></Button>
				<Button :label="t('清除')" outlined severity="secondary" size="small" text
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
import TagSelect from "@/components/views/TagSelect.vue";
import {useI18n} from "@/i18n/index.js";

const {t} = useI18n();
const filtersPanel = ref(null);
const novelList = ref(null);
const router = useRouter();
const searchModes = [
    {
        name: '关键字',
        value: 'keyword',
    },
    {
        name: '标签',
        value: 'tag',
    },
];
const data = reactive({
    searchMode: 'keyword',
    preKeyword: '',
    preTags: [],
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

let next = {};
watchEffect(() => {
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
    if (data.searchMode) {
        next.searchMode = data.searchMode;
    }
    data.keyword = next?.keyword || '';
    data.mode = next.mode;
});

function updateRoute(){
    router.replace({
        query: next,
    });
}

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
        data.preTags = data.tags;
    }
    if (router.currentRoute.value.query.type) {
        data.type = router.currentRoute.value.query.type;
    } else {
        data.type = 'popular';
    }
    if (router.currentRoute.value.query.searchMode) {
        data.searchMode = router.currentRoute.value.query.searchMode;
    } else {
        data.searchMode = 'keyword';
    }
}

onInit();
//
// onBeforeRouteLeave((to, from, next) => {
//     next();
//     if (to.name !== from.name && ['list', 'search'].includes(to.name)) {
//         onInit();
//     }
// });

function showFilter(event) {
    filtersPanel.value.toggle(event);
}

function applyFilters() {
    let tags = data.preTags;
    if (tags && tags.length > 0) {
        tags = tags.map(tag => tag?.trim() || tag);
    } else {
        tags = [];
    }
    data.keyword = data.preKeyword;
    data.tags = tags;
    nextTick(() => {
        reloadNovels();
        filtersPanel.value.hide();
    });
}

function clearFilters() {
    data.preKeyword = '';
    data.preTags = [];
    data.keyword = '';
    data.tags = [];
    
    next.keyword = '';
    next.tags = '';
    
    nextTick(() => {
        reloadNovels();
        filtersPanel.value.hide();
    });
}

function reloadNovels() {
    updateRoute();
    nextTick(() => {
        novelList.value?.reload();
    });
}
</script>

<style scoped>

</style>
