<template>
	<div class="flex h-full w-full flex-col max-sm:h-screen" :style="wrapperStyle">
		<div :style="{ opacity: data.toggleMobile ? 1 : 0}"
		     class="transition-all duration-300">
			<NavBar :show-in="['mobile']" :show-buttons="['back', 'home', 'startSlot']"
			        fixed
			        custom>
				<template #start>
					<div v-if="data.novel && data.toggleMobile" class="inline-block w-[calc(90vw-90px)]">
						<div class="flex flex-col">
							<div class="text-xl font-bold line-clamp-1">
								{{ data.novel.name }}
							</div>
							<div class="text-gray-500 dark:text-white line-clamp-1">
								{{ data.novel.author.nickname }}
							</div>
						</div>
					</div>
				</template>
			</NavBar>
		</div>
		<div class="flex items-center lg:justify-center max-lg:justify-start" @click="toggleMobile">
			<div class="h-full w-full max-w-3xl" :style="readerStyle">
				<div v-for="line in lines" class="select-none" :draggable="false" v-html="line"></div>
			</div>
			<div class="fixed top-0 right-0 z-50 flex h-screen flex-col items-center justify-center bg-gray-700 w-[48px] max-sm:hidden">
				<Button v-ripple class="aspect-square !p-0 text-white" href="/settings" outlined severity="secondary"
				        size="small"
				        @click="toggleModal('Chapters')"
				        text>
					<span class="fa-regular fa-list"></span>
				</Button>
				<Button v-ripple class="aspect-square !p-0 text-white" href="/settings" outlined severity="secondary"
				        size="small"
				        @click="toggleModal('Settings')"
				        text>
					<span class="fa-regular fa-gear"></span>
				</Button>
			</div>
			<div :class="{
                'flex h-screen w-0 flex-col transition-all duration-300' : true,
                'lg:w-64' : data.toggleSettings,
			 }">
				<div :style="{
                    color: `#${config.chapter.fontColor}`,
                    backgroundColor: `#${config.chapter.bgColor}`,
				}" :class="{
                    'fixed top-0 h-screen w-64 transition-all duration-300 opacity-0 shadow-2xl max-lg:right-[48px] max-sm:right-0': true,
                    'opacity-100' : data.toggleSettings,
				}">
					<div v-if="data.toggleSettings" class="flex flex-col p-5">
						<div class="text-xl font-bold">
							设置
						</div>
						<div class="mt-5">
							<div class="flex flex-col justify-between pb-5">
								<div class="mb-5">
									<div class="mb-2 font-bold">
										字体
									</div>
									<div class="w-full">
										<ClientOnly>
											<Dropdown v-model="config.chapter.font" :options="fonts" optionLabel="name"
											          option-value="value">
												<template #option="slotProps">
													<div class="flex align-items-center">
													<span class="1" :style="{fontFamily: `${slotProps.option.value}`}">
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
										字体大小
									</div>
									<div class="w-full">
										<InputNumber v-model="config.chapter.fontSize" showButtons
										             buttonLayout="horizontal"
										             :inputStyle="{
													width: '100%',
												}"
										             :min="12" :max="99">
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
										背景颜色
									</div>
									<div class="w-full">
										<ColorPicker v-model="config.chapter.bgColor"/>
									</div>
								</div>
								<div class="mb-5">
									<div class="mb-2 font-bold">
										字体颜色
									</div>
									<div class="w-full">
										<ColorPicker v-model="config.chapter.fontColor"/>
									</div>
								</div>
								<div class="mb-5">
									<div class="mb-2 font-bold">
										边距
									</div>
									<div class="w-full">
										<InputNumber v-model="config.chapter.padding" showButtons
										             buttonLayout="horizontal"
										             :inputStyle="{
													width: '100%',
												}"
										             :min="0" :max="99">
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
			 }">
				<div class="chapters-wrapper" :style="{
                    color: `#${config.chapter.fontColor}`,
                    backgroundColor: `#${config.chapter.bgColor}`,
				}" :class="{
                    'fixed top-0 h-screen w-[300px] transition-all duration-300 opacity-0 shadow-2xl overflow-y-auto max-lg:right-[48px] max-sm:right-0': true,
                    'opacity-100' : data.toggleChapters,
				}">
					<div v-if="data.toggleChapters" class="flex flex-col p-5">
						<div class="text-xl font-bold">
							目录
						</div>
						<div class="mt-5">
							<div class="flex flex-col justify-between pb-5">
								<router-link v-for="chapter in data.chapters"
								             :to="{name:'chapter', params:{id:data.novel.id,cid:chapter.id}}"
								             class="flex flex-wrap p-2 items-center gap-3 w-full border-b">
									<div class="flex-1 flex flex-col gap-2">
										<span class="font-bold">{{ chapter.name }}</span>
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
		<div v-if="data.toggleMobile" class=""></div>
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

const config = useConfigProvider();

const parent = ref(null);
const isMounted = ref(false);

const data = reactive({
    toggleMobile: false,
    toggleSettings: false,
    toggleChapters: false,
    
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

const fonts = computed(() => {
    let fonts = [
        {name: '微软雅黑', value: '微软雅黑', default: false, lineHeight: 1.3},
        {name: 'MiSans', value: 'MiSans', default: true, lineHeight: 1.3},
        {name: '思源黑体', value: 'Noto Sans SC', default: true, lineHeight: 1.4},
        {name: '黑体', value: '黑体', default: false, lineHeight: 1.2},
        {name: '宋体', value: '宋体', default: false, lineHeight: 1.1},
        {name: '楷体', value: '楷体', default: false, lineHeight: 1.1},
        {name: '仿宋', value: '仿宋', default: false, lineHeight: 1.1},
        {name: 'Helvetica', value: 'Helvetica', default: true, lineHeight: 1.2},
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

const lines = computed(() => {
    let content = `[title]${data.chapter.name}[/title]\n\n` + data.chapter.content;
    let parts = content.replace("\n\n", "\n").split("\n").filter((part) => part.length > 0).map((part) => {
        return part.trim();
    });
    let lines = [];
    parts.forEach((part) => {
        lines = lines.concat(processContent(
            part,
            config.chapter.fontSize
        ));
        lines = lines.concat(['<br>']);
    })
    return lines;
});

onRouteChange(to => {
    data.novel.id = to.params.id;
    data.chapter.id = to.params.cid;
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
        data.loading = true;
        return loadData();
    })
})();

function loadData() {
    const tasks = [];
    tasks.push(
        loadNovel({
            id: data.novel.id,
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
            novelId: data.novel.id,
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
    tasks.push(
        loadChapter({
            id: data.chapter.id,
            novelId: data.novel.id,
            onCache: (chapter) => {
                data.chapter = chapter;
            },
            ignoreReq: import.meta.env.SSR,
        }).then((chapter) => {
            data.chapter = chapter;
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
        nextTick(() => {
            data.toggleChapters = !data.toggleChapters;
        });
        data.toggleSettings = false;
    } else {
        nextTick(() => {
            data.toggleSettings = !data.toggleSettings;
        });
        data.toggleChapters = false;
    }
}

function toggleMobile() {
    data.toggleMobile = !data.toggleMobile;
    
}
</script>

<style scoped>
.chapters-wrapper::-webkit-scrollbar {
    background-color: transparent;
}
</style>
