<template>
	<MultiSelect v-model="selectedTags"
	             :loading="tags.length === 0" :options="tags"
	             :placeholder="t('选择标签')" :selectionLimit="props.max"
	             :showToggleAll="false"
	             :virtualScrollerOptions="{ itemSize: 44 ,orientation: 'vertical',class:'!w-full'}"
	             class="w-full md:w-20rem" filter optionLabel="name"
	             optionValue="name"
	/>
</template>

<script setup>
import {ref} from 'vue';
import {useConfigProvider} from "@/provider/config.js";
import {loadTags} from "@/api/tags.js";
import {onServerData, provideServerData} from "@/utils/ssr.js";
import {useI18n} from "@/i18n/index.js";

const {t} = useI18n();

const tags = ref([]);
const config = useConfigProvider();
const selectedTags = defineModel();
const props = defineProps({
    max: {
        type: Number,
        default: 5,
    }
});

const instance = getCurrentInstance();
onServerPrefetch(async () => {
    await loadData();
    provideServerData({
        reqId: 'tags',
        data: tags.value,
        instance: instance,
    });
});

onServerData(_tags => {
    tags.value = _tags;
}, 'tags').catch(err => {
    return loadData();
});

onMounted(async () => {
    if (tags.value.length === 0) {
        await loadData();
    }
});

async function loadData() {
    if (!config.global.safeMode) {
        tags.value = await loadTags({ignoreReq: true});
    } else {
        tags.value = [
            {
                name: t('兽人'),
                count: 50,
            },
            {
                name: t('龙'),
                count: 50,
            },
            {
                name: t('虎'),
                count: 50,
            },
            {
                name: t('狼'),
                count: 50,
            },
            {
                name: t('熊'),
                count: 50,
            },
            {
                name: t('狐'),
                count: 50,
            },
            {
                name: t('猫'),
                count: 50,
            },
            {
                name: t('狗'),
                count: 50,
            },
            {
                name: t('AI生成'),
                count: 50,
            },
            {
                name: t('冒险'),
                count: 50,
            },
            {
                name: t('同人'),
                count: 50,
            },
            {
                name: t('爪子'),
                count: 50,
            },
            {
                name: t('动物'),
                count: 50,
            },
            {
                name: t('TF'),
                count: 50,
            },
            {
                name: t('恋爱'),
                count: 50,
            },
            {
                name: t('纯爱'),
                count: 50,
            },
            {
                name: t('日常'),
                count: 50,
            },
            {
                name: t('清水'),
                count: 50,
            },
            {
                name: t('幻想'),
                count: 50,
            },
        ];
    }
}

</script>

<style scoped>

</style>
