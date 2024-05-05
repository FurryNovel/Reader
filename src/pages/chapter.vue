<template>
	<div ref="parent" :style="wrapperStyle"
	     class="flex h-full w-full flex-col dark:!bg-surface-700 dark:!text-white">
		<div :style="{ opacity: data.toggleMobile ? 1 : 0}"
		     class="fixed top-0 left-0 w-full transition-all duration-300">
			<NavBar :show-buttons="['back', 'home', 'startSlot']"
			        :show-in="['mobile']"
			        custom
			        fixed>
				<template #start>
					<div v-if="data.novel && data.toggleMobile" class="inline-block w-[calc(90vw-90px)]">
						<router-link :to="{name:'info', params:{id: data.novel.id}}" class="flex flex-col">
							<div class="text-xl font-bold line-clamp-1">
								{{ data.novel.name }}
							</div>
							<div class="text-gray-500 dark:text-white line-clamp-1">
								{{ data.novel.author.nickname }}
							</div>
						</router-link>
					</div>
				</template>
			</NavBar>
		</div>
		<div class="flex items-center lg:justify-center max-lg:justify-start" @click="toggleMobile">
			<div :style="readerStyle" :draggable="false"
			     class="h-full w-full max-w-3xl dark:!bg-surface-600 dark:!text-white select-none text-wrap break-words">
				<div v-for="line in lines" v-html="line"></div>
				
				<div class="m-10 flex items-center justify-center gap-3 max-sm:flex-col max-sm:mx-0">
					<router-link v-if="pervChapter"
					             :to="{name:'chapter', params:{id:data.novel.id, cid:pervChapter.id}}"
					             class="flex-1 min-w-[100px] max-sm:w-full"
					             replace>
						<Button v-ripple :style="textStyle" class="dark:!text-white !w-full" outlined
						        severity="secondary">
							<div>
								<div class="text-lg font-bold">{{ t('上一章') }}</div>
								<div class="text-sm">{{ pervChapter.name }}</div>
							</div>
						</Button>
					</router-link>
					<router-link v-if="nextChapter"
					             :to="{name:'chapter', params:{id:data.novel.id, cid:nextChapter.id}}"
					             class="flex-1 min-w-[100px] max-sm:w-full"
					             replace>
						<Button v-ripple :style="textStyle" class="dark:!text-white !w-full" outlined
						        severity="secondary">
							<div>
								<div class="text-lg font-bold">{{ t('下一章') }}</div>
								<div class="text-sm">{{ nextChapter.name }}</div>
							</div>
						</Button>
					</router-link>
				</div>
			</div>
			<div class="fixed top-0 right-0 z-50 flex h-screen flex-col items-center justify-center bg-gray-700 w-[48px] max-sm:hidden">
				<div class="flex flex-1 flex-col">
					<router-link :to="{name:'index'}">
						<Button v-tooltip.left="t('主页')" class="aspect-square !p-0 text-white" outlined
						        severity="secondary"
						        size="small" text>
							<span class="fa-regular fa-home"></span>
						</Button>
					</router-link>
					<router-link :to="{name:'info', params:{id: data.novel.id}}">
						<Button v-tooltip.left="t('小说')" class="aspect-square !p-0 text-white" outlined
						        severity="secondary"
						        size="small" text>
							<span class="fa-regular fa-book-bookmark"></span>
						</Button>
					</router-link>
				</div>
				<div class="">
					<Button v-if="canTranslate(data.novel?.tags || [])"
					        v-tooltip.left="t(isShowTranslate ? '原文' : '翻译')" class="aspect-square !p-0 text-white"
					        outlined severity="secondary"
					        size="small"
					        text @click="isShowTranslate = !isShowTranslate">
						<template v-if="isShowTranslate">
							<span class="fa-regular fa-language"></span>
						</template>
						<template v-else>
							<span class="fa-regular fa-language"></span>
						</template>
					</Button>
					<Button v-tooltip.left="t('目录')" class="aspect-square !p-0 text-white" outlined
					        severity="secondary"
					        size="small"
					        text
					        @click="toggleModal('Chapters')">
						<span class="fa-regular fa-list"></span>
					</Button>
					<Button v-tooltip.left="t(themeButton === 'light' ? '夜间' : '明亮')"
					        class="aspect-square !p-0 text-white"
					        outlined rounded severity="secondary"
					        size="small"
					        text @click="toggleTheme">
						<span v-if="themeButton === 'light'" class="fa-regular fa-moon-stars"></span>
						<span v-else class="fa-regular fa-sun-bright"></span>
					</Button>
					<Button v-tooltip.left="t('设置')" class="aspect-square !p-0 text-white" outlined
					        severity="secondary"
					        size="small"
					        text
					        @click="toggleModal('Settings')">
						<span class="fa-regular fa-gear"></span>
					</Button>
				</div>
				<div class="flex flex-1 flex-col"></div>
			</div>
			<div :class="{
                'flex h-screen w-0 flex-col transition-all duration-300' : true,
                'lg:w-[300px]' : data.toggleSettings,
                'pointer-events-none' : !data.toggleSettings,
			 }">
				<div :class="{
                    'fixed top-0 h-screen w-[300px] transition-all duration-300 opacity-0 shadow-2xl max-lg:right-[48px] max-sm:right-0 dark:!bg-surface-600 dark:!text-white': true,
                    'opacity-100 z-[51]' : data.toggleSettings,
				}" :style="{
                    color: `#${config.chapter.fontColor.replace('#','')}`,
                    backgroundColor: `#${config.chapter.bgColor.replace('#','')}`,
				}">
					<div v-if="data.toggleSettings" class="flex flex-col p-5" @click.stop="() => {}">
						<div class="text-xl font-bold">
							{{ t('设置') }}
						</div>
						<div class="mt-5">
							<div class="flex flex-col justify-between pb-5">
								<div class="mb-5">
									<div class="mb-2 font-bold">
										{{ t('字体') }}
									</div>
									<div class="flex w-full">
										<ClientOnly>
											<Dropdown v-model="config.chapter.font" :options="fonts" class="flex-1"
											          option-value="value" optionLabel="name">
												<template #option="slotProps">
													<div class="flex align-items-center">
													<span :style="{fontFamily: `${slotProps.option.value}`}"
													      class="select-none">
														{{
															slotProps.option.name
														}}
													</span>
													</div>
												</template>
											</Dropdown>
										</ClientOnly>
									</div>
								</div>
								<div class="mb-5">
									<div class="mb-2 font-bold">
										{{ t('字体大小') }}
									</div>
									<div class="w-full">
										<InputNumber v-model="config.chapter.fontSize" :inputStyle="{
													width: '100%',
												}"
										             :max="99"
										             :min="12"
										             buttonLayout="horizontal" showButtons>
											<template #incrementbuttonicon>
												<span class="fa-regular fa-plus"/>
											</template>
											<template #decrementbuttonicon>
												<span class="fa-regular fa-minus"/>
											</template>
										</InputNumber>
									</div>
								</div>
								<div class="mb-5">
									<div class="mb-2 font-bold">
										{{ t('背景颜色') }}
									</div>
									<div class="w-full">
										<ColorPicker v-model="config.chapter.bgColor" :baseZIndex="50"/>
									</div>
								</div>
								<div class="mb-5">
									<div class="mb-2 font-bold">
										{{ t('字体颜色') }}
									</div>
									<div class="w-full">
										<ColorPicker v-model="config.chapter.fontColor" :baseZIndex="50"/>
									</div>
								</div>
								<div class="mb-5">
									<div class="mb-2 font-bold">
										{{ t('边距') }}
									</div>
									<div class="w-full">
										<InputNumber v-model="config.chapter.padding" :inputStyle="{
													width: '100%',
												}"
										             :max="99"
										             :min="0"
										             buttonLayout="horizontal" showButtons>
											<template #incrementbuttonicon>
												<span class="fa-regular fa-plus"/>
											</template>
											<template #decrementbuttonicon>
												<span class="fa-regular fa-minus"/>
											</template>
										</InputNumber>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div :class="{
                'flex h-screen w-0 flex-col transition-all duration-300' : true,
                'lg:w-[300px]' : data.toggleChapters,
                'pointer-events-none' : !data.toggleChapters,
			 }">
				<div :class="{
                    'fixed top-0 h-screen w-[300px] transition-all duration-300 opacity-0 shadow-2xl overflow-y-auto max-lg:right-[48px] max-sm:right-0 dark:!bg-surface-600 dark:!text-white': true,
                    'opacity-100 z-[51]' : data.toggleChapters,
				}" :style="{
                    color: `#${config.chapter.fontColor.replace('#','')}`,
                    backgroundColor: `#${config.chapter.bgColor.replace('#','')}`,
				}" class="chapters-wrapper">
					<div v-if="data.toggleChapters" class="flex flex-col p-5" @click.stop="() => {}">
						<div class="text-xl font-bold">
							{{ t('目录') }}
						</div>
						<div class="mt-5">
							<div class="flex flex-col justify-between pb-5">
								<div v-for="(chapter,idx) in data.chapters"
								     class="flex w-full flex-wrap items-center gap-3 border-b p-2">
									<router-link :to="{name:'chapter', params:{id:data.novel.id,cid:chapter.id}}"
									             replace>
										<div :class="{
                                        'flex-1 flex flex-col gap-2':true,
                                        'text-primary-500': chapter.id === data.chapter?.id,
									}" :data-cid="chapter.id">
											<div class="flex">
												<div class="mr-1 h-min w-min whitespace-nowrap rounded-lg bg-slate-100 px-2 text-xs leading-6 text-slate-700 py-0.5 dark:bg-surface-400 dark:text-white">
													{{ idx + 1 }}
												</div>
												<span class="font-bold">{{ chapter.name }}</span>
											</div>
											<div class="flex items-center gap-2">
												<span>{{ chapter.updated_at }}</span>
											</div>
										</div>
										<span class="font-bold"></span>
									</router-link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="data.toggleMobile"
		     class="fixed bottom-0 left-0 z-20 w-screen bg-white/70 backdrop-blur-sm dark:bg-surface-700/70">
			<div class="flex h-20 flex-1 items-center justify-center gap-3">
				<Button v-if="canTranslate(data.novel?.tags || [])"
				        class="h-full" outlined severity="secondary"
				        text @click="isShowTranslate = !isShowTranslate; data.toggleMobile = false;">
					<div class="flex h-full flex-col items-center justify-center text-black dark:text-white text-surface-600">
						<span class="mb-1 text-xl fa-regular fa-language"></span>
						<template v-if="isShowTranslate">
							<span class="text-sm">{{ t('原文') }}</span>
						</template>
						<template v-else>
							<span class="text-sm">{{ t('翻译') }}</span>
						</template>
					</div>
				</Button>
				<Button class="h-full" outlined severity="secondary"
				        text @click="toggleTheme">
					<div class="flex h-full flex-col items-center justify-center text-black dark:text-white text-surface-600">
						<template v-if="themeButton === 'light'">
							<span class="mb-1 text-xl fa-regular fa-moon-stars"></span>
							<span class="text-sm">{{ t('夜间') }}</span>
						</template>
						<template v-else>
							<span class="mb-1 text-xl fa-regular fa-sun-bright"></span>
							<span class="text-sm">{{ t('明亮') }}</span>
						</template>
					</div>
				</Button>
				<Button class="h-full" href="/settings" outlined
				        severity="secondary"
				        text @click="toggleModal('Chapters')">
					<div class="flex h-full flex-col items-center justify-center text-black dark:text-white text-surface-600">
						<span class="mb-1 text-xl fa-regular fa-list"></span>
						<span class="text-sm">{{ t('目录') }}</span>
					</div>
				</Button>
				<Button class="h-full" href="/settings" outlined
				        severity="secondary"
				        text @click="toggleModal('Settings')">
					<div class="flex h-full flex-col items-center justify-center text-black dark:text-white text-surface-600">
						<span class="mb-1 text-xl fa-regular fa-gear"></span>
						<span class="text-sm">{{ t('设置') }}</span>
					</div>
				</Button>
			</div>
		</div>
		<Dialog v-model:visible="data.loading" :pt="{root: 'border-none', mask: {style: 'backdrop-filter: blur(2px)'}}">
			<template #container="{ closeCallback }">
				<div :style="textStyle" class="flex h-full flex-col items-center justify-center dark:!text-white">
					<i class="fa-regular fa-loader fa-spin"></i>
					<div class="mt-5">{{ t('加载中...') }}</div>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script setup>
