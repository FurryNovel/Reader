<template>
	<div class="flex h-full w-full flex-col">
		<div class="flex flex-1 flex-col rounded bg-white text-black sm:p-10 dark:bg-surface-600 dark:text-white min-h-[calc(100vh-208px)]">
			<template v-if="novelIds.length > 0">
				<div class="m-2 flex items-center justify-between pl-2">
					<div class="text-2xl font-bold">
						{{ t('书架') }}
					</div>
				</div>
				<NovelList ref="novelList" v-ssr :author="true" :desc="false" :ids="novelIds"
				           :show-pagination="true" :userId="null" :with-chapters="true"
				           listStyle="style2" order="desc" type="popular"/>
			</template>
			<template v-else>
				<div class="flex flex-col items-center justify-center min-h-[calc(100vh-208px)] max-sm:h-full w-full">
					<div class="mb-2 text-2xl font-bold">{{ t('书架为空') }}</div>
					<div class="text-gray-500 dark:text-white">
						{{ t('书架为空，快去添加一些小说吧！') }}
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup>
import NovelList from "@/components/views/NovelList.vue";
import {useBookmarkStore} from "@/stores/bookmarks.js";
import {useI18n} from "@/i18n/index.js";

const {t} = useI18n();

const bookmarkStore = useBookmarkStore();

const isMounted = ref(false);
const novelList = ref(null);
const router = useRouter();

const novelIds = computed(() => {
    if (!isMounted.value) return [];
    const state = bookmarkStore.$state;
    return Object.keys(state).filter(key => key.startsWith('pk-')).map(key => parseInt(key.replace('pk-', '')));
});

onMounted(() => {
    isMounted.value = true;
});


</script>

<style scoped>

</style>
