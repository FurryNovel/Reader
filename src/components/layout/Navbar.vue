<template>
	<Menubar :model="items" class="backdrop-blur-sm bg-white/70 !fixed w-screen z-50 top-0 left-0 h-[64px]">
		<template #start>
			<Avatar class="mr-4" image="/static/icon.png" shape="circle"/>
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
				<InputText class="w-[8rem] sm:w-auto" placeholder="Search" type="text"/>
				<router-link v-slot="{ href, navigate }" :to="{name:'settings'}" custom>
					<Button severity="secondary" size="small" rounded text outlined v-ripple href="/settings" :focusable="false" @click="navigate">
						<span class="fa-regular">&#xf013;</span>
					</Button>
				</router-link>
			</div>
		</template>
	</Menubar>

</template>

<script setup>
import {routes} from "@/router.js";

const router = useRouter();
let items = reactive(routes.filter(route => route.showNav).map(route => {
    return {
        label: route.meta.title,
        icon: route.meta.icon,
        route: route.path,
        isActive: computed(() => route.isActive(router)),
    }
}));
</script>
<style scoped>

</style>