import ClientOnly from "@duannx/vue-client-only";
import NavBar from "@/components/layout/NavBar.vue";
import {loadChapter, loadChapters} from "@/api/chapters.js";
import {loadNovel} from "@/api/novels.js";
import {onRouteChange} from "@/utils/router-event.js";
import {onServerData, provideServerData} from "@/utils/ssr.js";
import {useMeta} from "@/utils/meta.js";
import {useConfigProvider} from "@/provider/config.js";
import {processContent} from "@/utils/reader.js";
import {isMobile} from "@/utils/device.js";
import {useHistoryStore} from "@/stores/histories.js";
import {toggleTheme, useTheme} from "@/utils/theme.js";
import {canTranslate, useTranslate} from "@/utils/translate.js";
import {useI18n} from "@/i18n/index.js";

const {t, locale} = useI18n();

const historyStore = useHistoryStore();

const config = useConfigProvider();

const parent = ref(null);
const isMounted = ref(false);

const data = reactive({
    toggleMobile: false,
    toggleSettings: false,
    toggleChapters: false,
    
    loading: false,
    
    novel: {
        id: 0,
        name: '',
    },
    chapter: {
        id: 0,
        name: '',
        content: '',
    },
    chapters: [],
});

const wrapperStyle = computed(() => {
    let color = config.chapter.bgColor;
    let r = 0;
    let g = 0;
    let b = 0;
    if (color.indexOf(',') !== -1) {
        color = color.substring(5, color.length - 1).split(',').map((item) => {
            return parseInt(item);
        });
        r = color[0];
        g = color[1];
        b = color[2];
    } else {
        if (color.startsWith('#'))
            color = color.substring(1);
        r = parseInt(color.substring(0, 2), 16);
        g = parseInt(color.substring(2, 4), 16);
        b = parseInt(color.substring(4, 6), 16);
    }
    r = Math.max(0, r - 10);
    g = Math.max(0, g - 10);
    b = Math.max(0, b - 10);
    return {
        backgroundColor: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
    }
});

