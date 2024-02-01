<template>
	<Dialog v-model:visible="data.dialog.show" :header="data.dialog.title" modal>
		<span class="p-text-secondary block mb-5">
			{{ data.dialog.content }}
		</span>
		<div class="flex justify-content-end gap-2">
			<Button v-if="data.dialog.cancelBtn" :label="data.dialog.cancelBtn" severity="secondary" type="button"
			        @click="clickBtn('cancel')"></Button>
			<Button v-if="data.dialog.confirmBtn" :label="data.dialog.confirmBtn" type="button"
			        @click="clickBtn('confirm')"></Button>
		</div>
	</Dialog>
</template>
<script setup>
import eventbus from "@/utils/eventbus.js";

const data = reactive({
    dialog: {
        show: false,
        title: '信息',
        content: '内容',
        cancelBtn: null,
        confirmBtn: '确定',
    }
});

eventbus.on('showDialog', ({title, content, cancelBtn, confirmBtn}) => {
	data.dialog.title = title;
	data.dialog.content = content;
	data.dialog.cancelBtn = cancelBtn;
	data.dialog.confirmBtn = confirmBtn;
	data.dialog.show = true;
});

function clickBtn(type){
    data.dialog.show = false;
    eventbus.emit('dialogClick', type);
}
</script>

<style scoped>

</style>
