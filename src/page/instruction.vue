<template>
    <div>
        <template>
            <div class="operater_header">
                <div class="btn_area">
                    <el-button type="primary" icon="el-icon-plus">新增</el-button>
                </div>
            </div>
            <div class="info_area">
                <el-table width="100%" :data="list">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column props="key" label="key" width="300">
                    </el-table-column>
                    <el-table-column prop="name" label="name" width="300"></el-table-column>
                    <el-table-column props="instructionCodes" label="instructionCodes" width="400"></el-table-column>
                    <el-table-column prop="" label=""> </el-table-column>
                    <el-table-column fixed="right" label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button @click="editInstruction(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button @click="delInstruction(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                msg: 'INSTRUCTION',
                list: [],
            }
        },
        methods: {
            editInstruction(obj) {
                console.log("edit", obj)
            },
            delInstruction(obj) {
                console.log("del", obj)
            },
            async getData() {
                let res = await this.API.GET_INSTRUCTION_GET();
                let { data = {} } = res;
                this.list = data.data || [];
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