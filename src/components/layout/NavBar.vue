<template>
	<Menubar v-if="showWrapper" :class="wrapperClass" :model="items">
		<template #start>
			<Avatar v-if="showIcon && props.showButtons.includes('icon')"
			        class="mx-4 flex justify-center bg-transparent align-middle"
			        image="/static/icon.png" shape="circle"/>
			<template v-if="props.showButtons.includes('back') && canBack">
				<Button v-ripple class="w-[45px] h-[45px]" outlined rounded severity="secondary"
				        size="small"
				        text @click="router.back()">
					<span class="fa-regular fa-chevron-left"></span>
				</Button>
			</template>
			<template v-if="props.showButtons.includes('home')">
				<router-link v-if="props.showButtons.includes('settings')" :to="{name:'index'}">
					<Button v-ripple class="w-[45px] h-[45px]" href="/" outlined rounded severity="secondary"
					        size="small"
					        text @click="navigate">
						<span class="fa-regular fa-home"></span>
					</Button>
				</router-link>
			</template>
			<template v-if="props.showButtons.includes('startSlot')">
				<slot name="start" />
			</template>
		</template>
		<template #item="{ item, props, hasSubmenu, root }">
			<router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
				<a v-if="item.isActive" v-ripple :draggable="false" :href="href" class="text-primary-500"
				   v-bind="props.action" @click="navigate">
					<span v-if="item.icon" class="fa-regular">{{ item.icon.text }}</span>
					<span class="ml-2">{{ item.label }}</span>
				</a>
				<a v-else v-ripple :draggable="false" :href="href" v-bind="props.action" @click="navigate">
					<span v-if="item.icon" class="fa-regular">{{ item.icon.text }}</span>
					<span class="ml-2">{{ item.label }}</span>
				</a>
			</router-link>
			<a v-else v-ripple :draggable="false" :href="item.url" :target="item.target" v-bind="props.action">
				<span v-if="item.icon" class="fa-regular">{{ item.icon.text }}</span>
				<span class="ml-2">{{ item.label }}</span>
				<span v-if="hasSubmenu" class="ml-2 pi pi-fw pi-angle-down"/>
			</a>
		</template>
		<template #end>
			<div class="flex flex-row gap-2 align-items-center">
				<router-link v-if="props.showButtons.includes('search')" v-slot="{ href, navigate }"
				             :to="{name:'search'}" custom>
					<Button v-ripple class="w-[45px] h-[45px]" href="/settings" outlined rounded severity="secondary"
					        size="small"
					        text @click="navigate">
						<span class="fa-regular fa-search"></span>
					</Button>
				</router-link>
				<router-link v-if="props.showButtons.includes('settings')" v-slot="{ href, navigate }"
				             :to="{name:'settings'}" custom>
					<Button v-ripple class="w-[45px] h-[45px]" href="/settings" outlined rounded severity="secondary"
					        size="small"
					        text @click="navigate">
						<span class="fa-regular">&#xf013;</span>
					</Button>
				</router-link>
				<template v-if="props.showButtons.includes('endSlot')">
					<slot name="end" />
				</template>
			</div>
		</template>
	</Menubar>
	<div v-if="showWrapper">
		<div class="mt-[64px]"></div>
	</div>
	<slot/>
</template>

<script setup>
import {routes} from "@/router.js";
import {useDeviceInfo} from "@/utils/device.js";

const props = defineProps({
    showWrapper: {
        default: null
    },
    showIcon: {
        default: null
    },
    showIn: {
        type: Array,
        default: ['pc']
    },
    showButtons: {
        type: Array,
        default: ['search', 'settings', 'icon']
    },
});

const router = useRouter();
const deviceInfo = useDeviceInfo();

const wrapperClass = computed(() => {
    return {
        'backdrop-blur-sm': true,
        'bg-white/70': true,
        '!fixed': true,
        'w-screen': true,
        'z-50': true,
        'top-0': true,
        'h-[64px]': true,
        //
        'w-full max-w-screen-xl mx-auto': true,
    };
});

const isMounted = ref(false);


const items = computed(() => {
    return (deviceInfo.value.isMobile && isMounted.value) ? [] : (routes.filter(route => route.showNav).map(route => {
        return {
            label: route.meta.title,
            icon: route.meta.icon,
            route: route.path,
            isActive: route.isActive(router),
        }
    }));
});

const showWrapper = computed(() => {
    if (!isMounted.value) return true;
    if (props.showWrapper !== null) return props.showWrapper;
    
    let show = false;
    if (deviceInfo.value.isMobile) {
        if (routes.filter(route => route.showNav && route.isActive(router)).length > 0) {
            show = true;
        } else if (props.showIn.includes('pc')) {
            show = false;
        } else if (props.showIn.includes('mobile')) {
            show = true;
        }
    } else {
        if (props.showIn.includes('pc')) {
            show = true;
        } else if (props.showIn.includes('mobile')) {
            show = false;
        }
    }
    return show;
});

const showIcon = computed(() => {
    if (!isMounted.value) return true;
    if (props.showIcon !== null) return props.showIcon;
    return !deviceInfo.value.isMobile;
});

const canBack = computed(() => {
    if (!isMounted.value) return true;
	return window.history.state.back !== null;
});


onMounted(() => {
    isMounted.value = true;
});
</script>
<style scoped>

</style>
