<template>
	<div class="flex justify-center items-center h-full w-full">
		<Button label="primary" @click="show">
			重试
		</Button>
	</div>
</template>

<script setup>
import dialog from "@/utils/dialog.js";

function show() {
    dialog.challenge();
}
</script>
