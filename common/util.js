//工具类
function isEmpty(val){
    return val === "";
}

function isEmptyObject(object){
    return JSON.stringify(object) === "{}";
}

function isNull(params) {
    return params === null
}

function isUndefined(params){
    return params === undefined
}

function formatFormNull(form){
    Object.keys(form).map(k=>{
        if(!!isEmpty(form[k])) form[k] = null;
    })
    return form;
}

function formatEmptyObject(form){
    Object.keys(form).map(k=>{
        form[k] = "";
    })
    return form;
}

function formatObjectArray(arr,object){
    return arr.map(item=>{
        return {
            label:item[object.label],
            value:item[object.value]
        }
    })
}

export default {
    isEmpty,
    isEmptyObject,
    isNull,
    isUndefined,
    formatFormNull,
    formatEmptyObject,
    formatObjectArray
};