const readerStyle = computed(() => {
    return {
        fontSize: `${config.chapter.fontSize}px`,
        color: `#${config.chapter.fontColor}`,
        backgroundColor: `#${config.chapter.bgColor}`,
        padding: `${config.chapter.padding}px`,
        fontFamily: config.chapter.font,
    }
});

const textStyle = computed(() => {
    return {
        color: `#${config.chapter.fontColor}`,
        fontFamily: config.chapter.font,
    }
});

const fonts = computed(() => {
    let fonts = [
        {name: t('微软雅黑'), value: '微软雅黑', default: false, lineHeight: 1.3},
        {name: t('MiSans'), value: 'MiSans', default: true, lineHeight: 1.3},
        {name: t('思源黑体'), value: 'Noto Sans SC', default: true, lineHeight: 1.4},
        {name: t('黑体'), value: '黑体', default: false, lineHeight: 1.2},
        {name: t('宋体'), value: '宋体', default: false, lineHeight: 1.1},
        {name: t('楷体'), value: '楷体', default: false, lineHeight: 1.1},
        {name: t('仿宋'), value: '仿宋', default: false, lineHeight: 1.1},
        {name: t('Helvetica'), value: 'Helvetica', default: true, lineHeight: 1.2},
    ];
    fonts = fonts.filter((font) => {
        let result = false;
        if (!import.meta.env.SSR || isMounted.value) {
            if ('fonts' in document) {
                result = document.fonts.check(`12px ${font.name}`);
            }
        }
        return result ? result : font.default;
    });
    return fonts;
});

