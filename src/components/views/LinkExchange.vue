<template>
	<div class="flex flex-1 gap-3 rounded bg-white p-3 max-sm:flex-col text-surface-600 dark:bg-surface-600 dark:text-white">
		<a v-for="link in config.links" :href="link.link" :title="link.desc"
		   class="flex gap-3 rounded-xl bg-gray-50 p-5 transition duration-300 w-[400px] max-sm:w-full sm:hover:shadow-2xl dark:bg-surface-500 dark:text-white" target="_blank">
			<div class="flex items-center justify-center">
				<img :src="link.logo" class="aspect-square"/>
			</div>
			<div class="flex flex-col justify-center gap-1 p-3">
				<p class="text-xl font-bold">{{ link.name }}</p>
				<p class="flex-1 text-sm">
					{{ link.desc }}
				</p>
			</div>
		</a>
	</div>
</template>

<script setup>
import config from "@/config.js";
</script>

<style scoped>

</style>
