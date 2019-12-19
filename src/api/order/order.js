
import { axiosClient } from 'common/axiosClient';

// 订单列表
function getOrderList(params) {
    return axiosClient.get('pj-operation/order/getOrderList', { params: params });
}

// 订单详情
function getOrderDetails(params) {
    return axiosClient.get('pj-operation/order/getOrderDetails', { params: params });
}

export {
    getOrderList,
    getOrderDetails
}