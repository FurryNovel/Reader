<template>
	<div>
		<router-link to="/">Home</router-link>
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
	</div>
</template>

<style>

</style>
<script setup>
</script>
