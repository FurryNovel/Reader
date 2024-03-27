<template>
	<div class="sm:hidden fixed bottom-0 left-0 w-screen bg-transparent z-50">
		<div v-if="showWrapper" :class="wrapperClass">
			<router-link v-for="item in items" v-slot="{ href, navigate }" :to="item" custom>
				<a v-ripple :draggable="false" :href="href"
				   class="flex-1 flex flex-col justify-center align-middle text-center"
				   @click="e => { if(!item.isActive) changeKeepAlive(); navigate(e); }">
					<template v-if="item.isActive">
						<span v-if="item.icon"
						      :class="{
	                            'text-primary-500 text-lg':true,
	                            [item.icon.text]:true,
						      }">
						</span>
						<span class="text-primary-500 text-sm">{{ t(item.label) }}</span>
					</template>
					<template v-else>
						<span v-if="item.icon" :class="{
	                            'text-lg':true,
	                            [item.icon.text]:true,
						      }"
						      :style="{fontSize:item.icon.fontSize}">
						</span>
						<span class="text-sm">{{ t(item.label) }}</span>
					</template>
				</a>
			</router-link>
		</div>
	</div>
</template>

<script setup>
import {routes} from "@/router.js";
import {isMobile} from "@/utils/device.js";
import {useI18n} from "@/i18n/index.js";
import eventbus from "@/utils/eventbus.js";

const {t} = useI18n();

const router = useRouter();

const wrapperClass = computed(() => {
    return {
        'backdrop-blur-sm': true,
        'bg-white/70 dark:bg-surface-700/70': true,
        'text-surface-500 dark:text-surface-300': true,
        'w-screen': true,
        'z-50': true,
        'h-[64px]': true,
        'flex': true,
    };
});

const isMounted = ref(false);
const showWrapper = computed(() => {
    if (!isMounted.value) return false;
    return !(isMobile.value && routes.filter(route => route.meta.layout.showInNavBar && route.isActive(router)).length === 0);
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
        name: route?.name,
        params: route.params,
        isActive: computed(() => route.isActive(router)),
    }
}));

function changeKeepAlive() {
    eventbus.emit('onKeepAliveStatus', false);
}
</script>
<style scoped>

</style>
