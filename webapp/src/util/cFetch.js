import fetch from 'isomorphic-fetch';
import { message, Modal } from 'antd';

require('es6-promise').polyfill();

const errorMessages = (res) => `${res.status} ${res.statusText}`;

function check401(res) {
    // 登陆界面不需要做401校验
    if (res.status === 401) {
        return Promise.reject(errorMessages(res));

    }
    return res;
}

function check404(res) {
    if (res.status === 404) {
        return Promise.reject(errorMessages(res));
    }
    return res;
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        // 这里补充更多错误参数
        return response.text().then(errorMsg => {
            return {
                statusCode: response.status,
                msg: errorMsg
            };
        }).then(err => { throw err; });
    }
}

function jsonParse(res) {
    if(res){
        return eval("("+res+")");
    }else{
        return {
            msg: "无数据返回"
        };
    }

}
function textParse(res){
    return res.text();
}
function resMessage(res){
    if(res.success){
        message.success(res.message, 2.5);
    }else{
        message.error(res.message, 2.5);
    }
    return res;

}
function setUriParam(keys, value, keyPostfix) {
    let keyStr = keys[0];

    keys.slice(1).forEach((key) => {
        keyStr += `[${key}]`;
    });

    if (keyPostfix) {
        keyStr += keyPostfix;
    }

    return `${encodeURIComponent(keyStr)}=${encodeURIComponent(value)}`;
}

function getUriParam(keys, object) {
    const array = [];

    if (object instanceof(Array)) {
        object.forEach((value) => {
            array.push(setUriParam(keys, value, '[]'));
        });
    } else if (object instanceof(Object)) {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const value = object[key];

                array.push(getUriParam(keys.concat(key), value));
            }
        }
    } else {
        if (object !== undefined) {
            array.push(setUriParam(keys, object));
        }
    }

    return array.join('&');
}

function toQueryString(object) {
    const array = [];

    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const str = getUriParam([key], object[key]);

            if (str !== '') {
                array.push(str);
            }
        }
    }

    return array.join('&');
}


function cFetch(url,params, options) {
    let mergeUrl =  url;
    const defaultOptions = {
        method: 'GET',
        credentials: "include",
        redirect:'follow',
        headers:{
            authorization:localStorage.token
        }
        
    };

    const opts = Object.assign({}, defaultOptions, {...options});
    opts.params = params
    // add query params to url when method is GET
    if (opts && opts.method === "GET" && opts['params']) {
        mergeUrl = mergeUrl + '?' + toQueryString(opts['params']);
    }

    opts.headers = {
        ...opts.headers
    };

    return fetch(mergeUrl, opts)
        .then(check401)
        .then(check404)
        .then(checkStatus)
        .then(textParse)
        .then(jsonParse)
        // .then(resMessage)
}

//catch all the unhandled exception
window.addEventListener("unhandledrejection", function(err) {
    const ex = err.reason;
    if(ex.constructor != null  || ex.msg != null){
        message.error(ex.msg, 2.5);
    }
});

export default cFetch;