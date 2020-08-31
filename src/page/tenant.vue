<template>
    <div v-loading="loading">
        <template>
            <div class="operater_header">
                <div class="filter_area">
                    <el-form class="filter_unit" @submit.native.prevent status-icon>
                        <el-form-item>
                            <el-input v-model="searchText" placeholder="请输入内容" prefix-icon="el-icon-search"
                                autocomplete="off" maxlength="30" @keyup.native.enter='search()' ></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="filter_unit">
                        <el-button type="primary" icon="el-icon-search" @click="search">查找</el-button>
                    </div>
                </div>
                <div class="btn_area">
                    <el-button type="primary" icon="el-icon-plus" @click="addTenant">新增</el-button>
                </div>
            </div>
            <div class="info_area">
                <el-table width="100%" :data="list">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="tenantKey" label="tenant" width="300"></el-table-column>
                    <el-table-column prop="name" label="name" width="300"></el-table-column>
                    <el-table-column prop="" label=""> </el-table-column>
                    <el-table-column fixed="right" label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button @click="editTenant(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button @click="delTenant(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="infoPagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" :layout="pageLayout"
                    :total="total">
                </el-pagination>
            </div>
        </template>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" append-to-body width="450px">
            <div class="dialogForm">
                <el-form :model="form" ref="form" :rules="rules" label-width="100px">
                    <el-form-item label="tenantKey" prop="tenantKey">
                        <el-input v-model="form.tenantKey" maxlength="30" :disabled="edit"></el-input>
                    </el-form-item>
                    <el-form-item label="name" prop="name">
                        <el-input v-model="form.name" maxlength="30"></el-input>
                    </el-form-item>
                    <el-form-item label="marketplace" prop="marketplaceCodes">
                        <el-select v-model="form.marketplaceCodes" multiple placeholder="请选择">
                            <el-option
                                v-for="obj in marketCodesList"
                                :key="obj.value"
                                :label="obj.label"
                                :value="obj.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Util from "../../common/util"
    import qs from "qs"

    export default {
        data() {
            let tenantValidate = async (rule, value, callback)=>{
                if(this.edit) return;
                let res = await this.API.VALIDATE_TENANT_POST({
                    query:qs.stringify({
                        key:value
                    })
                })
                if(!res) callback("");
            }
            return {
                msg: 'TENANT',
                loading: true,
                dialogTitle: "",
                dialogVisible: false,
                searchText: "",
                edit:false,
                tenantFields: [{
                    name: "tenant",
                    field: "tenantKey"
                }, {
                    name: "name",
                    field: "name"
                }, {
                    name: "marketplace",
                    field: "marketplaceCodes"
                }],
                form:{
                    name:"",
                    tenantKey:"",
                    marketplaceCodes:[]
                },
                rules:{
                    name: [
                        { required: true, message: 'Please Input Name', trigger: 'blur' },
                        { min:4, max: 30, message: '长度在 4 - 30 个字符', trigger: 'blur' }
                    ],
                    tenantKey: [
                        { required: true, message: 'Please Input Tenant', trigger: 'blur' },
                        { validator: tenantValidate , message: 'Tenant 已存在，请重新填写', trigger: "blur" },
                        { min:4, max: 30, message: '长度在 4 - 30 个字符', trigger: 'blur' }
                    ],
                    marketplaceCodes: [
                        { required: true, message: 'Please Choose Marketplace', trigger: 'blur' }
                    ],
                },
                orderBy:[],
                list: [],
                marketCodesList: [],
                pageSizes: [20, 30, 40, 50],
                pageSize: 20,
                pageLayout: "total, sizes, prev, pager, next, jumper",
                total: 100,
                currentPage: 1
            }
        },
        methods: {
            //查询条件
            search(){
                this.currentPage = 1;
                this.getData();
            },
            //清除form验证
            clearFormValidate(formName){
                this.$refs[formName] && this.$refs[formName].clearValidate();
            },
            //获取分页参数
            getPagination(){
                let obj = {
                    currentPage: this.currentPage,
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
            //新增
            addTenant(){
                this.edit = false;
                this.openEdit();
            },
            //编辑
            editTenant(obj){
                this.edit = true;
                this.openEdit(obj);
            },
            //打开弹窗
            openEdit(obj={}){
                this.clearFormValidate("form");
                let {name="Add New Tenant"} = obj;
                Object.keys(this.form).map(v=>{
                    this.form[v] = obj[v] || "";
                })
                this.dialogTitle = name;
                this.dialogVisible = true;
            },
            //保存
            save(){
                console.log("this.form",this.form)
                this.$refs["form"].validate((res) => {
                    if (res) {
                        this.saveName();
                    }
                });
            },
            //保存请求
            async saveName(){
                let form = this.form;
                // let res = await this.API.SUBMIT_TENANT_POST({
                //     data:form
                // })
                // console.log("res",res);
            },
            //获取数据List
            async getData(fn) {
                let paging = this.getPagination();
                this.loading = true;
                let data = await this.API.GET_TENANT_POST({
                    data:{
                        search:this.searchText,
                        paging:paging,
                        orderBy:this.orderBy
                    }
                });
                this.loading = false;
                this.list = data.items || [];
                fn && fn();
            },
            //获取tenant范围List
            async getMarketCodesData(){
                this.loading = true;
                let res = await this.API.GET_MARKETPLACE_GET();
                this.loading = false;
                let list = Util.formatObjectArray(res,{
                    label:"name",
                    value:"tenantKey"
                })
                this.marketCodesList = list;
            }
        },
        mounted() {
            this.getData();
            this.getMarketCodesData();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .dialogForm/deep/.el-select{
        width: 100%;
    }
</style>