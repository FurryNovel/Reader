<template>
	<Dialog v-model:visible="data.dialog.show" :header="data.dialog.title" modal :style="{ width: '25rem' }">
		<span class="p-text-secondary block mb-5 select-none">
			{{ data.dialog.content }}
		</span>
		<div v-if="data.dialog.input !== null" class=" mb-5 ">
			<InputText v-model="data.dialog.input" size="small" class="text-sm w-full"
			           :placeholder="data.dialog.input"/>
		</div>
		<div class="flex justify-end gap-2">
			<Button v-if="data.dialog.cancelBtn" :label="data.dialog.cancelBtn" severity="secondary" type="button"
			        @click="clickBtn('cancel')"></Button>
			<Button v-if="data.dialog.confirmBtn" :label="data.dialog.confirmBtn" type="button"
			        @click="clickBtn('confirm')"></Button>
		</div>
	</Dialog>
	<Toast :position="data.toast.position"
	       @close="e => onToastClose({...e, type:'close'})"
	       @life-end="e => onToastClose({...e, type:'timeout'})"
	/>
</template>
<script setup>
import eventbus from "@/utils/eventbus.js";
import Toast from 'primevue/toast';
import {useToast} from "primevue/usetoast";
import {useI18n} from "@/i18n/index.js";

const {t} = useI18n();
const toast = useToast();
const data = reactive({
    dialog: {
        show: false,
        title: t('信息'),
        content: t('内容'),
        cancelBtn: null,
        confirmBtn: t('确定'),
        input: null,
    },
    toast: {
        position: 'top-right',
    }
});

eventbus.on('showDialog', params => {
    const {title, content, cancelBtn, confirmBtn, input = null} = params;
    data.dialog.title = title;
    data.dialog.content = content;
    data.dialog.cancelBtn = cancelBtn;
    data.dialog.confirmBtn = confirmBtn;
    data.dialog.input = input;
    data.dialog.show = true;
});


eventbus.on('showToast', params => {
    const {title, content, type} = params;
    data.toast.position = params?.position || 'top-right';
    toast.add({
        severity: type,
        summary: title,
        detail: content,
        ...params,
    });
});

function clickBtn(type) {
    data.dialog.show = false;
    eventbus.emit('dialogClick', {
        type,
        ...data.dialog,
    });
}

function onToastClose(params) {
    eventbus.emit('toastClose', params);
}
</script>

<style scoped>

</style>
