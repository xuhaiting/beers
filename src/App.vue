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
	.topContainer {
		height: 100%;
		overflow: hidden;
	}

	.topInfo {
		height: calc(100% - 60px);
		overflow: hidden;
	}
	
	.pageHeader {
		height: 54px;
		display: flex;
		align-items: center;
		padding: 0 16px;
		border-bottom: 1px solid #eaeefb;
	}

	.pageView {
		height: calc(100% - 55px);
		overflow-y: auto
	}

	.el-main {
		color: #333;
		text-align: center;
		padding: 0 !important;
		margin: 0 !important;
		overflow: hidden !important;
	}
</style>