<template>
    <div v-loading="loading">
        <template>
            <div class="operater_header">
                <div class="filter_area">
                    <el-form class="filter_unit" @submit.native.prevent status-icon>
                        <el-form-item>
                            <el-input v-model="searchText" placeholder="请输入内容" prefix-icon="el-icon-search"
                                autocomplete="off" maxlength="30" @keyup.native.enter='search()' clearable ></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="filter_unit">
                        <el-button type="primary" icon="el-icon-search" @click="search">查找</el-button>
                    </div>
                </div>
                <div class="btn_area">
                    <el-button type="primary" icon="el-icon-plus" @click="addUser()">新增</el-button>
                </div>
            </div>
            <div class="info_area">
                <el-table width="100%" :data="list" @sort-change='sortOrder' :row-class-name="tableRowClassName">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="account" label="account" width="200" sortable='custom'></el-table-column>
                    <el-table-column prop="name" label="name" width="200" sortable='custom'></el-table-column>
                    <el-table-column prop="tenantKey" label="tenantKey" width="200"> </el-table-column>
                    <el-table-column prop="storeKey" label="storeKey" width="200"></el-table-column>
                    <el-table-column prop="marketplaceCode" label="marketplaceCode" width="200"> </el-table-column>
                    <el-table-column prop="" label=""> </el-table-column>
                    <el-table-column fixed="right" label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button @click="editUser(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button @click="delUser(scope.row)" type="text" size="small">删除</el-button>
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

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" append-to-body width="450px">
            <div class="dialogForm">
                <el-form :model="form" ref="form" :rules="rules" label-width="100px">
                    <el-form-item :key="item.field" v-for="item in userFields" :label="item.name" :prop="item.field">
                        <el-input v-model="form[item.field]" maxlength="20" :disabled="item.disabled"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="Add User" :visible.sync="addDialogVisible" v-loading="addLoading" append-to-body width="450px">
            <div class="dialogForm">
                <el-form :model="addForm" ref="addForm" :rules="rules" label-width="130px">
                    <el-form-item :key="item.field" v-for="item in addUserFields" :label="item.name" :prop="item.field">
                        <el-input v-if="!item.plugin" v-model="addForm[item.field]" maxlength="20"></el-input>
                        <el-select v-if="item.plugin === 'selected'" v-model="addForm[item.field]" placeholder="请选择">
                            <el-option
                                v-for="obj in tenantKeyList"
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
                <el-button type="primary" @click="saveNew">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import Util from "../../common/util"
    import qs from "qs"

    export default {
        data() {
            let accountValidate = async (rule, value, callback)=>{
                if(this.edit) return;
                let res = await this.API.VALIDATE_ACCOUNT_POST({
                    query:qs.stringify({
                        account:value
                    })
                })
                if(!res) callback("");
            }
            return {
                msg: 'USER',
                edit: false,
                dialogTitle: "",
                dialogVisible: false,
                addDialogVisible: false,
                searchText:"",
                loading: true,
                addLoading: false,
                userFields: [{
                    name: "account",
                    field: "account",
                    disabled: true,
                }, {
                    name: "name",
                    field: "name"
                }, {
                    name: "storeKey",
                    field: "storeKey"
                }, {
                    name: "mpCode",
                    field: "marketplaceCode"
                }],
                addUserFields: [{
                    name: "account",
                    field: "account"
                }, {
                    name: "name",
                    field: "name"
                }, {
                    name: "password",
                    field: "password"
                }, {
                    name:"tenantKey",
                    field: "tenantKey",
                    plugin: "selected"
                }, {
                    name: "storeKey",
                    field: "storeKey"
                }, {
                    name: "marketplaceCode",
                    field: "marketplaceCode"
                }],
                form:{
                    name:"",
                    account:"",
                    storeKey:"",
                    marketplaceCode:""
                },
                addForm:{
                    name:"",
                    account:"",
                    password:"",
                    tenantKey:"",
                    storeKey:"",
                    marketplaceCode:""
                },
                rules:{
                    name: [
                        { required: true, message: 'Please Input Name', trigger: 'blur' },
                        { min:4, max: 20, message: '长度在 4 - 20 个字符', trigger: 'blur' }
                    ],
                    account: [
                        { required: true, message: 'Please Input Account', trigger: "blur" },
                        { validator: accountValidate , message: 'Account 已存在，请重新填写', trigger: "blur" },
                        { min:4, max: 20, message: '长度在 4 - 20 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'Please Input Password', trigger: 'blur' },
                        { min:4, max: 20, message: '长度在 4 - 20 个字符', trigger: 'blur' }
                    ],
                    tenantKey: [
                        { required: true, message: 'Please Choose TenantKey', trigger: 'blur' }
                    ],
                    storeKey: [
                        { min:4, max: 20, message: '长度在 4 - 20 个字符', trigger: 'blur' }
                    ],
                    marketplaceCode: [
                        { min:4, max: 20, message: '长度在 4 - 20 个字符', trigger: 'blur' }
                    ]
                },
                orderBy:[],
                list: [],
                tenantKeyList:[],
                pageSizes: [10, 20, 30, 50],
                pageSize: 10,
                pageLayout: "total, sizes, prev, pager, next, jumper",
                total: 0,
                currentPage: 1
            }
        },
        methods: {
            //列表行cls
            tableRowClassName({row, rowIndex}){
                if (rowIndex % 4 == 1) {
                    return "warning-row";
                } else if (rowIndex % 4 == 3) {
                    return "success-row";
                }
                return "";
            },
            //条件查询
            search(){
                this.currentPage = 1;
                this.getData();
            },
            //排序请求
            sortOrder(column){
                this.currentPage = 1;
                this.setOrder(column);
                this.getData();
            },
            //设置字段排序数据
            setOrder(column={}){
                let {order="",prop=""} = column;
                let orderBy = [];
                if(!!order){
                    let by = 0;
                    if(order === "ascending") by = 1;
                    if(order === "descending") by = 2;
                    orderBy = [{
                        orderingField:prop,
                        direction:by
                    }]
                }
                this.orderBy = orderBy
            },
            //清除form验证
            clearFormValidate(formName){
                this.$refs[formName] && this.$refs[formName].clearValidate();
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
            //新增用户
            addUser(){
                this.clearFormValidate("addForm");
                let form = Util.formatEmptyObject(this.addForm);
                this.edit = false;
                this.addForm = form;
                this.addDialogVisible = true;
            },
            //编辑用户
            editUser(obj) {
                this.clearFormValidate("form");
                let {name=""} = obj;
                this.edit = true;
                Object.keys(this.form).map(v=>{
                    this.form[v] = obj[v] || "";
                })
                this.dialogTitle = name;
                this.dialogVisible = true;
            },
            //删除用户
            delUser(obj={}){
                this.$confirm("确认要删除这条数据吗？", "提示", {
                    type: 'warning',
                }).then(_ => {
                    this.del(obj);
                }).catch(_ => { })
            },
            //新增保存
            saveNew(){
                this.$refs["addForm"].validate((res) => {
                    if (res) {
                        this.saveNewUser();
                    }
                });
            },
            //更新保存
            save(){
                this.$refs["form"].validate((res) => {
                    if (res) {
                        this.saveUser();
                    }
                });
            },
            //新增user请求
            async saveNewUser(){
                let form = this.addForm;
                form = Util.formatFormNull(form);
                this.loading = true;
                let res = await this.API.ADD_USER_PUT({
                    data:form
                })
                this.loading = false;
                this.$message({
                    message: !!res ? "新增成功！" : "新增失败",
                    type: !!res ? "success" : "error"
                });
                this.addDialogVisible = false;
                this.loading = false;
                if(!!res){
                    this.getData();
                }
            },
            //保存user请求
            async saveUser(){
                let form = this.form;
                //form = Util.formatFormNull(form);
                this.loading = true;
                let res = await this.API.UPDATE_USER_POST({
                    data:form
                })
                this.loading = false;
                this.$message({
                    message: !!res ? "更新成功！" : "更新失败",
                    type: !!res ? "success" : "error"
                });
                this.dialogVisible = false;
                if(!!res){
                    this.getData();
                }
            },
            //删除User请求
            async del(obj){
                let {account=""} = obj;
                this.loading = true;
                let res = await this.API.DEL_USER_DELETE({
                    key:account
                })
                this.loading = false;
                this.$message({
                    message: !!res ? "删除成功！" : "删除失败",
                    type: !!res ? "success" : "error"
                });
                if(!!res)this.getData();
            },
            //获取用户List请求
            async getData(fn) {
                this.loading = true;
                let paging = this.getPagination();
                let data = await this.API.SEARCH_USER_POST({
                    data:{
                        search:this.searchText,
                        paging:paging,
                        orderBy:this.orderBy
                    }
                });
                this.list = data.items || [];
                this.total = data.count || 0;
                this.loading = false;
                fn && fn();
            },
            getSelectedData(){
                let data = [{
                    label:"TenantKey",
                    value:"tenantKey"
                },{
                    label:"TenantKey1",
                    value:"tenantKey1"
                },{
                    label:"TenantKey2",
                    value:"tenantKey2"
                },{
                    label:"TenantKey3",
                    value:"tenantKey3"
                },{
                    label:"TenantKey4",
                    value:"tenantKey4"
                },{
                    label:"TenantKey5",
                    value:"tenantKey5"
                },{
                    label:"TenantKey6",
                    value:"tenantKey6"
                },{
                    label:"TenantKey7",
                    value:"tenantKey7"
                },{
                    label:"TenantKey8",
                    value:"tenantKey8"
                },{
                    label:"TenantKey9",
                    value:"tenantKey9"
                },{
                    label:"TenantKey10",
                    value:"tenantKey10"
                }]
                this.tenantKeyList = data;
            }
        },
        mounted() {
            this.getData();
            this.getSelectedData();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .dialogForm/deep/.el-select{
        width: 100%;
    }
</style>