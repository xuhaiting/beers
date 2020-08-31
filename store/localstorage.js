import Vue from 'vue'

const localStorage = {
    set:(key,val)=>{
        if(typeof val === "object") val = JSON.stringify(val)
        window.localStorage.setItem(key,val);
    },
    get:(key)=>{
        return window.localStorage.getItem(key);
    },
    remove:(key)=>{
        window.localStorage.removeItem(key);
    },
    clear:_=>{
        window.localStorage.clear();
    }
}

export default _=> {
    Vue.prototype.localStorage = localStorage
};