const isShowTranslate = ref(config.global.autoTranslate);

const chapterName = useTranslate(
    computed(() => isShowTranslate.value && canTranslate(data.novel?.tags || [])),
    computed(() => data.chapter?.name)
);

const chapterContent = useTranslate(
    computed(() => isShowTranslate.value && canTranslate(data.novel?.tags || [])),
    computed(() => data.chapter?.content)
);


const lines = computed(() => {
    let content = `[title]${chapterName.value || data.chapter?.name}[/title]\n\n` + (chapterContent.value || data.chapter?.content);
    let parts = content.replace("\n\n", "\n").split("\n").filter((part) => part.length > 0).map((part) => {
        return part.trim();
    });
    let lines = [];
    parts.forEach((part) => {
        part = '&emsp;&emsp;' + part;
        lines = lines.concat(processContent(
            part,
            config.chapter.fontSize
        ));
        lines = lines.concat(['<br>']);
    })
    return lines;
});

const pervChapter = computed(() => {
    let index = data.chapters.findIndex((chapter) => chapter.id === data.chapter.id);
    if (index === -1) {
        return null;
    }
    if (index === 0) {
        return null;
    }
    return data.chapters[index - 1];
});

const nextChapter = computed(() => {
    let index = data.chapters.findIndex((chapter) => chapter.id === data.chapter.id);
    if (index === -1) {
        return null;
    }
    if (index === data.chapters.length - 1) {
        return null;
    }
    return data.chapters[index + 1];
});

