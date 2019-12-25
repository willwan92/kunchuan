import axios from 'axios';
import qs from 'qs';
import { getToken } from './utils';

const HOST = window.location.host;
const HOST_DEVELOPMENT = 'localhost:8080';

const URL_PRODUCTION = `http://${HOST.split(':')[0]}:8081`;
const URL_PRODUCTION_FUZZ = `http://${HOST}`;

const FUZZ_URL = HOST === HOST_DEVELOPMENT ? 'http://10.60.4.3:8080' : URL_PRODUCTION_FUZZ;

const axiosClient = axios.create({
    baseURL: HOST === HOST_DEVELOPMENT ? '/api' : URL_PRODUCTION,
    timeout: 100000,
    responseType: 'json',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [
        function(data, headers) {
            return qs.stringify(data);
        }
    ]
});

const axiosClientFuzz = axios.create({
    baseURL: HOST === HOST_DEVELOPMENT ? '/fuzzApi' : URL_PRODUCTION_FUZZ,
    timeout: 100000,
    responseType: 'json',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [
        function(data, headers) {
            return qs.stringify(data);
        }
    ]
});

// 拦截请求, 登录接口不传token
axiosClient.interceptors.request.use(
    config => {
        if (config.url === 'pj-operation/open/login') {
            config.headers.common = { 'Content-Type': 'application/x-www-form-urlencoded' };
        } else {

            let token = getToken();
            if (token) {
                config.headers.common['Authorization'] = 'Bearer ' + token;
            }

        }
        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 拦截返回值
// axiosClient.interceptors.response.use( (response) => {
//   if (response.data.code == 400 && response.data.data.tokenStatus == 0) {
//     removeToken();
//     window.location.reload();
//     return;
//   }
//   return response;
// })


export { axiosClient, axiosClientFuzz, FUZZ_URL };