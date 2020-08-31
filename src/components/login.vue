<template>
    <div class="bg" v-loading="loading" element-loading-text="Please wait..." element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.6)">
        <div class="loginContainer">
            <div class="logo"></div>
            <el-form :model="form" :rules="rules" ref="loginForm" @keyup.native.enter='login' class="loginInfo"
                status-icon>
                <el-form-item prop="account">
                    <el-input v-model="form.account" placeholder="Please Input Account" prefix-icon="el-icon-user"
                        autocomplete="off" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="form.password" placeholder="Please Input Password"
                        prefix-icon="el-icon-lock" autocomplete="off" maxlength="20" show-password></el-input>
                </el-form-item>
            </el-form>
            <el-button class="loginBtn" type="primary" @click="login">登录</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                msg: 'LOGIN PAGE',
                loading: false,
                form: {
                    account: "",
                    password: ""
                },
                rules: {
                    account: [
                        { required: true, message: 'Please Input Account', trigger: 'blur' },
                        { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'Please Input Password', trigger: 'blur' },
                        { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            login() {
                this.$refs["loginForm"].validate((res) => {
                    if (res) {
                        this.postLogin();
                    }
                });
            },
            async postLogin() {
                let data = this.form;
                data["includeRoles"] = true;
                this.loading = true;
                let res = await this.API.LOGIN_USER_POST({
                    data: data
                })
                if (!!res) {
                    setTimeout(_ => {
                        this.loading = false;
                        let { name, token = {} } = res;
                        let user = {
                            name: name,
                            token: token.value
                        }
                        this.localStorage.set("user", user);
                        this.$router.push("/")
                    })
                }else{
                    this.loading = false;
                    this.$message({
                        message: "登录失败",
                        type: "error"
                    });
                }
            }
        },
        mounted() {
            console.log("welcome LOGIN")
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .bg {
        width: 100%;
        height: 100%;
        background-image: url("../assets/image/bg.jpg");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .logo {
        width: 300px;
        height: 49px;
        background-image: url("../assets/image/logo.png");
        background-size: contain;
        background-repeat: no-repeat;
    }

    .loginInfo {
        width: 300px;
        margin-top: 40px;
    }

    .loginBtn {
        width: 100%;
    }
</style>