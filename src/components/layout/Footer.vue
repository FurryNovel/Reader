<template>
	<template v-if="showWrapper">
		<footer class="mt-1 flex min-h-32 w-full flex-col gap-3 rounded border-t bg-white p-5 text-sm text-surface-600 dark:bg-surface-600 dark:text-white border-surface-200 dark:border-surface-600">
			<div class="flex items-center justify-center gap-3 pb-2">
				<div class="flex w-64 flex-col items-center justify-start">
					<p class="text-lg font-bold text-black dark:text-white pb-2">关于我们</p>
					<a href="https://github.com/FurryNovel/Reader">
						<i class="fa-brands fa-github"></i>&nbsp;GitHub
					</a>
					<a href="https://status.furrynovel.com/">网站状态</a>
					<router-link :to="{name:'about'}">联系我们</router-link>
				</div>
				<div class="flex w-64 flex-col items-center justify-start">
					<p class="text-lg font-bold text-black dark:text-white pb-2">友情链接</p>
					<a v-for="link in config.links" :href="link.link" :title="link.desc">
						{{link.name}}
					</a>
					<a href="/">&nbsp;</a>
					<a href="/api/sitemap/index.xml">站点地图</a>
				</div>
			</div>
			<div class="flex w-full items-center justify-center gap-3 text-xs">
				<p class="font-bold">{{ config.title }}</p>
				{{ config.host.toUpperCase() }} &copy; 2024
			</div>
			<div class="flex w-full items-center justify-center gap-1 text-xs">
				Build
				<p class="font-bold">{{ APP_VERSION }}</p>
			</div>
			<div class="sm:hidden pb-[64px]"></div>
		</footer>
	</template>
</template>

<script setup>
import {routes} from "@/router.js";

import config from "@/config.js";

const APP_VERSION = __APP_VERSION;

const router = useRouter();

const isMounted = ref(false);

const showWrapper = computed(() => {
    return !(routes.filter(route => route.meta.layout.showInNavBar && route.isActive(router)).length === 0);
});

onMounted(() => {
    isMounted.value = true;
})

</script>

<style scoped>

</style>
