<script setup>
import Giscus from '@giscus/vue';
import ClientOnly from "@duannx/vue-client-only";
import {useTheme} from "@/utils/theme.js";
const theme = useTheme();

</script>
<template>
	<ClientOnly>
		<Giscus
				async
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
				:theme="theme"
		/>
	</ClientOnly>
</template>

<style scoped>

</style>
