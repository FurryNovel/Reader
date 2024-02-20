<template>
	<div class="flex h-full w-full flex-col">
		<NavBar :show-in="['mobile']" :hide-buttons="['icon']" :append-buttons="['back', 'home']"/>
		<div class="flex flex-1 flex-col rounded bg-white text-black sm:p-10 max-sm:p-5 dark:bg-surface-600 dark:text-white">
			<div class="m-2 flex items-center justify-between pl-2">
				<div class="text-2xl font-bold">
					偏好设置
				</div>
			</div>
			<div class="sm:mt-5">
				<ClientOnly>
					<TabView>
						<TabPanel header="基本设置">
							<div class="mt-5 mb-5 flex flex-col">
								<div class="flex flex-wrap items-center justify-between pl-2">
									<div @click="config.global.safeMode = !config.global.safeMode"
									     class="cursor-pointer">
										<div class="text-lg font-bold">
											安全模式
										</div>
										<span class="text-sm text-gray-500">
											列表将不会显示不适合工作时间的内容
										</span>
									</div>
									<div>
										<InputSwitch v-model="config.global.safeMode"/>
									</div>
								</div>
							</div>
							<div class="mb-5 flex flex-col">
								<div class="flex flex-wrap items-center justify-between pl-2">
									<div class="cursor-pointer">
										<div class="text-lg font-bold">
											主题模式
										</div>
										<span class="text-sm text-gray-500">
											自动切换主题模式
										</span>
									</div>
									<div>
										<SelectButton v-model="config.global.themeMode" optionLabel="name"
										              optionValue="value"
										              :options="[
                                                          { name: '自动', value: 'auto' },
                                                          { name: '明亮', value: 'light' },
														  { name: '夜间', value: 'dark' }
                                                      ]"
										              :allowEmpty="false"
										              aria-labelledby="basic"/>
									</div>
								</div>
							</div>
						</TabPanel>
						<TabPanel header="语言偏好">
							<div class="mb-5 flex flex-col">
								<div class="flex flex-wrap items-center justify-between pl-2">
									<div class="cursor-pointer">
										<div class="text-lg font-bold">
											隐藏语言
										</div>
										<span class="text-sm text-gray-500">
											选择不想看到的语言
										</span>
									</div>
									<div>
										<SelectButton v-model="config.global.hideLanguages" optionLabel="name" multiple
										              optionValue="value"
										              :options="config.global.acceptedLanguages"
										              aria-labelledby="basic"/>
									</div>
								</div>
							</div>
							<Divider/>
							<div class="mt-5 mb-5 flex flex-col">
								<div class="flex flex-wrap items-center justify-between pl-2">
									<div @click="config.global.autoTranslate = !config.global.autoTranslate"
									     class="cursor-pointer">
										<div class="text-lg font-bold">
											自动翻译
										</div>
										<span class="text-sm text-gray-500">
											自动翻译小说内容
										</span>
									</div>
									<div>
										<InputSwitch v-model="config.global.autoTranslate"/>
									</div>
								</div>
							</div>
							<div class="mb-5 flex flex-col">
								<div class="flex flex-wrap items-center justify-between pl-2">
									<div class="cursor-pointer">
										<div class="text-lg font-bold">
											翻译到...
										</div>
										<span class="text-sm text-gray-500">
											选择翻译到的语言
										</span>
									</div>
									<div>
										<SelectButton v-model="config.global.translateTo" optionLabel="name"
										              optionValue="value"
										              :options="[{ name: '自动', value: 'auto'}].concat(config.global.acceptedLanguages)"
										              :allowEmpty="false"
										              aria-labelledby="basic"/>
									</div>
								</div>
							</div>
						</TabPanel>
						<TabPanel header="内容偏好">
							<div class="mb-5 flex flex-col">
								<div class="flex flex-wrap items-center justify-between pl-2">
									<div class="cursor-pointer">
										<div class="text-lg font-bold">
											隐藏标签
										</div>
										<span class="text-sm text-gray-500">
											添加不想看到的标签
										</span>
									</div>
									<div>
										<Button label="添加" size="small" @click="showTagInput"></Button>
									</div>
								</div>
							</div>
							<Divider/>
							<div v-for="(tag,idx) in config.global.hideTags" class="mb-5 flex flex-col">
								<div class="flex flex-wrap items-center justify-between pl-2">
									<div class="cursor-pointer">
										<div class="text-lg font-bold text-gray-500">
											{{ tag }}
										</div>
									</div>
									<div>
										<Button label="删除" size="small" severity="danger"
										        @click="config.global.hideTags.splice(idx,1)">
										</Button>
									</div>
								</div>
							</div>
						</TabPanel>
					</TabView>
				</ClientOnly>
			</div>
		</div>
	</div>
</template>

<script setup>
import NavBar from "@/components/layout/NavBar.vue";
import {useConfigProvider} from "@/provider/config.js";
import ClientOnly from "@duannx/vue-client-only";
import SelectButton from 'primevue/selectbutton';
import dialog from "@/utils/dialog.js";

const config = useConfigProvider();
const data = reactive({})


function showTagInput() {
    dialog.input({
        title: '添加标签',
        content: '请输入标签名称',
        confirmBtn: '添加',
        cancelBtn: '取消',
    }).then(data => {
        if (data.input) {
            config.global.hideTags.push(data.input);
        }
    }).catch(() => {
    });
}
</script>

<style scoped>

</style>
