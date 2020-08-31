<template>
	<div id="app">
		<router-view class="pageView" />
	</div>
</template>
<script>
	import Header from "./components/header";
	import Nav from "./components/nav";
	import Login from "./components/login"

	export default {
		name: "App",
		data() {
			return {
				content: "",
				path:"login"
			}
		},
		components: {
			Header,
			Nav,
			Login
		},
		mounted() {
		}
	};
</script>

<style>
	.pageView {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>