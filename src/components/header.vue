<template>
	<div class="headerContainer">
		<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
			background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
			<el-menu-item index="1">处理中心</el-menu-item>
			<el-submenu index="2">
				<template slot="title">我的工作台</template>
				<el-menu-item index="2-1">选项1</el-menu-item>
				<el-menu-item index="2-2">选项2</el-menu-item>
				<el-menu-item index="2-3">选项3</el-menu-item>
				<el-submenu index="2-4">
					<template slot="title">选项4</template>
					<el-menu-item index="2-4-1">选项1</el-menu-item>
					<el-menu-item index="2-4-2">选项2</el-menu-item>
					<el-menu-item index="2-4-3">选项3</el-menu-item>
				</el-submenu>
			</el-submenu>
			<el-menu-item index="3" disabled>消息中心</el-menu-item>
		</el-menu>
		<div class="userContainer">
			<div class="userInfo" v-if="user.name">
				<el-avatar size="medium" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">
				</el-avatar>
				<span class="userName">{{user.name}}</span>
			</div>
			<el-button type="danger" icon="el-icon-switch-button" size="mini" circle @click="handleExit"></el-button>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				activeIndex: "1",
				user:{}
			};
		},
		methods: {
			handleExit() {
				this.$confirm("确认要退出登录吗？", "提示", {
					type: 'warning',
				}).then(_ => {
					this.localStorage.remove("user");
					this.$message({
						message: '成功退出登录',
						type: 'success'
					});
					this.$router.replace("/login");
				}).catch(_ => { })
			},
			handleSelect(key, keyPath) {
				console.log(key, keyPath);
			}
		},
		mounted(){
			let user = this.localStorage.get("user");
			this.user = !user ? {} : JSON.parse(user);
		}
	};
</script>
<style scoped>
	.headerContainer {
		display: flex;
		background-color: #545c64;
		color: #fff;
		justify-content: space-between;
	}

	.userContainer {
		display: flex;
		align-items: center;
		margin-right: 10px;
	}

	.userInfo {
		display: flex;
		align-items: center;
	}

	.userName {
		margin: 0 10px;
		font-size: 16px;
	}
</style>