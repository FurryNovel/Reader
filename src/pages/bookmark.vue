<template>
	<div class="flex h-full w-full flex-col max-sm:h-screen">
		<div class="flex flex-1 flex-col rounded bg-white text-black sm:p-10 dark:bg-surface-600 dark:text-white">
			<div class="m-2 pl-2 flex items-center justify-between">
				<div class="text-2xl font-bold">
					书架
				</div>
			</div>
			<NovelList ref="novelList" v-ssr :author="false" :desc="false" :ids="novelIds"
			           :userId="null" :show-pagination="true" :with-chapters="true"
			           listStyle="style2" order="desc" type="popular"/>
		</div>
	</div>
</template>

<script setup>
import NovelList from "@/components/views/NovelList.vue";
import {useBookmarkStore} from "@/stores/bookmarks.js";

const bookmarkStore = useBookmarkStore();

const novelList = ref(null);
const router = useRouter();

const novelIds = computed(() => {
    const state = bookmarkStore.$state;
    return Object.keys(state).filter(key => key.startsWith('pk-')).map(key => parseInt(key.replace('pk-', '')));
});

</script>

<style scoped>

</style>
