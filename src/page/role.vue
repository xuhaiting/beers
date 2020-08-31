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
                    <el-button type="primary" icon="el-icon-plus" @click="addRole">新增</el-button>
                </div>
            </div>
            <div class="info_area">
                <el-table width="100%" :data="list">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="key" label="key" width="200" sortable='custom'></el-table-column>
                    <el-table-column prop="name" label="name" width="300" sortable='custom'></el-table-column>
                    <el-table-column prop="tenantKey" label="tenantKey" width="300"> </el-table-column>
                    <el-table-column prop="" label=""> </el-table-column>
                    <el-table-column fixed="right" label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button @click="editRole(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button @click="delRole(scope.row)" type="text" size="small">删除</el-button>
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
                    <el-form-item label="key" prop="key">
                        <el-input v-model="form.key" maxlength="30" :disabled="edit"></el-input>
                    </el-form-item>
                    <el-form-item label="name" prop="name">
                        <el-input v-model="form.name" maxlength="30"></el-input>
                    </el-form-item>
                    <el-form-item label="tenant" prop="tenantKey">
                        <el-select v-model="form.tenantKey" placeholder="请选择">
                            <el-option
                                v-for="obj in tenantKeyList"
                                :key="obj.tenantKey"
                                :label="obj.name"
                                :value="obj.tenantKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="permission" prop="permissionCodes">
                        <el-select v-model="form.permissionCodes" multiple placeholder="请选择">
                            <el-option
                                v-for="obj in permissionCodeList"
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

    export default {
        data() {
            return {
                msg: 'ROLE',
                loading: true,
                edit: false,
                dialogTitle: "",
                dialogVisible: false,
                searchText: "",
                roleFields: [{
                    name: "key",
                    field: "key"
                }, {
                    name: "name",
                    field: "name"
                }, {
                    name: "tenant",
                    field: "tenantKey",
                    plugin: "selected"
                }, {
                    name: "permission",
                    field: "permissionCodes"
                }],
                form:{
                    key:"",
                    name:"",
                    tenantKey:"",
                    permissionCodes:[]
                },
                rules:{
                    key: [
                        { required: true, message: 'Please Input Key', trigger: 'blur' },
                        { min:4, max: 20, message: '长度在 4 - 20 个字符', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: 'Please Input Name', trigger: 'blur' },
                        { min:4, max: 20, message: '长度在 4 - 20 个字符', trigger: 'blur' }
                    ],
                    tenantKey: [
                        { required: true, message: 'Please Choose TenantKey', trigger: 'blur' }
                    ],
                    permissionCodes: [
                        { required: true, message: 'Please Choose permissionCodes', trigger: 'blur' }
                    ]
                },
                orderBy:[],
                list: [],
                tenantKeyList: [],
                permissionCodeList: [],
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
            getPagination() {
                let obj = {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                }
                return obj;
            },
            //分页参数变化----每页size
            handleSizeChange(val) {
                this.pageSize = val;
                if (this.currentPage * this.pageSize > this.total) return;
            },
            //分页参数变化----页码
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            //新增
            addRole(){
                this.edit = false;
                this.openEdit();
            },
            //编辑
            editRole(obj){
                this.edit = true;
                this.openEdit(obj);
            },
            //打开编辑框
            openEdit(obj){
                this.clearFormValidate("form");
                this.getRole(obj,form=>{
                    this.loading = false;
                    Object.keys(this.form).map(v=>{
                        this.form[v] = form[v] || "";
                    })
                    this.dialogVisible = true;
                });
            },
            //保存
            save(){
                console.log("form",this.form);
                this.$refs["form"].validate((res) => {
                    if (res) {
                        this.saveRole();
                    }
                });
            },
            //根据Name获取Role数据
            async getRole(obj={},fn){
                let edit = this.edit;
                let {name="Add New Role"} = obj;
                this.dialogTitle = name;
                this.loading = true;
                if(edit){
                    let data = await this.API.GET_ROLE_GET(obj);
                    fn && fn(data);
                }else{
                    fn && fn({});
                }
            },
            //保存数据
            async saveRole(){
                let form = this.form;
                form = Util.formatFormNull(form);
                this.loading = true;
                let data = await this.API.SUBMIT_ROLE_POST({
                    data:form
                });
                console.log("data",data);
                this.loading = false;
                this.dialogVisible = false;
            },
            //获取List数据
            async getData(fn){
                let paging = this.getPagination();
                this.loading = true;
                let data = await this.API.SEARCH_ROLE_POST({
                    data:{
                        search:this.searchText,
                        paging:paging,
                        orderBy:this.orderBy
                    }
                });;
                this.loading = false;
                this.list = data.items || [];
                this.total = data.count || 0
                fn && fn();
            },
            //获取Tenant数据List
            async getTenantKeyList(){
                this.loading = true;
                let data = await this.API.GET_TENANT_POST({
                    data:{
                        search:"",
                        orderBy:[]
                    }
                });
                this.loading = false;
                this.tenantKeyList = data.items || [];
            },
            //获取Permission数据List
            async getPermissionCodesData(){
                this.loading = true;
                let res = await this.API.GET_PERMISSIONS_GET()
                this.loading = false;
                let list = Util.formatObjectArray(res,{
                    label:"name",
                    value:"code"
                })
                this.permissionCodeList = list;
            }
        },
        mounted() {
            this.getData();
            this.getTenantKeyList();
            this.getPermissionCodesData();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .dialogForm/deep/.el-select{
        width: 100%;
    }
</style>