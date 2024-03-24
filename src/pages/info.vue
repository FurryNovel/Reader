<template>
	<div class="flex h-full w-full flex-col">
		<NavBar :append-buttons="['back', 'home']" :hide-buttons="['icon']" :show-in="['mobile']"/>
		<div class="flex gap-3 flex-1 flex-col rounded bg-white text-black sm:p-10 max-sm:p-5 dark:bg-surface-600 dark:text-white">
			<template v-if="!data.loading && data.novel">
				<div class="flex w-full gap-3">
					<div class="rounded-xl">
						<img :alt="`${data.novel.name}(cover)`" :draggable="false" :src="data.novel.cover"
						     class="h-full w-full rounded-xl object-cover aspect-[140/186] max-h-[213px]"/>
					</div>
					<div class="ml-5 flex w-full flex-1 flex-col justify-between gap-1">
						<div class="flex flex-col gap-3">
							<div class="flex sm:items-center gap-3 max-sm:flex-col">
								<div class="text-2xl font-bold">
									{{ novelTitle || data.novel.name || t('小说详情') }}
								</div>
								<div class="flex gap-1">
									<div class="w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 py-0 text-xs leading-6 text-slate-700 dark:bg-surface-500 dark:text-white">
										{{ syncStatus }}
									</div>
									<a v-if="data.novel.source === 'bilibili'"
									   :href="`https://www.bilibili.com/read/readlist/rl${data.novel.source_id}/`"
									   class="w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 py-0 text-xs leading-6 text-slate-700 dark:bg-surface-500 dark:text-white">
										{{ t('来源') }}<i class="ml-2 mr-1 fa-brands fa-bilibili"></i>bilibili
									</a>
									<a v-if="data.novel.source === 'pixiv'"
									   :href="data.novel.ext_data?.oneshot? `https://www.pixiv.net/novel/show.php?id=${data.novel.source_id}` : `https://www.pixiv.net/novel/series/${data.novel.source_id}`"
									   class="w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 py-0 text-xs leading-6 text-slate-700 dark:bg-surface-500 dark:text-white">
										{{ t('来源') }}<i class="ml-2 mr-1 fa-brands fa-product-hunt"></i>pixiv
									</a>
								</div>
							</div>
							<div class="text-sm text-gray-500 dark:text-white">
								<div class="mr-5 inline-block">
									<i class="fa-regular fa-files"></i>
									{{ t('%d章', data.chapters.length || 0) }}
								</div>
								<div class="mr-5 inline-block">
									<i class="fa-regular fa-eye"></i>
									{{ t('%d浏览', data.novel.view_count || 0) }}
								</div>
							</div>
							<div class="text-sm text-gray-500 dark:text-white">
								{{ t('作者：') }}
								<router-link
										:to="{ name:'search', query:{ keyword:data.novel.author.nickname || t('作者未知') }}"
										class="font-bold text-black dark:text-white">
									{{
										data.novel.author.nickname || t('作者未知')
									}}
								</router-link>
							</div>
						</div>
						<div class="flex gap-3">
							<div class="flex flex-wrap items-center text-sm text-gray-500 dark:text-white">
								{{ t('更新时间：') }}
								<span class="font-bold text-black dark:text-white">
								{{ data.novel.updated_at }}
								</span>
							</div>
						</div>
						<div class="flex gap-3 max-sm:hidden">
							<Button v-if="canTranslate(data.novel?.tags || [])"
							        class="text-sm text-primary-500 max-sm:w-full dark:text-white"
							        :label="t('翻译')"
							        size="small"
							        @click="isShowTranslate = !isShowTranslate">
								<template v-if="isShowTranslate">
									<div class="mr-2 fa-regular fa-language"></div>
									{{ t('原&nbsp;文') }}
								</template>
								<template v-else>
									<div class="mr-2 fa-regular fa-language"></div>
									{{ t('翻&nbsp;译') }}
								</template>
							</Button>
							<Button class="text-sm text-primary-500 max-sm:w-full dark:text-white"
							        :label="t('加入书架')"
							        size="small"
							        @click="toggleBookmark">
								<template v-if="!isBookmarked">
									<div class="mr-2 fa-regular fa-book-bookmark"></div>
									{{ t('加入书架') }}
								</template>
								<template v-else>
									<div class="mr-2 fa-regular fa-book-bookmark"></div>
									{{ t('从书架移除') }}
								</template>
							</Button>
							<router-link v-if="currentReadChapter"
							             :to="{name:'chapter', params:{id:data.novel.id, cid:currentReadChapter.id}}">
								<Button class="text-sm text-primary-500 max-sm:w-full dark:text-white"
								        :label="t('立即阅读')"
								        size="small">
									{{ currentReadChapterId ? t(`继续阅读`) : t(`立即阅读`) }}
									<div class="ml-2 fa-regular fa-chevron-right"></div>
								</Button>
							</router-link>
						</div>
					</div>
				</div>
				<TabView>
					<TabPanel :header="t('最新章节')">
						<router-link
								:to="{name: 'chapter' ,params: {id: data.novel.id, cid: data.chapters[data.chapters.length - 1].id}}"
								class="flex">
							
							<div class="mr-1 h-min w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 text-xs leading-6 text-slate-700 py-0.5 dark:bg-surface-500 dark:text-white">
								{{ data.chapters.length }}
							</div>
							<div class="flex flex-1 flex-col gap-2">
								<span class="font-bold">{{ data.chapters[data.chapters.length - 1].name }}</span>
							</div>
						</router-link>
					</TabPanel>
				</TabView>
				<div class="hidden z-50 max-sm:flex max-sm:fixed bottom-0 left-0 w-full h-16 backdrop-blur-sm bg-white/70 dark:bg-surface-700/70 text-black max-sm:text-white">
					<div class="flex flex-1">
						<div class="flex flex-1 justify-center items-center">
							<Button class="text-sm text-primary-500 h-full rounded-none flex-1"
							        :label="t('书架')"
							        size="small" text
							        @click="toggleBookmark">
								<div v-if="!isBookmarked"
								     class="flex-1 flex flex-col justify-center align-middle text-center text-surface-600 dark:text-white">
									<div class="text-lg mb-1 fa-regular fa-book-bookmark"></div>
									{{ t('加入书架') }}
								</div>
								<div v-else
								     class="flex-1 flex flex-col justify-center align-middle text-center text-surface-600 dark:text-white">
									<div class="text-lg mb-1 fa-regular fa-book-bookmark"></div>
									{{ t('移出书架') }}
								</div>
							</Button>
							<Button v-if="canTranslate(data.novel?.tags || [])"
							        class="text-sm text-primary-500 h-full rounded-none flex-1"
							        :label="t('翻译')" size="small"
							        text
							        @click="isShowTranslate = !isShowTranslate">
								<div class="flex-1 flex flex-col justify-center align-middle text-center text-surface-600 dark:text-white">
									<template v-if="isShowTranslate">
										<div class="text-lg mb-1 fa-regular fa-language"></div>
										{{ t('原&nbsp;文') }}
									</template>
									<template v-else>
										<div class="text-lg mb-1 fa-regular fa-language"></div>
										{{ t('翻&nbsp;译') }}
									</template>
								</div>
							</Button>
						</div>
						<router-link v-if="currentReadChapter"
						             :to="{name:'chapter', params:{id:data.novel.id, cid:currentReadChapter.id}}"
						             class="text-sm text-primary-500 w-[50vw] h-full">
							<Button class="w-full h-full rounded-none dark:!text-white font-bold text-lg"
							        size="small">
								{{ currentReadChapterId ? t(`继续阅读`) : t(`立即阅读`) }}
								<div class="ml-2 fa-regular fa-chevron-right"></div>
							</Button>
						</router-link>
						<Button v-else class="w-[50vw] rounded-none dark:!text-white font-bold text-lg"
						        size="small">
							{{ t('立即阅读') }}
							<div class="ml-2 fa-regular fa-chevron-right"></div>
						</Button>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="flex w-full">
					<div class="rounded-xl">
						<Skeleton borderRadius="10px"
						          class="h-full w-full rounded-xl object-cover aspect-[140/186] max-h-[213px]"
						          height="213px"
						          width="160px"></Skeleton>
					</div>
					<div class="ml-5 flex w-full flex-1 flex-col justify-between gap-1">
						<div class="flex flex-col gap-3">
							<div class="flex items-center gap-3">
								<Skeleton class="text-2xl font-bold"
								          height="32px"
								          width="300px"></Skeleton>
							</div>
							<Skeleton class="text-sm text-gray-500 dark:text-white"
							          height="20px"
							          width="250px"></Skeleton>
						</div>
						<div>
							<Skeleton class="text-sm text-black dark:text-white"
							          height="20px"
							          width="150px"></Skeleton>
						</div>
						<div class="flex gap-3">
							<Skeleton class="flex flex-wrap items-center text-sm text-black dark:text-white"
							          height="20px"
							          width="150px"></Skeleton>
						</div>
						<div class="flex gap-3 max-sm:flex-col">
							<Skeleton class="text-sm text-primary-500 max-sm:!w-full"
							          height="40px"
							          width="95px"></Skeleton>
							<Skeleton class="text-sm text-primary-500 max-sm:!w-full"
							          height="40px"
							          width="95px"></Skeleton>
						</div>
					</div>
				</div>
			</template>
			<div class="">
				<TabView>
					<TabPanel :header="t('关于')">
						<template v-if="!data.loading && data.novel">
							<div class="mb-10">
								<div class="mb-2 text-xl font-bold">{{ t('简介') }}</div>
								<div v-safe-html="novelDesc || data.novel.desc" class=""></div>
							</div>
							<div class="">
								<div class="mb-2 text-xl font-bold">{{ t('标签') }}</div>
								<div class="flex flex-wrap overflow-hidden max-h-[65px]">
									<div v-for="tag in data.novel.tags"
									     class="mr-1 mb-1 w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 text-xs leading-6 text-slate-700 py-0.5 dark:bg-surface-500 dark:text-white">
										{{ tag }}
									</div>
								</div>
							</div>
						</template>
						<template v-else>
							<div class="mb-10 flex flex-col gap-1">
								<Skeleton class="mb-2 text-xl font-bold" height="24px" width="100px"></Skeleton>
								<Skeleton class="" height="20px" width="300px"></Skeleton>
								<Skeleton class="" height="20px" width="300px"></Skeleton>
								<Skeleton class="" height="20px" width="300px"></Skeleton>
							</div>
							<div class="flex flex-col gap-1">
								<Skeleton class="mb-2 text-xl font-bold" height="24px" width="100px"></Skeleton>
								<Skeleton class="" height="20px" width="300px"></Skeleton>
								<Skeleton class="" height="20px" width="300px"></Skeleton>
								<Skeleton class="" height="20px" width="300px"></Skeleton>
							</div>
						</template>
					</TabPanel>
					<TabPanel :header="t('目录')">
						<template v-if="!data.loading && data.novel">
							<div class="flex flex-wrap">
								<router-link v-for="(chapter,idx) in data.chapters"
								             :to="{name:'chapter', params:{id:data.novel.id,cid:chapter.id}}"
								             class="flex w-6/12 flex-wrap items-center gap-3 border-b p-2 max-sm:w-full">
									<div class="flex">
										<div class="mr-1 h-min w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 text-xs leading-6 text-slate-700 py-0.5 dark:bg-surface-500 dark:text-white">
											{{ idx + 1 }}
										</div>
										<div class="flex flex-1 flex-col gap-2">
											<span class="font-bold">{{ chapter.name }}</span>
											<div class="flex flex-wrap overflow-hidden max-h-[65px]">
												<div v-for="tag in chapter.tags.slice(0, 3)"
												     class="mr-1 mb-1 w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 text-xs leading-6 text-slate-700 py-0.5 dark:bg-surface-500 dark:text-white">
													{{ tag }}
												</div>
											</div>
											<div class="flex items-center gap-2">
												<span>{{ chapter.updated_at }}</span>
											</div>
										</div>
									</div>
									<span class="font-bold"></span>
								</router-link>
							</div>
						</template>
						<template v-else>
							<div class="flex flex-col gap-1">
								<Skeleton class="mb-2 text-xl font-bold" height="24px" width="100px"></Skeleton>
								<Skeleton class="" height="20px" width="300px"></Skeleton>
								<Skeleton class="" height="20px" width="300px"></Skeleton>
								<Skeleton class="" height="20px" width="300px"></Skeleton>
							</div>
						</template>
					</TabPanel>
				</TabView>
			</div>
			<div class="">
				<TabView>
					<TabPanel :header="t('评论')">
						<div>
							<PageComments/>
						</div>
					</TabPanel>
				</TabView>
			</div>
		</div>
		<div class="mt-16"></div>
	</div>
