<template>
	<div class="bg-gray-50" style="min-height: calc(100vh - 64px)">
		<Navbar v-if="props.hasNavbar"></Navbar>
		<div>
			<div v-if="props.hasNavbar" class="mt-[64px]"></div>
			<slot/>
		</div>
	</div>
	<MainAlert/>
	
</template>

<script setup>
import Navbar from "@/components/layout/Navbar.vue";
import MainAlert from "@/components/layout/MainAlert.vue";

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
