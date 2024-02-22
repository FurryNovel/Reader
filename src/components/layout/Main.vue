<template>
	<div class="min-h-[calc(100vh-64px)]">
		<div :class="wrapperStyle">
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
import eventbus from "@/utils/eventbus.js";
import {onRouteChange} from "@/utils/router-event.js";

const router = useRouter();
const wrapperStyle = ref('');

router.beforeEach((to, from, next) => {
    changeStyle(to)
    next();
});
onRouteChange(to => changeStyle(to));

function changeStyle(to) {
    if (to.meta.style?.navBar !== undefined) {
        wrapperStyle.value = to.meta.style.navBar;
    } else {
        wrapperStyle.value = 'h-full w-full max-w-screen-xl flex flex-col mx-auto rounded-md bg-surface-50 dark:bg-surface-700 sm:border border-surface-200 dark:border-surface-700';
    }
}

</script>


<style scoped>

</style>
