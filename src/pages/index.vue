<template>
	<div class="flex justify-center items-center h-full w-full">
		<Button label="primary" @click="show">
			重试
		</Button>
		
		<NovelList type="random" order="desc" listStyle="style1" :desc="false" :author="false" :tags="null"
		           :userId="null" :keyword="null" :ids="null" :showLoadingComponent="false" :useSlot="false"/>
	</div>
</template>

<script setup>
import dialog from "@/utils/dialog.js";
import NovelList from "@/components/views/NovelList.vue";

onServerPrefetch(() => {

});

function show() {
    dialog.challenge();
}
</script>
