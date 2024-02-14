<template>
	<div class="flex h-full w-full flex-col max-sm:h-screen" :style="wrapperStyle">
		<NavBar v-if="data.toggleNavBar" :show-in="['mobile']" :show-buttons="['search', 'settings', 'back', 'home']"/>
		<div class="flex items-center justify-center">
			<div class="h-full w-full max-w-3xl" :style="readerStyle">
				<div v-for="line in lines" class="select-none" :draggable="false" v-html="line"></div>
			</div>
		</div>
	</div>
</template>

<script setup>
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
    toggleNavBar: false,
    
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
    color = color.substring(5, color.length - 1).split(',').map((item) => {
        return parseInt(item);
    });
    let r = color[0];
    let g = color[1];
    let b = color[2];
    r = Math.max(0, r - 10);
    g = Math.max(0, g - 10);
    b = Math.max(0, b - 10);
    return {
        backgroundColor: `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`,
    }
});

const readerStyle = computed(() => {
    return {
        fontSize: `${config.chapter.fontSize}px`,
        color: config.chapter.fontColor,
        backgroundColor: config.chapter.bgColor,
        padding: `${config.chapter.padding}px`,
    }
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
</script>

<style scoped>

</style>
