<template>
    <div v-loading="loading">
        <template>
            
        </template>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                msg: 'PRODUCT',
                loading: true,
                list: [],
            }
        },
        methods: {
            async getData() {
                let res = await this.API.GET_PRODUCT_GET({
                    timeout:300000
                });
                let { data = {} } = res;
                this.loading = false;
                console.log("res",res);
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>