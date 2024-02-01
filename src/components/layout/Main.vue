<template>
	<div class="bg-gray-50 min-h-[calc(100vh)-64px]">
		<NavBar>
			<slot />
		</NavBar>
		<TabBar />
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
