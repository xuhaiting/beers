<template>
    <div>
        <template>
            <div class="operater_header">
                <div class="btn_area">
                    <el-button type="primary" icon="el-icon-plus">新增</el-button>
                </div>
            </div>
            <div class="info_area">
                <el-table width="100%" v-loading="loading" :data="list">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="name" label="name" width="200">
                    </el-table-column>
                    <el-table-column class="imageColumn" label="selectSource" width="500">
                        <div class="imageTemplate" slot-scope="scope">
                            <div :key="i" v-for="(item, i) in scope.row.selectSource">
                                <el-image style="width: 40px; height: 40px" :src="item.value"></el-image>
                                <div>{{ item.text }}</div>
                            </div>
                        </div>
                    </el-table-column>
                    <el-table-column prop="" label=""> </el-table-column>
                    <el-table-column fixed="right" label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button @click="getImage(scope.row)" type="text" size="small">图片</el-button>
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

        <el-dialog class="dialog_new" :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false"
            :close-on-press-escape="false" append-to-body width="400px">
            <div class="dialogForm">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveName">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="dialogImageListTitle" :visible.sync="dialogImageListVisible" :close-on-click-modal="false"
            :close-on-press-escape="false" append-to-body width="550px">
            <div class="dialogForm">
                <el-table :data="imageList">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column label="text" prop="text" width="150"></el-table-column>
                    <el-table-column label="value">
                        <el-image style="width: 80px; height: 80px" slot-scope="scope" :src="scope.row.value">
                        </el-image>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click="editImage(scope)" type="text" size="small">编辑</el-button>
                            <el-button @click="delImage(scope)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogImageListVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveImage">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="ImageInfo" :visible.sync="dialogImageVisible" :close-on-click-modal="false"
            :close-on-press-escape="false" append-to-body width="400px">
            <div class="dialogForm">
                <el-form ref="form" :model="imageForm" label-width="80px">
                    <el-form-item label="图片名称">
                        <el-input v-model="imageForm.text"></el-input>
                    </el-form-item>
                    <el-form-item label="来源">
                        <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture"
                            accept=".jpg,.jpeg,.png,.gif" :limit=1 :file-list="imageForm.fileList"
                            :on-remove="handleRemove" :on-exceed="handleExceed" :on-success="handleSuccess">
                            <el-button :disabled="!!fileList.length" size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogImageVisible = false">取 消</el-button>
                <el-button type="primary" :disabled="!fileList.length" @click="addImage">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                msg: "GOODS",
                loading: true,
                id: "",
                list: [],
                dialogVisible: false,
                dialogImageListVisible: false,
                dialogImageVisible: false,
                dialogTitle: "",
                dialogImageListTitle: "",
                fileList: [],//上传组件内部的文件列表
                imageList: [],//单条记录的图片列表
                imageIndex: "",//图片详情的索引
                imageForm: {//弹出框内图片信息的表单
                    text: "",
                    fileList: []
                },
                form: {
                    name: ""
                },
                pageSizes: [20, 30, 40, 50],
                pageSize: 20,
                pageLayout: "total, sizes, prev, pager, next, jumper",
                total: 100,
                currentPage: 1
            };
        },
        computed: {
            type() {
                return this.$route.query.type
            }
        },
        watch: {
            type() {
                this.getData();
            },
            dialogVisible(val) {
                if (!val) this.dialogReset();
            },
            dialogImageVisible(val) {
                if (!val) this.dialogImageReset();
            }
        },
        methods: {
            getPagination(){
                let obj = {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                }
                return obj;
            },
            handleSizeChange(val) {
                this.pageSize = val;
                if(this.currentPage * this.pageSize > this.total) return;
                this.getData();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            handleSuccess(response, file) {
                this.fileList = [{
                    name: file.name,
                    url: file.url
                }]
            },
            handleRemove(file, fileList) {
                this.fileList = [];
            },
            handleExceed(files, fileList) {
                this.$message.warning("只能上传1张图片")
            },
            addImage() {
                let imgObj = Object.assign({}, this.imageForm);
                let imageList = this.imageList.concat([]);
                imageList[this.imageIndex] = {
                    text: imgObj.text,
                    value: this.fileList[0]["url"]
                }
                this.imageList = imageList;
                this.dialogImageVisible = false;
            },
            getImage(row) {
                this.imageList = row.selectSource.concat([]);
                this.dialogImageListTitle = row.name + "-" + row.id;
                this.dialogImageListVisible = true;
            },
            editImage({ row, $index }) {
                this.imageForm = {
                    text: row.text,
                    fileList: [{ name: row.text, url: row.value }]
                }
                this.fileList = [{
                    name: row.text,
                    url: row.value
                }]
                this.imageIndex = $index;
                this.dialogImageVisible = true;
            },
            delImage({ $index }) {
                this.imageList.splice($index, 1);
            },
            saveImage() {
                console.log("imageList", this.imageList)
            },
            saveName() {
                console.log("form", this.form);
            },
            handleClick(row) {
                let { selectSource = [] } = row;
                this.dialogTitle = row.name + "-" + row.id;
                this.id = row.id;
                this.form = {
                    name: row.name
                };
                this.dialogVisible = true;
            },
            formatFileList(list = []) {
                return list.map(item => {
                    return {
                        name: item.text,
                        url: item.value
                    };
                });
            },
            dialogImageReset() {
                this.imageForm = {
                    text: "",
                    fileList: []
                }
                this.imageIndex = "";
            },
            dialogReset() {
                this.form = {
                    id: "",
                    name: "",
                    selectSource: []
                };
            },
            async getGoodById(fn) {
                let res = await this.API.GET_GOODSBYID_GET();
                let { data = {} } = res;
                this.list = data.designElements || [];
                this.loading = false;
                fn && fn();
            },
            getData() {
                this.loading = true;
                this.getGoodById();
                // let { query: { type = "" } } = this.$route;
                // if (type === "goods1") this.getGoodById();
                // else {
                //     this.list = [];
                //     setTimeout(_ => {
                //         this.loading = false;
                //     }, 1000)
                // }
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .imageTemplate {
        display: flex;
        text-align: center;
    }

    .imageTemplate>div {
        margin: 10px;
    }

    .dialogForm {
        max-height: 400px;
    }
</style>