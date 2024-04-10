<template>
	<Menubar v-if="showWrapper" :class="wrapperClass" :model="items">
		<template #start>
			<Avatar v-if="showIcon && props.showButtons.includes('icon')"
			        class="mx-4 flex justify-center align-middle"
			        image="/static/icon.png" shape="circle"/>
			<template v-if="showButtons.includes('back') && canBack">
				<Button v-ripple class="w-[45px] h-[45px]" outlined rounded severity="secondary"
				        size="small"
				        text @click="router.back()">
					<span class="fa-regular fa-chevron-left"></span>
				</Button>
			</template>
			<template v-if="showButtons.includes('home')">
				<router-link :to="{name:'index'}">
					<Button v-ripple class="w-[45px] h-[45px]" href="/" outlined rounded severity="secondary"
					        size="small" text>
						<span class="fa-regular fa-home"></span>
					</Button>
				</router-link>
			</template>
			<template v-if="showButtons.includes('startSlot')">
				<slot name="start"/>
			</template>
		</template>
		<template #item="{ item, props, hasSubmenu, root }">
			<router-link v-if="item.route" v-slot="{ href, navigate }" :to="item" custom>
				<a v-if="item.isActive" v-ripple :draggable="false" :href="href" class="text-primary-500"
				   v-bind="props.action" @click="e => { if(!item.isActive) changeKeepAlive(); navigate(e); }">
					<span v-if="item.icon" :class="{
                            [item.icon.text]:true,
					     }" aria-hidden="true">
					</span>
					<span class="ml-2">{{ t(item.label) }}</span>
				</a>
				<a v-else v-ripple :draggable="false" :href="href"
				   v-bind="props.action" @click="e => { if(!item.isActive) changeKeepAlive(); navigate(e); }">
					<span v-if="item.icon" :class="{
                            [item.icon.text]:true,
					      }" aria-hidden="true">
					</span>
					<span class="ml-2">{{ t(item.label) }}</span>
				</a>
			</router-link>
			<a v-else v-ripple :draggable="false" :href="item.url" :target="item.target" v-bind="props.action">
				<span v-if="item.icon" class="fa-regular">{{ item.icon.text }}</span>
				<span class="ml-2">{{ t(item.label) }}</span>
				<span v-if="hasSubmenu" class="ml-2 pi pi-fw pi-angle-down"/>
			</a>
		</template>
		<template #end>
			<div class="flex flex-row gap-2 align-items-center">
				<router-link v-if="showButtons.includes('search')"
				             v-slot="{ href, navigate }"
				             :to="{name:'search'}" custom>
					<Button v-ripple class="w-[45px] h-[45px]" href="/settings" outlined rounded severity="secondary"
					        size="small"
					        text @click="navigate">
						<span class="fa-regular fa-search"></span>
					</Button>
				</router-link>
				<Button v-if="showButtons.includes('theme')" v-ripple class="w-[45px] h-[45px]" href="/settings"
				        outlined rounded severity="secondary" size="small"
				        text @click="toggleTheme">
					<span v-if="themeButton === 'light'" class="fa-regular fa-moon-stars"></span>
					<span v-else class="fa-regular fa-sun-bright"></span>
				</Button>
				<Button v-if="showButtons.includes('locale')" v-ripple class="w-auto min-w-[45px] h-[45px]"
				        outlined rounded severity="secondary" size="small"
				        text @click="toggleLocaleMenu">
					<div class="flex gap-3 justify-center items-center mt-[2px]">
						<span class="fa-regular fa-earth-americas"></span>
						<span class="max-sm:hidden">{{ supportedLocales[locale()].shortName }}</span>
					</div>
				</Button>
				<router-link v-if="showButtons.includes('settings')"
				             v-slot="{ href, navigate }"
				             :to="{name:'settings'}" custom>
					<Button v-ripple class="w-[45px] h-[45px]" href="/settings" outlined rounded severity="secondary"
					        size="small"
					        text @click="navigate">
						<span class="fa-regular fa-gear"></span>
					</Button>
				</router-link>
				<template v-if="showButtons.includes('endSlot')">
					<slot name="end"/>
				</template>
			</div>
		</template>
	</Menubar>
	<Menu ref="localeMenu"
	      :model="Object.values(supportedLocales).map(_locale => ({label: _locale.name,command: () => changeLocale(_locale)}))"
	      :popup="true"/>
	<div v-if="showWrapper && !props.fixed">
		<!--<div class="mt-[64px]"></div>-->
	</div>
	<slot/>
</template>

<script setup>
import {routes} from "@/router.js";
import {useDeviceInfo} from "@/utils/device.js";
import {toggleTheme, useTheme} from "@/utils/theme.js";
import {supportedLocales, useI18n} from "@/i18n/index.js";
import eventbus from "@/utils/eventbus.js";
import {isOfficialReader} from "@/utils/third.js";

const {t, locale} = useI18n();

const showButtons = computed(() => {
    return props.showButtons.filter(button => !props.hideButtons.includes(button)).concat(props.appendButtons);
});

const localeMenu = ref(null);

const theme = useTheme();
const themeButton = computed(() => {
    if (!isMounted.value) {
        return 'light';
    }
    return theme.value;
});

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
    appendButtons: {
        type: Array,
        default: [],
    },
    showButtons: {
        type: Array,
        default: ['search', 'settings', 'icon', 'theme', 'locale']
    },
    hideButtons: {
        type: Array,
        default: []
    },
    custom: {
        type: Boolean,
        default: false
    },
    fixed: {
        type: Boolean,
        default: false
    },
});

const router = useRouter();
const deviceInfo = useDeviceInfo();

const wrapperClass = computed(() => {
    return {
        'backdrop-blur-sm': true,
        'bg-white/70 dark:bg-surface-700/70': true,
        'sticky': true,
        'z-50': true,
        'top-0': true,
        'h-[64px]': !isOfficialReader(),
        'h-auto': isOfficialReader(),
        'pt-[40px]': isOfficialReader(),
    };
});

const isMounted = ref(false);


const items = computed(() => {
    return (deviceInfo.value.isMobile && isMounted.value) ? [] : (routes.filter(route => route.meta.layout.showInNavBar).map(route => {
        return {
            label: route.meta.title,
            icon: route.meta.icon,
            route: route.path,
            name: route?.name,
            params: route.params,
            isActive: route.isActive(router),
        }
    }));
});

const showWrapper = computed(() => {
    if (!isMounted.value) return true;
    if (props.showWrapper !== null) return props.showWrapper;
    
    let show = false;
    if (deviceInfo.value.isMobile) {
        if (routes.filter(route => route.meta.layout.showInNavBar && route.isActive(router)).length > 0) {
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
    if (show && !props.custom) {
        show = router.currentRoute.value?.meta.layout.navBar ?? true;
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

function toggleLocaleMenu(event) {
    localeMenu.value.toggle(event);
}

function changeKeepAlive() {
    eventbus.emit('onKeepAliveStatus', false);
}

function changeLocale(_locale) {
    const currentRoute = router.currentRoute.value;
    router.replace({
        name: currentRoute.name,
        query: currentRoute.query,
        params: {
            ...currentRoute.params,
            lang: _locale.id
        }
    }).catch(err => {
    })
}

onMounted(() => {
    isMounted.value = true;
});
</script>
<style scoped>

</style>