const theme = useTheme();
const themeButton = computed(() => {
    if (!isMounted.value) {
        return 'light';
    }
    return theme.value;
});

onRouteChange(to => {
    if (data.chapter.id !== to.params.cid) {
        //const needLoad = data.novel.id !== 0;
        data.novel.id = to.params.id;
        data.chapter.id = to.params.cid;
        // if (needLoad) {
        //     data.loading = true;
        //     loadData();
        // }
    }
});

onMounted(() => {
    isMounted.value = true;
});

watchEffect(() => {
    if (data.novel && data.chapter) {
        useMeta({
            title: `${data.chapter.name} - ${data.novel.name}`,
            description: data.novel.desc,
            image: data.novel.cover,
        });
        if (!import.meta.env.SSR) {
            nextTick(() => historyStore.save(data.novel.id, data.chapter.id));
        }
    }
});


onServerPrefetch(() => {
    const instance = getCurrentInstance();
    return loadData().then(() => {
        provideServerData({
            data: data.novel,
            reqId: `novel-${data.novel.id}`,
            instance,
        });
        provideServerData({
            data: data.chapters,
            reqId: `novel-${data.novel.id}-chapters`,
            instance,
        });
        provideServerData({
            data: data.chapter,
            reqId: `chapter-${data.chapter.id}`,
            instance,
        })
        if (data.novel) {
            useMeta({
                title: `${data.chapter.name} - ${data.novel.name}`,
                description: data.novel.desc,
                image: data.novel.cover,
            });
        }
    });
});

(() => {
    const tasks = [];
    tasks.push(
        onServerData((novel) => {
            data.novel = novel;
        }, `novel-${data.novel.id}`)
    );
    tasks.push(
        onServerData((chapters) => {
            data.chapters = chapters;
        }, `novel-${data.novel.id}-chapters`)
    );
    tasks.push(
        onServerData((chapter) => {
            data.chapter = chapter;
        }, `chapter-${data.chapter.id}`)
    );
    Promise.all(tasks).catch(err => {
        console.log(err)
        data.loading = true;
        return loadData();
    })
})();

function loadData() {
    const tasks = [];
    if (!data.novel || !data.novel.name) {
        tasks.push(
            loadNovel({
                id: data.novel.id,
                onCache: (novel) => {
                    data.novel = novel;
                },
                ignoreReq: import.meta.env.SSR,
                lang: locale(),
            }).then((novel) => {
                data.novel = novel;
            }).catch((e) => {
                data.novel = null;
            })
        );
    }
    if (data.chapters.length === 0) {
        tasks.push(
            loadChapters({
                novelId: data.novel.id,
                onCache: (chapters) => {
                    data.chapters = chapters;
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
    }
    tasks.push(
        loadChapter({
            id: data.chapter.id,
            novelId: data.novel.id,
            onCache: (chapter) => {
                data.chapter = chapter;
                data.loading = false;
                if (!import.meta.env.SSR) {
                    window.scroll({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            ignoreReq: import.meta.env.SSR,
        }).then((chapter) => {
            data.chapter = chapter;
            if (!import.meta.env.SSR) {
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }).catch((e) => {
            console.error(e);
            data.chapter = [];
        })
    )
    return Promise.all(tasks).then(() => {
        data.loading = false;
    });
}

function toggleModal(type = 'Settings') {
    if (type === 'Chapters') {
        data.toggleChapters = !data.toggleChapters;
        nextTick(() => {
            data.toggleSettings = false;
            let el = document.querySelector(`[data-cid="${data.chapter.id}"]`);
            if (el) {
                el.scrollIntoView({block: 'center'});
            }
        });
    } else {
        data.toggleSettings = !data.toggleSettings;
        nextTick(() => {
            data.toggleChapters = false;
        });
    }
    data.toggleMobile = false;
}

function toggleMobile() {
    if (!isMobile.value) {
        return;
    }
    if (data.toggleChapters || data.toggleSettings) {
        data.toggleChapters = false;
        data.toggleSettings = false;
        return;
    }
    data.toggleMobile = !data.toggleMobile;
}
</script>

<style scoped>
.chapters-wrapper::-webkit-scrollbar {
    background-color: transparent;
}
</style>
