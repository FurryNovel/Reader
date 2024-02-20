<template>
	<div class="sm:hidden fixed bottom-0 left-0 w-screen bg-transparent">
		<div v-if="showWrapper" :class="wrapperClass">
			<router-link v-for="item in items" :to="item.route"
			             class="flex-1 flex flex-col justify-center align-middle text-center">
				<template v-if="item.isActive">
				<span v-if="item.icon"
				      class="fa-regular text-primary-500 text-lg">{{ item.icon.text }}</span>
					<span class="text-primary-500 text-sm">{{ item.label }}</span>
				
				</template>
				<template v-else>
				<span v-if="item.icon" :style="{fontSize:item.icon.fontSize}"
				      class="fa-regular text-lg">{{ item.icon.text }}</span>
					<span class="text-sm">{{ item.label }}</span>
				</template>
			</router-link>
		</div>
	</div>
</template>

<script setup>
import {routes} from "@/router.js";
import {isMobile} from "@/utils/device.js";

const router = useRouter();

const wrapperClass = computed(() => {
    return {
        'backdrop-blur-sm': true,
        'bg-white/70 max-sm:bg-surface-700/70': true,
        'text-black max-sm:text-surface-300': true,
        'w-screen': true,
        'z-50': true,
        'h-[64px]': true,
        'flex': true,
    };
});

const isMounted = ref(false);
const showWrapper = computed(() => {
    if (!isMounted.value) return false;
    return !(isMobile && routes.filter(route => route.meta.layout.showInNavBar && route.isActive(router)).length === 0);
});
onMounted(() => {
    isMounted.value = true;
})


let items = ref(routes.filter(route => route.meta.layout.showInNavBar).map(route => {
    return {
        ...route.meta,
        label: route.meta.title,
        icon: route.meta.icon,
        route: route.path,
        isActive: computed(() => route.isActive(router)),
    }
}));
</script>
<style scoped>

</style>
