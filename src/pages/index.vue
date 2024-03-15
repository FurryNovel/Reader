<template>
	<div class="flex h-full w-full flex-col">
		<Slogan/>
		<AppInfo/>
		<div class="flex flex-1 flex-col rounded bg-white p-10 text-black max-sm:p-3 dark:bg-surface-600 dark:text-white">
			<div class="flex flex-1 flex-wrap max-sm:flex-col">
				<div class="flex flex-1 flex-col rounded bg-white text-black max-sm:p-3 dark:bg-surface-600 dark:text-white">
					<div class="m-2 flex items-center justify-between">
						<div class="text-2xl font-bold">{{ t('热门精选') }}</div>
						<router-link :to="{name:'list'}" :draggable="false">
							<Button class="mr-2 text-sm text-primary-500 dark:text-white" :label="t('查看更多')"
							        size="small"
							        text>
								{{ t('查看更多') }}
								<div class="ml-2 fa-regular fa-chevron-right"></div>
							</Button>
						</router-link>
					</div>
					<NovelList v-ssr type="popular" order="desc" listStyle="style1"
					           :tags="null"
					           :limit="18"
					           :userId="null" :keyword="null" :ids="null"/>
				</div>
				<div class="flex w-[330px] max-sm:w-full flex-col rounded bg-white text-black max-sm:p-3 dark:bg-surface-600 dark:text-white">
					<div class="m-2 flex items-center justify-between">
						<div class="text-2xl font-bold flex">
							<template v-if="!randomTag || randomTag.length === 0">
								{{ t('随便来点') }}
								<div class="ml-2 underline" @click="toggleTagsPanel">{{ t('随机') }}</div>
							</template>
							<template v-else>
								{{ t('随便来点') }}
								<div class="ml-2 underline" @click="toggleTagsPanel">{{ randomTag[0] }}</div>
							</template>
						</div>
						<Button class="mr-2 text-sm text-primary-500 dark:text-white" :label="t('刷新一下')"
						        size="small"
						        text @click="refreshRandomList">
							{{ t('刷新一下') }}
							<div class="ml-2 fa-regular fa-rotate-right"></div>
						</Button>
					</div>
					<NovelList ref="randomList" v-ssr type="random" order="desc" listStyle="style2"
					           :tags="randomTag" :image="false"
					           :limit="5"
					           :userId="null" :keyword="null" :ids="null"/>
				</div>
			</div>
		</div>
		<div class="flex flex-1 flex-col rounded bg-white p-10 text-black max-sm:p-3 dark:bg-surface-600 dark:text-white">
			<div class="m-2 flex items-center justify-between">
				<div class="text-2xl font-bold">{{ t('最新小说') }}</div>
				<router-link :to="{name:'list',query:{type:'latest'}}" :draggable="false">
					<Button class="mr-2 text-sm text-primary-500 dark:text-white" :label="t('查看更多')" size="small"
					        text>
						{{ t('查看更多') }}
						<div class="ml-2 fa-regular fa-chevron-right"></div>
					</Button>
				</router-link>
			</div>
			<NovelList v-ssr type="latest" order="desc" listStyle="style1" :tags="null"
			           :limit="16"
			           :userId="null" :keyword="null" :ids="null"/>
		</div>
		<div class="flex flex-1 flex-col rounded bg-white p-10 text-black max-sm:p-3 dark:bg-surface-600 dark:text-white">
			<div class="m-2 flex items-center justify-between">
				<div class="text-2xl font-bold">{{ t('种族') }}</div>
			</div>
			<div class="">
				<div class="flex flex-1 flex-wrap max-sm:flex-col">
					<div class="flex flex-1 flex-col rounded bg-white text-black sm:min-w-[399.33px] max-sm:p-3 dark:bg-surface-600 dark:text-white">
						<div class="m-2 flex items-center justify-between">
							<div class="text-xl font-bold">{{ t('虎') }}</div>
							<router-link :to="{name:'list',query:{type:'popular',tags:'虎'}}" :draggable="false">
								<Button class="mr-2 text-sm text-primary-500 dark:text-white" :label="t('查看更多')"
								        size="small"
								        text>
									{{ t('查看更多') }}
									<div class="ml-2 fa-regular fa-chevron-right"></div>
								</Button>
							</router-link>
						</div>
						<NovelList v-ssr type="random" order="desc" listStyle="style2"
						           :tags="['虎']"
						           :limit="3"
						           :userId="null" :keyword="null" :ids="null"/>
					</div>
					<div class="flex flex-1 flex-col rounded bg-white text-black sm:min-w-[399.33px] max-sm:p-3 dark:bg-surface-600 dark:text-white">
						<div class="m-2 flex items-center justify-between">
							<div class="text-xl font-bold">{{ t('龙') }}</div>
							<router-link :to="{name:'list',query:{type:'popular',tags:'龙'}}" :draggable="false">
								<Button class="mr-2 text-sm text-primary-500 dark:text-white" :label="t('查看更多')"
								        size="small"
								        text>
									{{ t('查看更多') }}
									<div class="ml-2 fa-regular fa-chevron-right"></div>
								</Button>
							</router-link>
						</div>
						<NovelList v-ssr type="random" order="desc" listStyle="style2"
						           :tags="['龙']"
						           :limit="3"
						           :userId="null" :keyword="null" :ids="null"/>
					</div>
					<div class="flex flex-1 flex-col rounded bg-white text-black sm:min-w-[399.33px] max-sm:p-3 dark:bg-surface-600 dark:text-white">
						<div class="m-2 flex items-center justify-between">
							<div class="text-xl font-bold">{{ t('狼') }}</div>
							<router-link :to="{name:'list',query:{type:'popular',tags:'狼'}}" :draggable="false">
								<Button class="mr-2 text-sm text-primary-500 dark:text-white" :label="t('查看更多')"
								        size="small"
								        text>
									{{ t('查看更多') }}
									<div class="ml-2 fa-regular fa-chevron-right"></div>
								</Button>
							</router-link>
						</div>
						<NovelList v-ssr type="random" order="desc" listStyle="style2"
						           :tags="['狼']"
						           :limit="3"
						           :userId="null" :keyword="null" :ids="null"/>
					</div>
					<div class="flex flex-1 flex-col rounded bg-white text-black sm:min-w-[399.33px] max-sm:p-3 dark:bg-surface-600 dark:text-white">
						<div class="m-2 flex items-center justify-between">
							<div class="text-xl font-bold">{{ t('熊') }}</div>
							<router-link :to="{name:'list',query:{type:'popular',tags:'狐'}}" :draggable="false">
								<Button class="mr-2 text-sm text-primary-500 dark:text-white" :label="t('查看更多')"
								        size="small"
								        text>
									{{ t('查看更多') }}
									<div class="ml-2 fa-regular fa-chevron-right"></div>
								</Button>
							</router-link>
						</div>
						<NovelList v-ssr type="random" order="desc" listStyle="style2"
						           :tags="['熊']"
						           :limit="3"
						           :userId="null" :keyword="null" :ids="null"/>
					</div>
					<div class="flex flex-1 flex-col rounded bg-white text-black sm:min-w-[399.33px] max-sm:p-3 dark:bg-surface-600 dark:text-white">
						<div class="m-2 flex items-center justify-between">
							<div class="text-xl font-bold">{{ t('狗') }}</div>
							<router-link :to="{name:'list',query:{type:'popular',tags:'狗'}}" :draggable="false">
								<Button class="mr-2 text-sm text-primary-500 dark:text-white" :label="t('查看更多')"
								        size="small"
								        text>
									{{ t('查看更多') }}
									<div class="ml-2 fa-regular fa-chevron-right"></div>
								</Button>
							</router-link>
						</div>
						<NovelList v-ssr type="random" order="desc" listStyle="style2"
						           :tags="['狗']"
						           :limit="3"
						           :userId="null" :keyword="null" :ids="null"/>
					</div>
					<div class="flex flex-1 flex-col rounded bg-white text-black sm:min-w-[399.33px] max-sm:p-3 dark:bg-surface-600 dark:text-white">
						<div class="m-2 flex items-center justify-between">
							<div class="text-xl font-bold">{{ t('猫') }}</div>
							<router-link :to="{name:'list',query:{type:'popular',tags:'猫'}}" :draggable="false">
								<Button class="mr-2 text-sm text-primary-500 dark:text-white" :label="t('查看更多')"
								        size="small"
								        text>
									{{ t('查看更多') }}
									<div class="ml-2 fa-regular fa-chevron-right"></div>
								</Button>
							</router-link>
						</div>
						<NovelList v-ssr type="random" order="desc" listStyle="style2"
						           :tags="['猫']"
						           :limit="3"
						           :userId="null" :keyword="null" :ids="null"/>
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-1 flex-col rounded bg-white p-10 text-black max-sm:p-3 dark:bg-surface-600 dark:text-white">
			<div class="m-2 flex items-center justify-between">
				<div class="text-2xl font-bold">{{ t('友情链接') }}</div>
			</div>
			<LinkExchange/>
		</div>
		
		<OverlayPanel ref="tagsPanel">
			<div class="flex flex-col gap-3 rounded-xl p-3 w-[300px]">
				<div class="flex flex-col gap-2">
					<span class="font-bold">{{ t('标签') }}</span>
					<TagSelect v-model="randomTag" class="text-sm" size="small" :max="1"/>
				</div>
				<div class="flex items-center justify-end gap-2">
					<Button class="dark:text-white" :label="t('确定')" size="small" @click="applyTags"></Button>
					<Button :label="t('清除')" outlined severity="secondary" size="small" text
					        @click="clearTags"></Button>
				</div>
			</div>
		</OverlayPanel>
	</div>
</template>

<script setup>
import dialog from '@/utils/dialog.js';
import NovelList from '@/components/views/NovelList.vue';
import AppInfo from "@/components/global/AppInfo.vue";
import Slogan from "@/components/views/Slogan.vue";
import LinkExchange from "@/components/views/LinkExchange.vue";
import TagSelect from "@/components/views/TagSelect.vue";
import OverlayPanel from "primevue/overlaypanel";
import {useI18n} from "@/i18n/index.js";

const tagsPanel = ref(null);
const randomTag = ref(null);

const {t} = useI18n();

const randomList = ref(null);

function refreshRandomList() {
    randomList.value.reload();
}

function toggleTagsPanel(e) {
    tagsPanel.value.toggle(e);
}

function applyTags() {
    tagsPanel.value.hide();
    randomList.value.reload();
}

function clearTags() {
    randomTag.value = null;
    tagsPanel.value.hide();
}

onServerPrefetch(() => {
});
</script>
