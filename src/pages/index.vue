<template>
	<div class="flex h-full w-full flex-col">
		<div class="flex flex-1 flex-col rounded bg-white p-10 text-black max-sm:p-3 dark:bg-surface-600 dark:text-white">
			<div class="m-2 flex items-center justify-between">
				<div class="text-2xl font-bold">热门精选</div>
				<router-link :to="{name:'list'}" :draggable="false">
					<Button class="mr-2 text-sm text-primary-500 dark:text-white" label="查看更多" size="small" text>
						查看更多
						<div class="ml-2 fa-regular fa-chevron-right"></div>
					</Button>
				</router-link>
			</div>
			<NovelList v-ssr type="popular" order="desc" listStyle="style1" :desc="false" :author="false" :tags="null"
			           :limit="16"
			           :userId="null" :keyword="null" :ids="null"/>
		</div>
		
		<div class="flex flex-1 flex-col rounded bg-white p-10 text-black max-sm:p-3 dark:bg-surface-600 dark:text-white">
			<div class="m-2 flex items-center justify-between">
				<div class="text-2xl font-bold">种族</div>
			</div>
			<div class="">
				<div class="flex flex-1 flex-wrap max-sm:flex-col">
					<div class="flex flex-1 flex-col rounded bg-white text-black max-sm:p-3 dark:bg-surface-600 dark:text-white">
						<div class="m-2 flex items-center justify-between">
							<div class="text-xl font-bold">虎</div>
							<router-link :to="{name:'list',query:{type:'popular',tags:'虎'}}" :draggable="false">
								<Button class="mr-2 text-sm text-primary-500 dark:text-white" label="查看更多"
								        size="small"
								        text>
									查看更多
									<div class="ml-2 fa-regular fa-chevron-right"></div>
								</Button>
							</router-link>
						</div>
						<NovelList v-ssr type="popular" order="desc" listStyle="style2" :desc="false" :author="false"
						           :tags="['虎']"
						           :limit="3"
						           :userId="null" :keyword="null" :ids="null"/>
					</div>
					<div class="flex flex-1 flex-col rounded bg-white text-black max-sm:p-3 dark:bg-surface-600 dark:text-white">
						<div class="m-2 flex items-center justify-between">
							<div class="text-xl font-bold">龙</div>
							<router-link :to="{name:'list',query:{type:'popular',tags:'龙'}}" :draggable="false">
								<Button class="mr-2 text-sm text-primary-500 dark:text-white" label="查看更多"
								        size="small"
								        text>
									查看更多
									<div class="ml-2 fa-regular fa-chevron-right"></div>
								</Button>
							</router-link>
						</div>
						<NovelList v-ssr type="popular" order="desc" listStyle="style2" :desc="false" :author="false"
						           :tags="['龙']"
						           :limit="3"
						           :userId="null" :keyword="null" :ids="null"/>
					</div>
					<div class="flex flex-1 flex-col rounded bg-white text-black max-sm:p-3 dark:bg-surface-600 dark:text-white">
						<div class="m-2 flex items-center justify-between">
							<div class="text-xl font-bold">狼</div>
							<router-link :to="{name:'list',query:{type:'popular',tags:'狼'}}" :draggable="false">
								<Button class="mr-2 text-sm text-primary-500 dark:text-white" label="查看更多"
								        size="small"
								        text>
									查看更多
									<div class="ml-2 fa-regular fa-chevron-right"></div>
								</Button>
							</router-link>
						</div>
						<NovelList v-ssr type="popular" order="desc" listStyle="style2" :desc="false" :author="false"
						           :tags="['狼']"
						           :limit="3"
						           :userId="null" :keyword="null" :ids="null"/>
					</div>
				</div>
				<div class="flex flex-1 flex-wrap max-sm:flex-col">
					<div class="flex flex-1 flex-col rounded bg-white text-black max-sm:p-3 dark:bg-surface-600 dark:text-white">
						<div class="m-2 flex items-center justify-between">
							<div class="text-xl font-bold">狗</div>
							<router-link :to="{name:'list',query:{type:'popular',tags:'狗'}}" :draggable="false">
								<Button class="mr-2 text-sm text-primary-500 dark:text-white" label="查看更多"
								        size="small"
								        text>
									查看更多
									<div class="ml-2 fa-regular fa-chevron-right"></div>
								</Button>
							</router-link>
						</div>
						<NovelList v-ssr type="popular" order="desc" listStyle="style2" :desc="false" :author="false"
						           :tags="['狗']"
						           :limit="3"
						           :userId="null" :keyword="null" :ids="null"/>
					</div>
					<div class="flex flex-1 flex-col rounded bg-white text-black max-sm:p-3 dark:bg-surface-600 dark:text-white">
						<div class="m-2 flex items-center justify-between">
							<div class="text-xl font-bold">猫</div>
							<router-link :to="{name:'list',query:{type:'popular',tags:'猫'}}" :draggable="false">
								<Button class="mr-2 text-sm text-primary-500 dark:text-white" label="查看更多"
								        size="small"
								        text>
									查看更多
									<div class="ml-2 fa-regular fa-chevron-right"></div>
								</Button>
							</router-link>
						</div>
						<NovelList v-ssr type="popular" order="desc" listStyle="style2" :desc="false" :author="false"
						           :tags="['猫']"
						           :limit="3"
						           :userId="null" :keyword="null" :ids="null"/>
					</div>
					<div class="flex flex-1 flex-col rounded bg-white text-black max-sm:p-3 dark:bg-surface-600 dark:text-white">
						<div class="m-2 flex items-center justify-between">
							<div class="text-xl font-bold">狐</div>
							<router-link :to="{name:'list',query:{type:'popular',tags:'狐'}}" :draggable="false">
								<Button class="mr-2 text-sm text-primary-500 dark:text-white" label="查看更多"
								        size="small"
								        text>
									查看更多
									<div class="ml-2 fa-regular fa-chevron-right"></div>
								</Button>
							</router-link>
						</div>
						<NovelList v-ssr type="popular" order="desc" listStyle="style2" :desc="false" :author="false"
						           :tags="['狐']"
						           :limit="3"
						           :userId="null" :keyword="null" :ids="null"/>
					</div>
				</div>
			</div>
		</div>
		
		<div class="flex flex-1 flex-col rounded bg-white p-10 text-black max-sm:p-3 dark:bg-surface-600 dark:text-white">
			<div class="m-2 flex items-center justify-between">
				<div class="text-2xl font-bold">最新小说</div>
				<router-link :to="{name:'list',query:{type:'latest'}}" :draggable="false">
					<Button class="mr-2 text-sm text-primary-500 dark:text-white" label="查看更多" size="small" text>
						查看更多
						<div class="ml-2 fa-regular fa-chevron-right"></div>
					</Button>
				</router-link>
			</div>
			<NovelList v-ssr type="latest" order="desc" listStyle="style1" :desc="false" :author="false" :tags="null"
			           :limit="16"
			           :userId="null" :keyword="null" :ids="null"/>
		</div>
	</div>
</template>

<script setup>
import dialog from '@/utils/dialog.js';
import NovelList from '@/components/views/NovelList.vue';

onServerPrefetch(() => {
});
</script>
