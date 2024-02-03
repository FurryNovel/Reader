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
import {loadNovel} from "@/api/novels.js";
import {useConfig} from "@/model/config.js";
import {useSSRContext} from "vue";


if (import.meta.env.SSR) {
    const ctx = useSSRContext();
    console.log(ctx)
} else {
	console.log('CSR')
}


function show() {
    console.log(useConfig())
    loadNovel({
        id: 1,
	    onCache(novel) {
            
            console.log(novel)
        }
    }).then((novel) => {
		console.log(novel)
	})
    dialog.challenge();
}
</script>
