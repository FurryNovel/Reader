<script setup>
import Giscus from '@giscus/vue';
import ClientOnly from "@duannx/vue-client-only";
import {useTheme} from "@/utils/theme.js";
import Skeleton from "primevue/skeleton";

const theme = useTheme();

const comments = ref(null);
const loading = ref(true);

function getFrame() {
    let root = comments.value?.$el?.shadowRoot;
    if (!root) {
        return new Promise((resolve) => {
            let f = () => {
                root = comments.value?.$el?.shadowRoot;
                if (root) {
                    resolve(root.querySelector('iframe'));
                } else {
                    setTimeout(f, 500);
                }
            };
            setTimeout(f, 500)
        });
    }
    return Promise.resolve(root.querySelector('iframe'));
}

const observer = import.meta.env.SSR ? null : new ResizeObserver(entries => {
    for (let entry of entries) {
        entry.target.style.minHeight = `${Number(entry.target.style.height.replace('px', '')) + 32}px`;
        if (Number(entry.target.style.height.replace('px', '')) >= 372) {
            loading.value = false;
        }
    }
});

function onLoad() {
    if (observer) {
        getFrame().then(frame => observer.observe(frame));
    }
}

onMounted(() => {
    loading.value = true;
    nextTick(() => {
        getFrame().then(frame => {
            frame.addEventListener('load', onLoad);
        }).catch(err => {
            console.error(err);
        });
    });
});
onUnmounted(() => {
    getFrame().then(frame => {
        if (observer) {
            observer.disconnect();
        }
        frame.removeEventListener('load', onLoad);
    }).catch(err => {
        console.error(err);
    });
});
</script>

<template>
	<ClientOnly>
		<div v-if="loading" class="flex flex-col gap-1">
			<Skeleton class="mb-2 text-xl font-bold" height="24px" width="100px"></Skeleton>
			<Skeleton class="" height="20px" width="300px"></Skeleton>
			<Skeleton class="" height="20px" width="300px"></Skeleton>
			<Skeleton class="" height="20px" width="300px"></Skeleton>
		</div>
		<Giscus ref="comments"
		        :theme="theme"
		        category-id="DIC_kwDOLWTxu84CdbVq"
		        crossorigin="anonymous"
		        emit-metadata="0"
		        input-position="top"
		        lang="zh-CN"
		        loading="lazy"
		        mapping="pathname"
		        reactions-enabled="1"
		        repo="FurryNovel/Comments"
		        repo-id="R_kgDOLWTxuw"
		        strict="1"
		/>
	</ClientOnly>
</template>