</template>

<script setup>
import ClientOnly from "@duannx/vue-client-only";
import NavBar from "@/components/layout/NavBar.vue";
import {doNovelAction, loadNovel} from "@/api/novels.js";
import {onServerData, provideServerData} from "@/utils/ssr.js";
import {loadChapter, loadChapters} from "@/api/chapters.js";
import {useMeta} from "@/utils/meta.js";
import {useBookmarkStore} from "@/stores/bookmarks.js";
import {onRouteChange} from "@/utils/router-event.js";
import Skeleton from "primevue/skeleton";
import {useHistoryStore} from "@/stores/histories.js";
import {computedAsync} from "@vueuse/core";
import {canTranslate, detectedLanguage, useTranslate} from "@/utils/translate.js";
import {useConfigProvider} from "@/provider/config.js";
import PageComments from "@/components/global/PageComments.vue";
import {useI18n} from "@/i18n/index.js";

const {t, locale} = useI18n();

const config = useConfigProvider();
const historyStore = useHistoryStore();
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

const currentReadChapterId = computedAsync(async () => {
    if (!isMounted.value) {
        return false;
    }
    return await historyStore.find(data.id);
}, null, {lazy: true});

const currentReadChapter = computed(() => {
    if (!isMounted.value) {
        return false;
    }
    if (!currentReadChapterId.value) {
        return data.chapters[0] ?? false;
    }
    return data.chapters.find(chapter => chapter.id === currentReadChapterId.value);
});


