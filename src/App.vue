<template>
	<Main>
		<router-view v-slot="{ Component }">
			<Suspense>
				<component :is="Component"/>
				<template #fallback>
					<div class="flex justify-center items-center h-screen w-screen">
						<Button label="primary">
							重试
						</Button>
					</div>
				</template>
			</Suspense>
		</router-view>
	</Main>
</template>

<style>

</style>
<script setup>
import {initDeviceEvent} from "@/utils/device.js";
import {initMeta} from "@/utils/meta.js";
import {initCookieManager} from "@/utils/cookie.js";
import {initRouterEvent} from "@/utils/router-event.js";
import {initThemeManager, onThemeChange} from "@/utils/theme.js";

initMeta(useRouter());
initRouterEvent(useRouter());
onBeforeMount(() => {
    initDeviceEvent();
    initCookieManager();
    initThemeManager();
});

onThemeChange(({theme}) => {
    if (!import.meta.env.SSR) {
        document.documentElement.classList = [theme]
    }
});
</script>
