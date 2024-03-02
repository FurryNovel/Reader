<template>
	<div class="relative flex">
		<div class="flex w-full h-full group justify-center items-center">
			<div class="rounded-xl">
				<img :src="images[current].src" class="w-full h-auto min-h-64 sm:object-contain max-sm:object-cover"
				     alt="Banner"/>
			</div>
			<div class="absolute select-none flex transition-all group-hover:opacity-0 backdrop-blur-sm rounded-xl">
				<div class="flex items-center text-white">
					<Avatar size="xlarge"
					        class="mx-4 flex justify-center align-middle"
					        image="/static/icon.png" shape="circle"/>
				</div>
				<div class="flex flex-col items-center text-white">
					<div class="text-4xl font-bold">兽人控小说站</div>
					<div class="text-xl">最新最全的小说网站</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const current = ref(0);

const images = [
    {src: 'https://media.furrynovel.com/banner/1.png', idx: 0},
    {src: 'https://media.furrynovel.com/banner/2.png', idx: 1},
    {src: 'https://media.furrynovel.com/banner/3.png', idx: 2},
    {src: 'https://media.furrynovel.com/banner/4.png', idx: 3},
];

//根据时间和季节更换背景图片
const date = new Date();
const month = date.getMonth();
const hour = date.getHours();
const season = month < 3 ? 'spring' : month < 6 ? 'summer' : month < 9 ? 'autumn' : 'winter';
const idx = (hour / 6).toFixed(0);

switch (season) {
    case 'spring':
        current.value = idx;
        break;
    case 'summer':
        current.value = (2 - idx > 0) ? 2 - idx : idx - 2;
        break;
    case 'autumn':
        current.value = (3 - idx > 0) ? 3 - idx : idx - 3;
        break;
    case 'winter':
        current.value = (4 - idx > 0) ? 4 - idx : idx - 4;
        break;
    
}

</script>

<style scoped>

</style>
