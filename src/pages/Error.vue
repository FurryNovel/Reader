<template>
	<div class="flex h-full w-full flex-col">
		<div class="flex flex-1 flex-col rounded bg-white text-black sm:p-10 dark:bg-surface-600 dark:text-white">
			<div class="flex flex-col items-center justify-center min-h-[calc(100vh-208px)] max-sm:h-full w-full">
				<div class="flex flex-col items-center justify-center h-[400px]">
					<div class="mb-2 text-2xl font-bold">404 - {{ t('页面未找到') }}</div>
					<div class="justify-center text-gray-500 dark:text-white text-center">
						<p>
							{{ t('我们可能遇到了一些问题，无法找到这个页面。') }}
						</p>
						<div>
							{{ t('请再试一次或') }}
							<router-link :to="{name:'index'}">{{ t('返回主页') }}</router-link>
						</div>
					</div>
				</div>
				<div class="flex mt-10 flex-col justify-center w-[70vw] p-5 max-sm:w-full">
					<div class="text-gray-500 dark:text-white p-2">{{ t('猜你喜欢') }}</div>
					<ClientOnly>
						<NovelList :limit="14" list-style="style1" type="random"/>
					</ClientOnly>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import {useI18n} from "@/i18n/index.js";

const {t} = useI18n();
import NovelList from "@/components/views/NovelList.vue";
</script>

<style scoped>

</style>
