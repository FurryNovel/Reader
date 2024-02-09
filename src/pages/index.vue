<template>
	<div class="flex h-full w-full flex-col">
		<div class="flex flex-1 flex-col rounded bg-white p-10 max-sm:p-3 text-black dark:bg-surface-600 dark:text-white">
			<div class="m-2 flex items-center justify-between">
				<div class="text-2xl font-bold">热门精选</div>
				<router-link :to="{name:'list'}" :draggable="false">
					<Button class="mr-2 text-sm text-primary-500" label="查看更多" size="small">
						查看更多
						<div class="ml-2 fa-regular fa-chevron-right"></div>
					</Button>
				</router-link>
			</div>
			<NovelList v-ssr type="popular" order="desc" listStyle="style1" :desc="false" :author="false" :tags="null"
			           :limit="8"
			           :userId="null" :keyword="null" :ids="null"/>
		</div>
		<div class="flex flex-1 flex-col rounded bg-white p-10 max-sm:p-3 text-black dark:bg-surface-600 dark:text-white">
			<div class="m-2 flex items-center justify-between">
				<div class="text-2xl font-bold">最新小说</div>
				<router-link :to="{name:'list'}" :draggable="false">
					<Button class="mr-2 text-sm text-primary-500" label="查看更多" size="small">
						查看更多
						<div class="ml-2 fa-regular fa-chevron-right"></div>
					</Button>
				</router-link>
			</div>
			<NovelList v-ssr type="random" order="desc" listStyle="style1" :desc="false" :author="false" :tags="null"
			           :limit="8"
			           :userId="null" :keyword="null" :ids="null"/>
		</div>
	</div>
</template>

<script setup>
import dialog from '@/utils/dialog.js';
import NovelList from '@/components/views/NovelList.vue';

onServerPrefetch(() => {
});
</script>
