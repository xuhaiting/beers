import api from "./axiosConfig"
import Vue from 'vue'

const API = {
    // GET_GOODSBYID_GET:async obj=>{
    //     return await api.get({
    //         url:"/goods/a16fbef2516511eaaa9a00163e12a0ac",
    //         ...obj
    //     })
    // },
    // GET_INSTRUCTION_GET:async obj=>{
    //     return await api.get({
    //         url:"/instruction",
    //         ...obj
    //     })
    // }
}

export default _=>{
    Vue.prototype.API = API
}


