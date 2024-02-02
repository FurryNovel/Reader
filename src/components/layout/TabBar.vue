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
import {isMobile} from "@/utils/mobile.js";

const router = useRouter();

const wrapperClass = computed(() => {
    return {
        'backdrop-blur-sm': true,
        'bg-white/70': true,
        'w-screen': true,
        'z-50': true,
        'h-[64px]': true,
        'flex': true,
    };
});

const showWrapper = computed(() => {
	return !(isMobile && routes.filter(route => route.showNav && route.isActive(router)).length === 0);
});



let items = ref(routes.filter(route => route.showNav).map(route => {
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