const syncStatus = computed(() => {
    if (data.novel) {
        return t(['同步成功', '同步中', '同步失败'][data.novel.sync_status] ?? '未知');
    }
    return t('未知');
});

const isShowTranslate = ref(config.global.autoTranslate);

const novelTitle = useTranslate(
    computed(() => isShowTranslate.value && canTranslate(data.novel?.tags || [])),
    computed(() => data.novel?.name)
);

const novelDesc = useTranslate(
    computed(() => isShowTranslate.value && canTranslate(data.novel?.tags || [])),
    computed(() => {
        return data.novel?.desc;
    })
);

onRouteChange(to => {
    if (data.id !== to.params.id) {
        const needLoad = data.novel !== null;
        data.id = to.params.id;
        if (needLoad) {
            data.loading = true;
            loadData();
        }
    }
});

onServerPrefetch(() => {
    const instance = getCurrentInstance();
    return loadData().then(() => {
        provideServerData({
            data: data.novel,
            reqId: `novel-${data.id}`,
            instance,
        });
        provideServerData({
            data: data.chapters,
            reqId: `novel-${data.id}-chapters`,
            instance,
        });
        if (data.novel) {
            useMeta({
                title: `${data.novel.name} - ${data.novel.author?.nickname || '铁名'}`,
                description: `${data.novel.name}是由${data.novel.author?.nickname || '铁名'}创作的小说。\n简介：${data.novel.desc}`,
                keywords: data.novel.tags?.join(',') || '',
                image: data.novel.cover,
                append: {
                    'og:type': 'article',
                    'og:title': `${data.novel.name}`,
                    'og:description': `${data.novel.desc}`,
                    'article:author': data.novel.author?.nickname || '铁名',
                    'article:published_time': data.novel.created_at,
                    'article:modified_time': data.novel.updated_at,
                    'article:section': data.novel.tags?.join(',') || '',
                    'article:tag': data.novel.tags?.join(',') || '',
                },
            });
        }
    });
});

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
    })
})();

