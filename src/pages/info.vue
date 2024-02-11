<template>
	<div class="flex h-full w-full flex-col max-sm:h-screen">
		<NavBar :show-in="['mobile']" :show-buttons="['search', 'settings', 'back', 'home']"/>
		<template v-if="data.novel">
			<div class="flex flex-1 flex-col rounded bg-white text-black sm:p-10 max-sm:p-5 dark:bg-surface-600 dark:text-white">
				<div class="flex w-full">
					<div class="rounded-xl">
						<img :alt="`${data.novel.name}(cover)`" :draggable="false" :src="data.novel.cover"
						     class="h-full w-full rounded-xl object-cover aspect-[140/186] max-h-[213px]"/>
					</div>
					<div class="ml-5 flex w-full flex-1 flex-col justify-between">
						<div>
							<div class="text-2xl font-bold">
								{{ data.novel.name || '小说详情' }}
							</div>
							<div class="text-gray-500 dark:text-white">
								<div class="mr-5 inline-block">
									<i class="font-bold fa-regular fa-files"></i>
									{{ data.chapters.length || 0 }}章
								</div>
								<div class="mr-5 inline-block">
									<i class="font-bold fa-regular fa-eye"></i>
									{{ data.novel.view_count || 0 }}
								</div>
							</div>
							<div class="text-sm text-gray-500 dark:text-white">
								作者：<span class="font-bold text-black dark:text-white">{{
									data.novel.author.nickname || '作者未知'
								}}</span>
							</div>
						</div>
						<div class="">
							<Button v-if="!isBookmarked" class="mr-2 text-sm text-primary-500" label="加入书架"
							        size="small"
							        @click="toggleBookmark">
								<div class="mr-2 fa-regular fa-book-bookmark"></div>
								加入书架
							</Button>
							<Button v-else class="mr-2 text-sm text-primary-500" label="加入书架" size="small"
							        @click="toggleBookmark">
								<div class="mr-2 fa-regular fa-book-bookmark"></div>
								从书架移除
							</Button>
							<Button class="mr-2 text-sm text-primary-500" label="立即阅读" size="small">
								立即阅读
								<div class="ml-2 fa-regular fa-chevron-right"></div>
							</Button>
						</div>
					</div>
				</div>
				
				<div class="mt-10">
					<TabView>
						<TabPanel header="关于">
							<div class="mb-10">
								<div class="text-xl font-bold mb-2">简介</div>
								<div class="" v-html="data.novel.desc"></div>
							</div>
							<div class="">
								<div class="text-xl font-bold mb-2">标签</div>
								<div class="flex flex-wrap overflow-hidden max-h-[65px]">
									<div v-for="tag in data.novel.tags"
									     class="mr-1 mb-1 w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 text-xs leading-6 text-slate-700 py-0.5">
										{{ tag }}
									</div>
								</div>
							</div>
						</TabPanel>
						<TabPanel header="目录">
							<div class="flex flex-wrap ">
								<div v-for="chapter in data.chapters"
								     class="flex flex-wrap p-2 items-center gap-3 w-6/12 max-sm:w-full border-b">
									<div class="flex-1 flex flex-col gap-2">
										<span class="font-bold">{{ chapter.name }}</span>
										<div class="flex flex-wrap overflow-hidden max-h-[65px]">
											<div v-for="tag in chapter.tags.slice(0, 3)"
											     class="mr-1 mb-1 w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 text-xs leading-6 text-slate-700 py-0.5">
												{{ tag }}
											</div>
										</div>
										<div class="flex items-center gap-2">
											<span>{{ chapter.updated_at }}</span>
										</div>
									</div>
									<span class="font-bold"></span>
								</div>
							</div>
						</TabPanel>
					</TabView>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup>
import NavBar from "@/components/layout/NavBar.vue";
import {loadNovel} from "@/api/novels.js";
import {onServerData, provideServerData} from "@/utils/ssr.js";
import {loadChapter, loadChapters} from "@/api/chapters.js";
import {useMeta} from "@/utils/meta.js";
import {useBookmarkStore} from "@/stores/bookmarks.js";

const bookmarkStore = useBookmarkStore();

const isMounted = ref(false);
const router = useRouter();
const data = reactive({
    id: null,
    novel: null,
    chapters: [],
    
    loading: false,
});

const isBookmarked = computed(() => {
    if (!isMounted.value) {
        return false;
    }
    return bookmarkStore.has(data.id);
});


if (router.currentRoute.value.params.id) {
    data.id = router.currentRoute.value.params.id;
}

(() => {
    const tasks = [];
    tasks.push(
        onServerData((novel) => {
            data.novel = novel;
        }, `novel-${data.id}`)
    );
    tasks.push(
        onServerData((chapters) => {
            data.chapters = chapters;
        }, `novel-${data.id}-chapters`)
    );
    
    Promise.all(tasks).catch(err => {
        data.loading = true;
        return loadData();
    });
})();

onServerPrefetch(() => {
    return loadData().then(() => {
        provideServerData({
            data: data.novel,
            reqId: `novel-${data.id}`,
        });
        provideServerData({
            data: data.chapters,
            reqId: `novel-${data.id}-chapters`,
        });
        if (data.novel) {
            useMeta({
                title: data.novel.name,
                description: data.novel.desc,
                image: data.novel.cover,
            });
        }
    });
});

onMounted(() => {
    isMounted.value = true;
});

watchEffect(() => {
    if (data.novel) {
        useMeta({
            title: data.novel.name,
            description: data.novel.desc,
            image: data.novel.cover,
        });
    }
});

function loadData() {
    const tasks = [];
    tasks.push(
        loadNovel({
            id: data.id,
            onCache: (novel) => {
                data.novel = novel;
            },
            ignoreReq: import.meta.env.SSR,
        }).then((novel) => {
            data.novel = novel;
        }).catch((e) => {
            data.novel = null;
        })
    );
    tasks.push(
        loadChapters({
            novelId: data.id,
            onCache: (chapters) => {
                data.chapters = chapters;
            },
            ignoreReq: import.meta.env.SSR,
        }).then((chapters) => {
            data.chapters = chapters;
        }).catch((e) => {
            console.error(e);
            data.chapters = [];
        })
    )
    return Promise.all(tasks).then(() => {
        data.loading = false;
    });
}

function toggleBookmark() {
    bookmarkStore.find(data.id).then((bookmark) => {
        if (bookmark) {
            bookmarkStore.remove(data.id);
        } else {
            bookmarkStore.save(data.id, true);
        }
    });
}
</script>

<style scoped>

</style>
