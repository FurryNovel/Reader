<template>
	<div class="flex h-full w-full flex-col">
		<div class="flex p-10 flex-1 flex-col rounded bg-white dark:bg-surface-600 text-black dark:text-white">
			<div class="flex items-center justify-between m-2">
				<div class="text-2xl font-bold">热门精选</div>
				<router-link :to="{name:'search'}">
					<Button class="text-sm mr-2 text-primary-500" label="查看更多" size="small">
						查看更多
						<div class="fa-regular fa-chevron-right ml-2"></div>
					</Button>
				</router-link>
			
			</div>
			<NovelList type="random" order="desc" listStyle="style1" :desc="false" :author="false" :tags="null"
			           :limit="8" v-ssr
			           :userId="null" :keyword="null" :ids="null"/>
		</div>
		<div class="flex p-10 flex-1 flex-col rounded bg-white dark:bg-surface-600 text-black dark:text-white">
			<div class="flex items-center justify-between m-2">
				<div class="text-2xl font-bold">热门精选</div>
				<router-link :to="{name:'search'}">
					<Button class="text-sm mr-2 text-primary-500" label="查看更多" size="small">
						查看更多
						<div class="fa-regular fa-chevron-right ml-2"></div>
					</Button>
				</router-link>
			
			</div>
			<NovelList type="random" order="desc" listStyle="style1" :desc="false" :author="false" :tags="null"
			           :limit="8" v-ssr
			           :userId="null" :keyword="null" :ids="null"/>
		</div>
	</div>
</template>

<script setup>
import dialog from "@/utils/dialog.js";
import NovelList from "@/components/views/NovelList.vue";

onServerPrefetch(() => {

});

</script>
