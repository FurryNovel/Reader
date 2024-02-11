<template>
	<div class="flex h-full w-full flex-col max-sm:h-screen">
		<NavBar v-if="data.keyword === '' && props.mode === 'search'" :show-in="['mobile']"
		        :show-buttons="['search', 'settings', 'back', 'home']"/>
		<div class="flex flex-1 flex-col rounded bg-white text-black sm:p-10 dark:bg-surface-600 dark:text-white">
			<template v-if="data.mode === 'list' || data.keyword !== ''">
				<div class="m-2 pl-2 flex items-center justify-between">
					<div class="text-2xl font-bold">
						<Button v-if="data.mode === 'search'" class="text-sm text-primary-500" label="返回" outlined
						        severity="secondary" size="small"
						        @click="data.keyword = ''">
							<div class="fa-regular fa-chevron-left"></div>
						</Button>
						{{ data.mode === 'search' ? '搜索' : '所有小说' }}
					</div>
					<router-link :draggable="false" :to="{name:'search'}">
						<Button class="mr-2 text-sm text-primary-500" label="条件筛选"
						        size="small">
							条件筛选
							<div class="ml-2 fa-regular fa-chevron-right"></div>
						</Button>
					</router-link>
				</div>
				<NovelList v-ssr :author="false" :desc="false" :ids="null" :keyword="data.keyword"
				           :limit="8" :tags="null"
				           :userId="null" :show-pagination="true"
				           listStyle="style2" order="desc" type="popular"/>
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
						<Button label="搜索" @click="data.keyword = data.preKeyword"/>
					</InputGroup>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup>
import NovelList from "@/components/views/NovelList.vue";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import NavBar from "@/components/layout/NavBar.vue";

const router = useRouter();
const data = reactive({
    preKeyword: '',
    keyword: '',
    tags: [],
    type: 'popular',
    order: 'desc',
    mode: 'list',//search/list
});

const props = defineProps({
    mode: {
        type: String,
        default: 'list',
    },
});

if (router.currentRoute.value.params.keyword) {
    data.keyword = router.currentRoute.value.params.keyword;
}
if (router.currentRoute.value.params.mode) {
    data.mode = router.currentRoute.value.params.mode;
} else {
    data.mode = props.mode;
}

watchEffect(() => {
    let next = {};
    if (data.keyword !== '') {
        next.keyword = data.keyword;
    }
    if (props.mode) {
        next.mode = props.mode;
        switch (next.mode) {
            case 'list':
                next.keyword = '';
                break;
            default:
                break;
        }
    }
    data.keyword = next?.keyword || '';
    data.mode = next.mode;
    router.replace({
        query: next,
    });
});
</script>

<style scoped>

</style>
