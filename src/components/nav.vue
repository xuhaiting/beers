<template>
    <el-menu class="el-menu-vertical-demo" :unique-opened="true" :default-active="activeIndex"
        :default-openeds="openIndex">
        <div :key="i" v-for="(item, i) in navList">
            <el-submenu :index="item.name" v-if="!!item.list">
                <template slot="title">
                    <i :class="item.icon"></i>
                    <span>{{ item.title }}-{{ item.name }}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item :key="j" :index="obj.name" v-for="(obj, j) in item.list"
                        @click="goPage({ item: item, obj: obj })">
                        <span>{{ obj.title }}-{{ obj.name }}</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item :index="item.name" v-else @click="goPage({ item: item })">
                <i :class="item.icon"></i>
                <span>{{ item.title }}-{{ item.name }}</span>
            </el-menu-item>
        </div>
    </el-menu>
</template>
<script>
    export default {
        data() {
            return {
                openIndex: [],
                activeIndex: "",
                navList: [{
                    title: "用户",
                    name: "user",
                    icon: "el-icon-user-solid"
                }, {
                    title: "租户",
                    name: "tenant",
                    icon: "el-icon-phone"
                }, {
                    title: "角色",
                    name: "role",
                    icon: "el-icon-s-custom"
                }, {
                    title: "UDSVIEW",
                    name: "uds",
                    icon: "el-icon-picture"
                }, 
                // {
                //     title: "设计",
                //     name: "design",
                //     icon: "el-icon-picture"
                // }, {
                //     title: "物品",
                //     name: "goods",
                //     icon: "el-icon-s-goods"
                // }, {
                //     title: "说明",
                //     name: "instruction",
                //     icon: "el-icon-s-order"
                // }, {
                //     title: "MK",
                //     name: "michaelKors",
                //     icon: "el-icon-shopping-bag-1"
                // }, {
                //     title: "产品",
                //     name: "product",
                //     icon: "el-icon-menu"
                // }, {
                //     title: "角色",
                //     name: "role",
                //     icon: "el-icon-s-custom"
                // }, {
                //     title: "Tenant",
                //     name: "tenant",
                //     icon: "el-icon-phone"
                // }
            ]
            };
        },
        watch: {
            $route(to, from) {
                this.setNavMenu(to);
            }
        },
        methods: {
            goPage(options) {
                let { item, obj = {} } = options;
                let query = {
                    title: obj.title || item.title,
                    name: obj.name || item.name
                };
                if (obj.type) query["type"] = obj.type;
                this.$router.push({
                    path: item.name,
                    query: query
                });
            },
            setNavMenu({ path, query = {} }) {
                let index = path.substr(1);
                let activeIndex = query.name || index;
                this.openIndex = [index];
                this.activeIndex = activeIndex;
            }
        },
        mounted() {
            this.setNavMenu(this.$route);
        }
    };
</script>
<style scoped>
    .el-menu {
        height: 100%;
    }
</style>