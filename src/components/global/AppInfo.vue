<template>
	<ClientOnly>
		<div class="flex flex-col justify-center items-end flex-wrap w-full">
			<div class="flex-1 fixed top-[64px] z-40 sm:w-84 max-sm:w-full backdrop-blur-sm">
				<Message v-if="serviceWorker.isNeedRefresh" class="mt-0" severity="success"
				         @click="doUpdate()"
				         @close.prevent.stop="() => {}">
					<template #messageicon>
						<Avatar v-if="deviceInfo.isMobile"
						        class="mr-4 flex justify-center align-middle"
						        image="/static/icon.png" shape="circle"/>
					</template>
					<span class="ml-2">{{ t('发现新的版本，点击更新') }}</span>
				</Message>
				<Message v-if="serviceWorker.isOffline" class="mt-0" severity="info"
				         @close.prevent.stop="() => {}">
					<template #messageicon>
						<Avatar v-if="deviceInfo.isMobile"
						        class="mr-4 flex justify-center align-middle"
						        image="/static/icon.png" shape="circle"/>
					</template>
					<span class="ml-2">{{ t('当前处于离线状态') }}</span>
				</Message>
			</div>
			<div class="flex-1 fixed max-sm:bottom-[64px] sm:bottom-0 z-40 sm:w-84 max-sm:w-full backdrop-blur-sm">
				<Message v-if="serviceWorker.installer && userConfig.global.pwaInstaller" class="!my-0 lg:hidden"
				         severity="info">
					<template #container="{closeCallback}">
						<div class="flex gap-3 items-center justify-between py-5 px-7">
							<Avatar v-if="deviceInfo.isMobile" class="flex justify-center align-middle"
							        image="/static/icon.png" shape="circle"/>
							<div class="flex flex-1 flex-col justify-center">
								<span>{{ config.title }}</span>
								<span class="dark:text-primary-50 text-surface-500">{{ t('PWA版本现已可用') }}</span>
							</div>
							<div class="flex sm:flex-wrap gap-1 max-sm:flex-col">
								<Button :label="t('立即安装')" class="text-primary-500 dark:text-white" size="small"
								        @click="install"/>
								<Button :label="t('不再提示')" class="text-primary-500 dark:text-white" size="small"
								        text
								        @click="dismissInstaller();closeCallback();"/>
							</div>
						</div>
					</template>
				</Message>
			</div>
		</div>
	</ClientOnly>
</template>
<script setup>
import {useServiceWorker, registerServerWorker} from "@/pwa.js";
import {useDeviceInfo} from "@/utils/device.js";
import config from "@/config.js";
import {useConfigProvider} from "@/provider/config.js";
import {useI18n} from "@/i18n/index.js";

const {t} = useI18n();

const serviceWorker = useServiceWorker();
const deviceInfo = useDeviceInfo();
const userConfig = useConfigProvider();


const props = defineProps({});

function doUpdate() {
    serviceWorker.value.update();
}

function install() {
    serviceWorker.value.install();
}

function dismissInstaller() {
    userConfig.global.pwaInstaller = false;
}
</script>

<style scoped>

</style>
