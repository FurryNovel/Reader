<template>
	<Main>
		<router-view v-slot="{ Component }">
			<Suspense>
				<component :is="Component"/>
				<template #fallback>
					<div class="flex justify-center items-center h-screen w-screen">
						<Button label="primary">
							重试
						</Button>
					</div>
				</template>
			</Suspense>
		</router-view>
	</Main>
</template>

<style>

</style>
<script setup>
import Navbar from "@/components/layout/NavBar.vue";
</script>