onMounted(() => {
    isMounted.value = true;
    doNovelAction({
        id: data.id,
        action: 'view',
    });
});

watchEffect(() => {
    if (data.novel) {
        useMeta({
            title: `${data.novel.name} - ${data.novel.author?.nickname || '铁名'}`,
            description: `${data.novel.name}是由${data.novel.author?.nickname || '铁名'}创作的小说。\n简介：${data.novel.desc}`,
            keywords: data.novel.tags?.join(',') || '',
            image: data.novel.cover,
            append: {
                'og:type': 'article',
	            'og:title': `${data.novel.name}`,
	            'og:description': `${data.novel.desc}`,
				'article:author': data.novel.author?.nickname || '铁名',
				'article:published_time': data.novel.created_at,
				'article:modified_time': data.novel.updated_at,
				'article:section': data.novel.tags?.join(',') || '',
				'article:tag': data.novel.tags?.join(',') || '',
            },
        });
    }
});

function loadData() {
    const tasks = [];
    const hitCaches = [];
    tasks.push(
        loadNovel({
            id: data.id,
            onCache: (novel) => {
                data.novel = novel;
                hitCaches.push('novel');
                if (hitCaches.length === 2) {
                    data.loading = false;
                }
            },
            ignoreReq: import.meta.env.SSR,
            lang: locale(),
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
                hitCaches.push('chapters');
                if (hitCaches.length === 2) {
                    data.loading = false;
                }
            },
            ignoreReq: import.meta.env.SSR,
            lang: locale(),
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
