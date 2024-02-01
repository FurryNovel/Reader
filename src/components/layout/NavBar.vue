<template>
	<Menubar v-if="showWrapper" :class="wrapperClass" :model="items">
		<template #start>
			<Avatar class="mr-4 max-sm:hidden bg-transparent" image="/static/icon.png" shape="circle"/>
			<InputText class="max-sm:w-full sm:hidden" placeholder="Search" type="text"/>
		</template>
		<template #item="{ item, props, hasSubmenu, root }">
			<router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
				<a v-if="item.isActive" v-ripple :href="href" class="text-primary-500" v-bind="props.action"
				   @click="navigate">
					<span v-if="item.icon" class="fa-regular">{{ item.icon.text }}</span>
					<span class="ml-2">{{ item.label }}</span>
				</a>
				<a v-else v-ripple :href="href" v-bind="props.action" @click="navigate">
					<span v-if="item.icon" class="fa-regular">{{ item.icon.text }}</span>
					<span class="ml-2">{{ item.label }}</span>
				</a>
			</router-link>
			<a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
				<span v-if="item.icon" class="fa-regular">{{ item.icon.text }}</span>
				<span class="ml-2">{{ item.label }}</span>
				<span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2"/>
			</a>
		</template>
		<template #end>
			<div class="flex flex-row align-items-center gap-2">
				<InputText class="max-sm:hidden sm:w-auto" placeholder="Search" type="text"/>
				<router-link v-slot="{ href, navigate }" :to="{name:'settings'}" custom>
					<Button v-ripple href="/settings" outlined rounded severity="secondary" size="small"
					        class="w-[45px] h-[45px]"
					        text @click="navigate">
						<span class="fa-regular">&#xf013;</span>
					</Button>
				</router-link>
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

const router = useRouter();
let items = ref([]);

const wrapperClass = computed(() => {
    return {
        'backdrop-blur-sm': true,
        'bg-white/70': true,
        '!fixed': true,
        'w-screen': true,
        'z-50': true,
        'top-0': true,
        'left-0': true,
        'h-[64px]': true,
    };
});

const showWrapper = computed(() => {
    return !(items.value.length === 0 && routes.filter(route => route.showNav && route.isActive(router)).length === 0);
});


onMounted(() => {
    const media = window.matchMedia('not all and (min-width: 640px)');
    media.addEventListener('change', onSize);
    onSize(media);
});
onUnmounted(() => {
    const media = window.matchMedia('not all and (min-width: 640px)');
    media.removeEventListener('change', onSize);
});
const onSize = (e) => {
    if (e.matches) {
        items.value = [];
    } else {
        items.value = routes.filter(route => route.showNav).map(route => {
            return {
                label: route.meta.title,
                icon: route.meta.icon,
                route: route.path,
                isActive: computed(() => route.isActive(router)),
            }
        });
    }
};
</script>
<style scoped>

</style>
