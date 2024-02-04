<template>
	<div class="flex h-full w-full">
		<div class="flex p-10 flex-1 flex-col rounded bg-white dark:bg-surface-600 text-black dark:text-white">
			<div class="flex items-center justify-between ">
				热门精选
			</div>
			<NovelList class="" type="random" order="desc" listStyle="style1" :desc="false" :author="false" :tags="null"
			           :userId="null" :keyword="null" :ids="null" :showLoadingComponent="false" :useSlot="false"/>
		</div>
	
	</div>
</template>

<script setup>
import dialog from "@/utils/dialog.js";
import NovelList from "@/components/views/NovelList.vue";

onServerPrefetch(() => {

});

</script>
