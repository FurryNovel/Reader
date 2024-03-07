<template>
	<div class="flex flex-1  max-sm:flex-col rounded bg-white p-3 text-surface-600 dark:bg-surface-600 dark:text-white gap-3">
		<a v-for="link in config.links" :href="link.link" :title="link.desc"
		   class="flex w-[400px] gap-3 max-sm:w-full rounded-xl bg-gray-50 transition duration-300 sm:hover:shadow-2xl dark:bg-surface-500 dark:text-white p-5" target="_blank">
			<div class="flex items-center justify-center">
				<img :src="link.logo" class="aspect-square"/>
			</div>
			<div class=" flex flex-col justify-center gap-1 p-3">
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
