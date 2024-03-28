<template>
	<div class="relative flex">
		<div class="flex h-full w-full items-center justify-center group">
			<div class="rounded-xl">
				<img :src="images[current].src" alt="Banner"
				     class="h-auto w-full min-h-64 sm:object-contain max-sm:object-cover"/>
			</div>
			<div class="absolute flex select-none rounded-xl backdrop-blur-sm transition-all group-hover:opacity-0">
				<div class="flex items-center text-white">
					<Avatar class="mx-4 flex justify-center align-middle"
					        image="/static/icon.png"
					        shape="circle" size="xlarge"/>
				</div>
				<div class="flex flex-col items-center text-white">
					<div class="text-4xl font-bold">{{ t('兽人控小说站') }}</div>
					<div class="text-xl">{{ t('最新最全的小说网站') }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {getHours, getMonth, fromUnixTime} from "date-fns";
import {useI18n} from "@/i18n/index.js";
const {t} = useI18n();

const current = ref(0);

const images = ref([
    {src: 'https://media.furrynovel.com/banner/1.full.webp', idx: 0},
    {src: 'https://media.furrynovel.com/banner/2.full.webp', idx: 1},
    {src: 'https://media.furrynovel.com/banner/3.full.webp', idx: 2},
    {src: 'https://media.furrynovel.com/banner/4.full.webp', idx: 3},
]);

//根据时间和季节更换背景图片
const date = fromUnixTime(new Date().getTime() / 1000);
const month = getMonth(date);
const hour = getHours(date);
const season = month < 3 ? 'spring' : month < 6 ? 'summer' : month < 9 ? 'autumn' : 'winter';
const idx = Math.floor((hour / 6)).toFixed(0);

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


onMounted(() => {
    const isApple = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
    if (isApple) {
        images.value = images.value.map((item) => {
            return {
                src: item.src.replace('.webp', '.png'),
                idx: item.idx
            }
        });
    }
});
</script>

<style scoped>

</style>
