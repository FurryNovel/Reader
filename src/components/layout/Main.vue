<template>
	<div class="bg-gray-50 min-h-[calc(100vh)-64px]">
		<NavBar />
		<div>
			<div class="mt-[64px]"></div>
			<slot/>
		</div>
		<div class="sm:hidden fixed bottom-0 left-0 w-screen bg-transparent">
			<TabBar />
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
