<template>
	<diV class="home">
		<h1>{{msg}}</h1>
	</diV>
</template>
</diV>
</template>

<script>
	export default {
		data() {
			return {
				msg:"HOME PAGE"
			};
		},
		mounted() {
			console.log("欢迎进入首页区域");
		}
	};
</script>
<style>
	.home{
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32px;
	}
</style>