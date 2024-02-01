<template>
	<Dialog ref="dialog">
		<slot/>
	</Dialog>
</template>
<script setup>
const dialog = ref();
onMounted(() => {
    const media = window.matchMedia('not all and (min-width: 640px)');
    media.addEventListener('change', onSize);
    if (media.matches)
        onSize(media);
});
const onSize = (e) => {
    dialog.value.maximized = e.matches;
};
</script>
