<template>
	<MultiSelect v-model="selectedTags"
	             :maxSelectedLabels="props.max" :options="tags"
	             class="w-full md:w-20rem" filter
	             :virtualScrollerOptions="{ itemSize: 44 }"
	             :showToggleAll="false"
	             optionLabel="name" optionValue="name" :loading="tags.length === 0"
	             placeholder="选择标签"
	/>
</template>

<script setup>
import {ref} from 'vue';
import {useConfigProvider} from "@/provider/config.js";
import {loadTags} from "@/api/tags.js";
import {onServerData} from "@/utils/ssr.js";

const tags = ref([]);
const config = useConfigProvider();
const selectedTags = defineModel();
const props = defineProps({
    max: {
        type: Number,
        default: 5,
    }
});

onServerPrefetch(async () => {
    await loadData();
    provideServerData('tags', tags.value);
});

onServerData(_tags => {
    tags.value = _tags;
    console.log(tags.value);
}, 'tags');

onMounted(async () => {
	if (tags.value.length === 0) {
		await loadData();
	}
});

async function loadData() {
    if (!config.global.safeMode){
        tags.value = await loadTags({ignoreReq: true});
    }else{
        tags.value = [
            {
                name: '兽人',
                count: 50,
            },
            {
                name: '龙',
                count: 50,
            },
            {
                name: '虎',
                count: 50,
            },
            {
                name: '狼',
                count: 50,
            },
            {
                name: '狐',
                count: 50,
            },
            {
                name: '猫',
                count: 50,
            },
            {
                name: '狗',
                count: 50,
            },
            {
                name: 'AI生成',
                count: 50,
            },
            {
                name: '冒险',
                count: 50,
            },
            {
                name: '同人',
                count: 50,
            },
            {
                name: '爪子',
                count: 50,
            },
            {
                name: '动物',
                count: 50,
            },
            {
                name: 'TF',
                count: 50,
            },
            {
                name: '恋爱',
                count: 50,
            },
            {
                name: '纯爱',
                count: 50,
            },
            {
                name: '日常',
                count: 50,
            },
            {
                name: '清水',
                count: 50,
            },
            {
                name: '幻想',
                count: 50,
            },
        ];
    }
}

</script>

<style scoped>

</style>
