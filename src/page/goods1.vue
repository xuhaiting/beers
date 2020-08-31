<template>
    <div v-loading="loading">
        <template>
            <div class="operater_header">
                <div class="btn_area">
                    <el-button type="primary" icon="el-icon-plus" @click="addGoods()">新增</el-button>
                </div>
            </div>
            <div class="info_area">
                <el-table width="100%" :data="list">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="account" label="account" width="200" sortable='custom'></el-table-column>
                    <el-table-column prop="name" label="name" width="200" sortable='custom'></el-table-column>
                    <el-table-column prop="tenantKey" label="tenantKey" width="200"> </el-table-column>
                    <el-table-column prop="storeKey" label="storeKey" width="200"></el-table-column>
                    <el-table-column prop="marketplaceCode" label="marketplaceCode" width="200"> </el-table-column>
                    <el-table-column prop="" label=""> </el-table-column>
                    <el-table-column fixed="right" label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button @click="editGoods(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button @click="delGoods(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="infoPagination">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" :layout="pageLayout"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                msg: 'GOODS',
                loading: false,
                searchText:"",
                orderBy:[],
                list: [],
                pageSizes: [10, 20, 30, 50],
                pageSize: 10,
                pageLayout: "total, sizes, prev, pager, next, jumper",
                total: 0,
                currentPage: 1
            }
        },
        methods: {
            addGoods() {
                console.log('addGoods...');
            },
            editGoods(obj) {
                console.log('editGoods...');
            },
            delGoods(obj={}){
                console.log('delGoods...');
            },
            //获取分页参数
            getPagination(){
                let obj = {
                    pageIndex: this.currentPage,
                    pageSize: this.pageSize
                }
                return obj;
            },
            //分页参数变化----每页size
            handleSizeChange(val) {
                this.pageSize = val;
                if(this.currentPage * this.pageSize > this.total) return;
                this.getData();
            },
            //分页参数变化----页码
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            //获取List请求
            async getData() {
                let paging = this.getPagination();
                const res = await this.API.GET_GOODS_POST({
                    data:{
                        search:this.searchText,
                        paging:paging,
                        orderBy:this.orderBy
                    }
                });
                console.log('res', res);
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .dialogForm/deep/.el-select{
        width: 100%;
    }
</style>