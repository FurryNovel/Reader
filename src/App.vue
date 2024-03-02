<template>
	<Main>
		<Suspense>
			<template #default>
				<router-view></router-view>
			</template>
		</Suspense>
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
import {initServiceWorker} from "@/pwa.js";

initMeta(useRouter());
initRouterEvent(useRouter());
onBeforeMount(() => {
    initDeviceEvent();
    initCookieManager();
    initThemeManager();
    initServiceWorker();
});

onThemeChange(({theme}) => {
    if (!import.meta.env.SSR) {
        document.documentElement.classList = [theme]
    }
});
</script>
