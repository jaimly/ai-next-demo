import Axios from 'axios';
import { message } from 'antd';

const IsAlert = false;
async function request (url, method='GET', data, params, type='Payload') {
    const opts = {
        method,
        url: getApiFullUrl(url),
        params,
        data,
        headers: {
            'Authorization': getAuthorization()
        }
    };

    switch(type) {
        case 'urlencoded':
            opts.transformRequest = [
                function (val) {
                let ret = ''
                for (let it in val) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(val[it]) + '&'
                }
                ret = ret.substring(0, ret.lastIndexOf('&'));
                return ret;
                }
            ];
            opts.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            break;
        case 'form':
            opts.headers['Content-Type'] = 'application/form-data; charset=utf-8';
            break;
        default:
            opts.headers['Content-Type'] = 'application/json; charset=utf-8';
            break;
    }

    return Axios(opts).then(function (result) {
        if ((result.status >= 500) && (result.status <= 600)) {
            if(IsAlert) alert('服务器错误，可稍候再试');
            return Promise.reject(result);
        }
        if (result.status !== 200) {
            if(IsAlert) alert(result);
            return Promise.reject(result);
        }

        result = result.data;
        if (!result || result.constructor !== Object) return result;
        if(isNaN(result.ok)) return result;
        if (result.ok === 0) return result.data;
        return Promise.reject(result);
    }).catch(err => {
        return globalError(err || 'Network Anomaly!');
    })
}

async function globalError(err, msg) {
    if(err && err.ok === 98) return ApiLogout('/#/mine');
    message.error(msg || err.msg);
    if(IsAlert) alert(msg || err.msg);
    return Promise.reject(err);
}

function getApiFullUrl (url) {
    return `/api${url}`;
}

function getAuthorization() {
    return `Bearer ${window.localStorage.getItem('jwt')}`;
}

export {
    request,
    globalError
}