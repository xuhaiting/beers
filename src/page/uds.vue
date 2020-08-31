<template>
    <div class="udsContainer" v-loading="loading">
        <div class="view">
            <div id="model" class="model">
                <div class="mask" v-if="isBorder" :style="borderStyle">{{name}}</div>
            </div>
        </div>
        <div class="pluginArea">
            <el-form :model="addForm">
                <el-form-item :key="item.field" v-for="item in pluginList">
                    <div class="plugin" v-if="item.plugin === 'input'">
                        <el-input v-model="addForm[item.field]" @mouseenter.native="mouseenter(item)"
                            @mouseleave.native="mouseleave"></el-input>
                    </div>
                    <div class="plugin" v-if="item.plugin === 'selected'">
                        <el-select v-model="addForm[item.field]" @mouseenter.native="mouseenter(item)"
                            @mouseleave.native="mouseleave">
                            <el-option v-for="obj in selectedList" :key="obj.value" :label="obj.label"
                                :value="obj.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                msg: 'UDS',
                loading: false,
                isBorder: false,
                name:"",
                borderStyle: {
                    width: "",
                    height: "",
                    left: "",
                    top: "",
                },
                addForm: {
                    name: "name",
                    address:"address",
                    email:"email",
                    gender: "1",
                    country:"country"
                },
                pluginList: [{
                    name: "name",
                    field: "name",
                    plugin: "input",
                    local: {
                        x: 20,
                        y: 40,
                        width: 240,
                        height: 120
                    }
                }, {
                    name: "address",
                    field: "address",
                    plugin: "input",
                    local: {
                        x: 80,
                        y: 30,
                        width: 500,
                        height: 300
                    }
                }, {
                    name: "email",
                    field: "email",
                    plugin: "input",
                    local: {
                        x: 200,
                        y: 300,
                        width: 300,
                        height: 200
                    }
                }, {
                    name: "gender",
                    field: "gender",
                    plugin: "selected",
                    local: {
                        x: 40,
                        y: 80,
                        width: 240,
                        height: 180
                    }
                }, {
                    name: "country",
                    field: "country",
                    plugin: "input",
                    local: {
                        x: 300,
                        y: 120,
                        width: 240,
                        height: 400
                    }
                }],
                selectedList: [{
                    label: "man",
                    value: "1"
                }, {
                    label: "woman",
                    value: "2"
                }]
            }
        },
        methods: {
            mouseenter(obj) {
                let item = obj.local;
                this.borderStyle = {
                    width: item.width + "px",
                    height: item.height + "px",
                    left: item.x + "px",
                    top: item.y + "px"
                }
                this.name = obj.name;
                this.isBorder = true;
            },
            mouseleave() {
                this.isBorder = false;
                this.borderStyle = {};
            }
        },
        mounted() {
            console.log("welcome uds")
        }
    }
</script>

<style scoped>
    .udsContainer {
        display: flex;
        text-align: center;
        justify-content: center;
        font-size: 32PX;
    }

    .view {
        flex-grow: 1;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-image: url("../assets/image/bg.jpg");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .model {
        width: 100%;
        height: 100%;
    }

    .modelMask {
        background-color: rgba(0, 0, 0, 0.4);
    }

    .pluginArea {
        width: 30%;
        padding: 10px;
    }

    .plugin {
        border-width: 2px;
        border-style: solid;
        border-radius: 4px;
        border-color: #fff;
        cursor: pointer;
        cursor: pointer;
    }

    .plugin:hover {
        border-color: rgba(6, 143, 113, 0.562);
    }

    .mask {
        /* background-color: rgba(255, 255, 255, 0.8);
        border: 2px dotted rgba(6, 143, 113, 0.562); */
        background: linear-gradient(0deg, transparent 6px, rgba(6, 143, 113, 0.562) 6px) repeat-y,
            linear-gradient(0deg, transparent 50%,rgba(6, 143, 113, 0.562) 0) repeat-y,
            linear-gradient(90deg, transparent 50%, rgba(6, 143, 113, 0.562) 0) repeat-x,
            linear-gradient(90deg, transparent 50%, rgba(6, 143, 113, 0.562) 0) repeat-x;
        background-size: 2px 12px, 2px 12px, 12px 2px, 12px 2px;
        background-position: 0 0, 100% 0, 0 0, 0 100%;
        background-color: rgba(255, 255, 255, 0.8);
        animation: move 0.3s infinite linear;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(6, 143, 113, 0.562);
    }

    @keyframes move {
        from {}
        to {
            background-position: 0 -12px, 100% 12px, 12px 0, -12px 100%;
        }
    }

    .plugin/deep/.el-select {
        width: 100%;
    }
</style>