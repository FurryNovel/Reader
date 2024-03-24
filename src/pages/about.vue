<template>
	<div class="flex flex-1 flex-wrap gap-5 rounded bg-white p-10 text-black sm:p-10 dark:bg-surface-600 dark:text-white max-sm:p-3">
		<div class="flex max-sm:flex-1">
			<Menu :model="menus" class="max-sm:flex-1 max-sm:w-full">
				<template #item="{ item, props }">
					<a v-ripple :href="item?.href || ''" class="flex p-5 align-items-center">
						<span class="ml-2">{{ item.label }}</span>
					</a>
				</template>
			</Menu>
		</div>
		<div class="flex flex-1 flex-col p-10 max-sm:p-3">
			<div class="flex flex-col">
				<div class="text-2xl font-bold">关于我们</div>
			</div>
			<div id="起点" class="mt-5 flex flex-col gap-3">
				<div class="text-xl font-bold"><a href="#起点"># {{ t('起点') }}</a></div>
				<div class="flex flex-col gap-3 p-5">
					<p>初衷是因为B站文章阅读体验太差，
						<del>实在是太难用了</del>
						。为什么不自己做一个呢？
					</p>
					<p>
						既然都做了，干脆就做成一个聚合的兽人控阅读平台吧。
					</p>
				</div>
			</div>
			<div id="关于我们" class="mt-5 flex flex-col gap-3">
				<div class="text-xl font-bold"><a href="#关于我们"># {{ t('关于我们') }}</a></div>
				<div class="flex flex-col gap-3 p-5">
					<p>本项目开始于2023年11月，致力于提升多平台的阅读体验。</p>
					<p>开发者：TigerKK</p>
					<p>图标设计：apoto5</p>
				</div>
			</div>
			<div id="媒体资源" class="mt-5 flex flex-col gap-3">
				<div class="text-xl font-bold"><a href="#媒体资源"># {{ t('媒体资源') }}</a></div>
				<div class="flex flex-col gap-3 p-5">
					<p><a href="https://media.furrynovel.com/">媒体库</a></p>
				</div>
			</div>
			<div id="使用域名" class="mt-5 flex flex-col gap-3">
				<div class="text-xl font-bold"><a href="#使用域名"># {{ t('使用域名') }}</a></div>
				<div class="flex flex-col gap-3 p-5">
					<p>FurryNovel.com</p>
					<p>曾用域名
						<del>Novel.TigerKK.me</del>
					</p>
				</div>
			</div>
			<div id="免责申明" class="mt-5 flex flex-col gap-3">
				<div class="text-xl font-bold"><a href="#免责申明"># {{ t('免责申明') }}</a></div>
				<div class="flex flex-col gap-3 p-5">
					<p>
						{{ config.title }} 以下简称本站。
					</p>
					<p>
						鉴于本服务以非人工检索方式提供无线搜索、根据您输入的关键字自动生成到第三方网页的链接，本服务会提供与其他任何互联网网站或资源的链接。</p>
					<p>
						由于本站无法控制这些网站或资源的内容，您了解并同意：无论此类网站或资源是否可供利用，本站不予负责；</p>
					<p>
						本站亦对存在或源于此类网站或资源之任何内容、广告、产品或其他资料不予保证或负责。
					</p>
					<p>
						因您使用或依赖任何此类网站或资源发布的或经由此类网站或资源获得的任何内容、商品或服务所产生的任何损害或损失，本站不负任何直接或间接责任。</p>
					<p>
						因本服务搜索结果根据您键入的关键字自动搜索获得并生成，不代表本站赞成被搜索链接到的第三方网页上的内容或立场。</p>
					<p>
						任何通过使用本服务而搜索链接到的第三方网页均系第三方提供或制作，您可能从该第三方网页上获得资讯及享用服务，本站无法对其合法性负责，亦不承担任何法律责任。</p>
					<p>您应对使用无线搜索引擎的结果自行承担风险。</p>
					<p>
						本站不做任何形式的保证：不保证搜索结果满足您的要求，不保证搜索服务不中断，不保证搜索结果的安全性、准确性、及时性、合法性。因网络状况、通讯故障、第三方网站等任何原因而导致您不能正常使用本服务的，本站不承担任何法律责任。</p>
				</div>
			</div>
			<div id="QA" class="mt-5 flex flex-col gap-3">
				<div class="text-xl font-bold"><a href="#QA"># Q&A</a></div>
				<div class="flex flex-col gap-3 p-5">
					<div>
						<p>Q：偶尔连不上？</p>
						<p>A：由于内容特殊性，我们的服务器和域名均部署在国外，所以连不上时请
							<del>耐心等待</del>
							使用安全网络。
						</p>
					</div>
					<div>
						<p>Q：小说的更新时间？</p>
						<p>A：一般是8小时内，最长不超过24小时。</p>
					</div>
					<div>
						<p>Q：是否支持推荐作者？</p>
						<p>A：目前还在筹备中，欢迎联系我们。</p>
					</div>
					<div>
						<p>Q：找不到相关书籍？章节有误？</p>
						<p>A：可以联系我们重新同步。</p>
					</div>
				</div>
			</div>
			<div id="联系我们" class="mt-5 flex flex-col gap-3">
				<div class="text-xl font-bold"><a href="#联系我们"># {{ t('联系我们') }}</a></div>
				<div class="flex flex-col gap-3 p-5">
					<p>您可以给我们
						<a class="px-2" href="mailto:me@tigerkk.me">
							<i class="fa-regular fa-envelope"></i>&nbsp;{{ t('发送邮件') }}
						</a>
						、
						<a class="px-2" href="https://t.me/FurryNovel">
							<i class="fa-brands fa-telegram"></i>&nbsp;{{ t('Telegram群组') }}
						</a>
						或在
						<a class="px-2" href="https://github.com/FurryNovel/Reader">
							<i class="fa-brands fa-github"></i>&nbsp;GitHub
						</a>
						联系我们。
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import config from "@/config";
import {useI18n} from "@/i18n/index.js";

const {t} = useI18n();

const menus = ref([
    {
        label: t('起点'),
        href: '#起点',
    },
    {
        label: t('关于我们'),
        href: '#关于我们',
    },
    {
        label: t('使用域名'),
        href: '#使用域名',
    },
    {
        label: t('免责申明'),
        href: '#免责申明',
    },
    {
        label: t('Q&A'),
        href: '#QA',
    },
    {
        label: t('联系我们'),
        href: '#联系我们',
    }
]);

</script>

<style scoped>

</style>
