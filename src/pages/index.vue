<template>
	<div class="flex justify-center items-center h-full w-full">
		<Button label="primary" @click="show">
			重试
		</Button>
	</div>
</template>

<script setup>
import dialog from "@/utils/dialog.js";
import {useSettingStore} from "@/stores/settings.js";
import {useNovelStore} from "@/stores/novels.js";

function show(){
    const store = useNovelStore();
    console.log(store)
    store.save('test',1);
    dialog.challenge();
}
</script>
