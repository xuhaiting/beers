<template>
	<diV class="home">
		<h1>{{msg}}</h1>
	</diV>
</template>

<script>
	export default {
		data() {
			return {
				msg: 'NOT FOUND 404!!!'
			}
		}
	}
</script>

<style scoped>
	.home{
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32px;
	}
</style>