<template>
    <div v-loading="loading">
        <template>
            <div class="operater_header">
                <div class="btn_area">
                    <el-button type="primary" icon="el-icon-plus">新增</el-button>
                </div>
            </div>
            <div class="info_area">
                <el-table width="100%" :data="list">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="marketplaceCode" label="marketplaceCode" width="200"></el-table-column>
                    <el-table-column prop="name" label="name" width="200"></el-table-column>
                    <el-table-column prop="" label=""></el-table-column>
                    <el-table-column fixed="right" label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button @click="editDesign(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button @click="delDesign(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
        <div class="infoPagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" :layout="pageLayout"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                msg: 'DESIGN',
                loading: true,
                list: [],
                pageSizes: [20, 30, 40, 50],
                pageSize: 20,
                pageLayout: "total, sizes, prev, pager, next, jumper",
                total: 100,
                currentPage: 1
            }
        },
        methods: {
            getPagination() {
                let obj = {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                }
                return obj;
            },
            handleSizeChange(val) {
                this.pageSize = val;
                if (this.currentPage * this.pageSize > this.total) return;
                this.getData();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            editDesign(obj) {
                console.log("edit", obj)
            },
            delDesign(obj) {
                console.log("del", obj)
            },
            async getData(fn) {
                this.loading = true;
                let data = await this.API.GET_DESIGN_GET();
                this.list = data.data || [];
                this.loading = false;
                fn && fn();
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>