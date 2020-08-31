<template>
	<div class="footerContainer">
        <div class="btn" :class="{dark: item.dark}" v-for="item in list" :key="item.label" @click="item.fn()">{{item.label}}</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
                list: []
			};
        },
        props: {
            data: {
                type: Array
            }
        },
        created() {
            const data = this.data;
            this.list = data;
        }
	};
</script>
<style scoped>
    .footerContainer {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px solid #000;
    }

    .footerContainer .btn {
        flex-grow: 1;
        width: 0;
        height: 5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 2px;
        font-size: 1.25rem;
    }
    .footerContainer .btn.dark {
        color: #fff;
        background: #000;
    }
</style>