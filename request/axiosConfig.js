import axios from 'axios';
import config from "./config"
import {
    Notification
} from 'element-ui'

const clearRequest = {
    source: {
        token: null,
        cancel: null
    }
}
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
axios.interceptors.request.use(config => {
    config.cancelToken = clearRequest.source.token;
    return config
}, error => {
    return Promise.reject(error)
})

let title = "",
    message = "";
axios.interceptors.response.use(
    undefined,
    error => {
        if (this.notification) this.notification.close();
        if (axios.isCancel(error)) { // 取消请求的情况下，终端Promise调用链
            return new Promise(() => { });
        } else {
            let { config = {} } = error;
            if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1 && !config._retry) {
                title = "超时";
                message = "您请求的时间过长，请联系管理员";
                this.notification = Notification.error({
                    title: title,
                    message: message,
                    duration: 3000
                })
                //return Promise.reject(error);
            } else {
                let res = error.response;
                switch (res.status) {
                    case 401:
                        title = "过期";
                        message = "未登录或者token过期";
                        break;
                    case 403:
                        title = "拒绝";
                        message = "您没有该操作权限";
                        break;
                    case 404:
                        title = "未知";
                        message = "数据来源错误";
                        break;
                    case 500:
                        title = "错误";
                        message = "服务器出错";
                        break;
                    default:
                        title = res.status;
                        message = res.statusText;
                }
            }
            this.notification = Notification.error({
                title: title,
                message: message,
                duration: 3000
            })
            return Promise.reject(error)
        }
    }
);
const request = o => {
    let user = localStorage.getItem("user");
    if(!!user){
        user = JSON.parse(user);
        axios.defaults.headers.common['Authorization'] = "Bearer "+user.token
    }
    let obj = {
        method: o.type,
        url: config.baseUrl + o.url,
        timeout: o.timeout || 20000,
        params: o.params || null,
        data: o.data || null,
        CancelToken: source.token,
        headers: {
            "Content-Type": "application/json",
            ...o.header
        }
    }
    return axios(obj).then(res => {
        if (res.status == 200) {
            let { data:{ flag=10, data=false, messages=[] } } = res;
            if(flag != 10) setNotify(messages);
            return data;
        } else {
            Notification.error({
                title: "interface error...",
                duration: 3000
            })
        }
    })
}

async function setNotify(list){
    for(let i = 0 ; i < list.length ; i ++){
        let {level=0,message} = list[i];
        let type = "warning",title = "警告";
        if(level <= 2){
            type = "info";
            title = "消息"
        }else if(level >= 4){
            type = "error";
            title = "错误"
        }
        await Notification({
            title: title,
            message: message,
            type: type,
            duration: 3000
        })
    }
}

const get = o => {
    o['type'] = 'get'
    return request(o)
}

const post = o => {
    o['type'] = 'post'
    return request(o)
}

const del = o => {
    o["type"] = "delete"
    o["header"] = {
        "Content-Type": "application/json"
    }
    return request(o);
}

const put = o => {
    o["type"] = "put"
    return request(o);
}

const AxiosConfig = {
    get: get,
    post: post,
    del: del,
    put:put,
    clearRequest: clearRequest
}

export default AxiosConfig;




