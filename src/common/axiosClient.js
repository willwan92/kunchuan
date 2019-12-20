import axios from 'axios';
import qs from 'qs';
// import createSign from 'api/sign';
import { getToken } from './utils';

const HOST_DEVELOPMENT = '';
const HOST_PRODUCTION = '10.60.4.3:8080';

const URL_DEVELOPMENT = '';
const URL_PRODUCTION = 'http://10.60.4.3:8081';
const URL_PRODUCTION_FUZZ = 'http://10.60.4.3:8080';

const HOST = window.location.host;

const axiosClient = axios.create({
  baseURL: HOST === HOST_PRODUCTION ? URL_PRODUCTION : process.env.NODE_ENV === 'development' ? '/api' : URL_DEVELOPMENT,
  withCredentials: true,
  timeout: 10000,
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
  baseURL: HOST === HOST_PRODUCTION ? URL_PRODUCTION_FUZZ : process.env.NODE_ENV === 'development' ? '/fuzzApi' : URL_DEVELOPMENT,
  withCredentials: true,
  timeout: 10000,
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
      config.headers.common = {'Content-Type': 'application/x-www-form-urlencoded'};
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


export { axiosClient, axiosClientFuzz };
