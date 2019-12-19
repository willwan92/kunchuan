
import { axiosClient } from 'common/axiosClient';

// 用户列表
function getUserList(params) {
    return axiosClient.get('pj-operation/user/getUserList', {
    	params: params
    });
}

// 用户详情
function getUserDetail(params) {
    return axiosClient.get('pj-operation/user/getUserDetails', {
    	params: params
    });
}

export {
    getUserList,
    getUserDetail
}