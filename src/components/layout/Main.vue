<template>
	<div class="bg-gray-50 min-h-[calc(100vh-64px)] h-full dark:bg-surface-700">
		<div class="h-full w-full max-w-screen-xl flex flex-col mx-auto rounded-md bg-surface-50 dark:bg-surface-700 sm:border border-surface-200 dark:border-surface-700">
			<NavBar>
				<slot/>
			</NavBar>
			<TabBar/>
		</div>
	</div>
	<MainNotification/>
	<ChallengeModal/>
</template>

<script setup>
import NavBar from "@/components/layout/NavBar.vue";
import MainNotification from "@/components/global/MainNotification.vue";
import ChallengeModal from "@/components/global/ChallengeModal.vue";
import TabBar from "@/components/layout/TabBar.vue";

const props = defineProps({
    hasNavbar: {
        type: Boolean,
        default: true
    },
    hasTabbar: {
        type: Boolean,
        default: true
    },
})


</script>


<style scoped>

</style>
