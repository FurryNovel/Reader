<template>
	<div class="flex h-full w-full flex-col">
		<div class="flex flex-1 flex-col rounded bg-white p-10 text-black dark:bg-surface-600 dark:text-white">
			<template v-if="data.keyword !== ''">
				<div class="m-2 flex items-center justify-between">
					<div class="text-2xl font-bold">搜索</div>
					<router-link :to="{name:'search'}" :draggable="false">
						<Button class="mr-2 text-sm text-primary-500" label="条件筛选"
						        size="small">
							条件筛选
							<div class="ml-2 fa-regular fa-chevron-right"></div>
						</Button>
					</router-link>
				</div>
				<NovelList v-ssr type="popular" order="desc" listStyle="style2" :desc="false"
				           :author="false" :tags="null"
				           :limit="8"
				           :userId="null" :keyword="data.keyword" :ids="null"/>
			</template>
			<template v-else>
				<div class="flex flex-col items-center justify-center min-h-[calc(100vh-208px)] w-full">
					<InputGroup class="flex flex-row w-full justify-center items-center group duration-200">
						<InputGroupAddon class="bg-white !border-r-0 group-hover:border-primary-500">
							<i class="fa-regular fa-magnifying-glass text-surface-400 dark:text-surface-600"></i>
						</InputGroupAddon>
						<InputText id="keyword" v-model="data.preKeyword"
						           placeholder="请输入关键字：小说名、作者名、简介等"
						           class="w-5/12 max-sm:w-max !border-l-0 focus:ring-0 hover:border-surface-300 group-hover:border-primary-500 !duration-0"/>
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

const router = useRouter();
const data = reactive({
    preKeyword: '',
    keyword: '',
    tags: [],
    type: 'popular',
    order: 'desc',
});

if (router.currentRoute.value.query.keyword) {
    data.keyword = router.currentRoute.value.query.keyword;
}

watchEffect(() => {
    if (data.keyword !== '') {
        router.replace({query: {keyword: data.keyword}});
    }
});
</script>

<style scoped>

</style>
