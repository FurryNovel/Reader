<template>
	<ReactiveDialog v-model:visible="data.dialog.show" :header="data.dialog.title" :style="{ width: '50rem'}" maximizable modal>
		<div class="flex flex-col min-h-[70vh] h-full">
			<div class="p-text-secondary mb-5 select-none flex-1 flex">
				<iframe ref="challengeWindow" :src="data.dialog.content" @load="onChallenge" class="w-full flex-1"></iframe>
			</div>
			<div class="flex justify-end gap-2">
				<Button label="取消" severity="secondary" type="button"
				        @click="data.dialog.show = false;"></Button>
			</div>
		</div>
	</ReactiveDialog>
</template>
<script setup>
import eventbus from "@/utils/eventbus.js";
import {useToast} from "primevue/usetoast";

const toast = useToast();
const data = reactive({
    stack: 0,
    dialog: {
        show: false,
        title: '人机验证',
        content: process.env.NODE_ENV === 'development' ? 'https://novel.tigerkk.me/api/challenge' : '/api/challenge',
        cancelBtn: '取消',
    }
});

eventbus.on('showChallenge', () => {
    data.stack = 0;
    data.dialog.show = true;
});

const challengeWindow = ref();

function onChallenge() {
    try {
        if (challengeWindow.value?.contentWindow?.location?.href?.indexOf('cdn-cgi/challenge') > -1) {
            if (data.stack === 0) {
                data.stack = 1;
            }
        } else {
            data.stack = data.stack - 1;
        }
    } catch (e) {
    
    }
    if (data.stack <= 0) {
        data.dialog.show = false;
        eventbus.emit('onChallenged', {});
    }
}
</script>

<style scoped>

</style>
