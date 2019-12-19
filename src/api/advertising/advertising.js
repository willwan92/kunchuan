import { axiosClient } from 'common/axiosClient';

//广告列表
function getAdvertisingList(params) {
    return axiosClient.get('pj-operation/marketAdvertise/getList', {params:params});
}
//获取编辑数据
function getEditorList(params) {
    return axiosClient.get('pj-operation/marketAdvertise/getMarketAdvertiseById', {params:params});
}
//编辑保存
function saveEditor(params) {
    return axiosClient.post('pj-operation/marketAdvertise/updateMarketAdvertise', params);
}
//更改广告状态
function saveStatus(params) {
    return axiosClient.post('pj-operation/marketAdvertise/updateMarketAdvertiseIsOnline', params);
}
export {
    getAdvertisingList,
    getEditorList,
    saveEditor,
    saveStatus,
}