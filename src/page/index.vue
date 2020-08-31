<template>
	<diV class="index">
		<div class="design">
			<Design :data="designList" />
		</div>
		<div class="footer">
			<Footer :data="footBtnList" />
		</div>
	</diV>
</template>

<script>
	import Design from '../components/design';
	import Footer from '../components/footer';

	export default {
		data() {
			return {
				msg:"HOME PAGE",
				designList: [{
					id: 1,
					type: 'img',
					url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598853524450&di=8d0f989514f19d293adf66baa6c76f9a&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F17%2F02%2F17%2Fd8416e3b6e3a80df1e94a8b14b29f306.jpg%2521%2Ffwfh%2F804x801%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue',
					position: {
						x: 0,
						y: 0,
						width: 200,
						height: 200,
						zIndex: 1,
						rotate: 0
					}
				}, {
					id: 2,
					type: 'img',
					url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598853567215&di=ee5178e5f8d936bd13be748617bc0d9f&imgtype=0&src=http%3A%2F%2Fwww.51pptmoban.com%2Fd%2Ffile%2F2017%2F10%2F15%2F6ffa25f84245f7360ee95696f8b554b4.png',
					position: {
						x: 100,
						y: 340,
						width: 200,
						height: 180,
						zIndex: 2,
						rotate: 0
					}
				}],
				footBtnList: [{
					label: '360预览°',
					fn: this.preview
                }, {
					label: '完成设计',
					fn: this.finished,
                    dark: true
                }]
			};
		},
		components: {
			Design,
			Footer
		},
		methods: {
			preview() {
				console.log('360°预览')
			},
			finished() {
				console.log('完成设计');
			}
		},
		mounted() {
			console.log("欢迎进入首页区域");
		}
	};
</script>
<style>
	.index {
		display: flex;
		flex-direction: column;
	}
	.design {
		height: 0;
		flex-grow: 1;
	}
</style>