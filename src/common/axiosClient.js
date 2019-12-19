import axios from 'axios';
import qs from 'qs';
// import createSign from 'api/sign';
import { getToken } from './utils';

// const URL_DEVELOPMENT = 'http://api-control.test.hxsapp.com/';
// const URL_PRODUCTION = 'http://api-control.hxsapp.com/';
// const HOST_DEVELOPMENT = 'admin-gym.test.hxsapp.com';
// const HOST_PRODUCTION = 'admin-gym.hxsapp.com';

const HOST_DEVELOPMENT = 'admin-gym.test.hxsapp.com';
const HOST_PRODUCTION = 'admin-gym.hxsapp.com';

const URL_DEVELOPMENT = 'https://pjjtest.yibung.net/api/';
const URL_PRODUCTION = 'https://pjjtest.yibung.net/api/';

const HOST = window.location.host;

const axiosClient = axios.create({
  // baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'http://api-control.test.hxsapp.com/',
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

//上传图片
export const uploadFileApi = HOST ===HOST_PRODUCTION ? URL_PRODUCTION : process.env.NODE_ENV === 'development' ? 'http://172.30.10.18:8080/api/pj-operation/file/uploadFile' : URL_DEVELOPMENT;

export { axiosClient };
