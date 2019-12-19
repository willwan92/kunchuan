
import { axiosClient } from '../common/axiosClient';

// 用户登陆
function login(params) {
    return axiosClient.post('pj-operation/open/login', params);
}

export {
    login
}