
import { axiosClient } from 'common/axiosClient';
//商品管理/回收站列表
function getGoodsList(params) {
    return axiosClient.get('pj-operation/goods/getGoodsList', {params:params});
}
//新增商品
function goodsNew(params) {
    return axiosClient.post('pj-operation/goods/saveGoods', params);
}
//编辑商品
function goodsEditor(params) {
    return axiosClient.post('pj-operation/goods/updateGoodsById', params);
}
//获取编辑商品的数据
function getGoodsEditor(params) {
    return axiosClient.get('pj-operation/goods/getGoodsById', {params:params});
}
//批量修改商品的状态
function goodsStatus(params) {
    return axiosClient.post('pj-operation/goods/updateBatchStatus', params);
}
//导出列表
function exportList(params) {
    return axiosClient.get('pj-operation/goods/exportInfo', {params:params});
}
export {
    getGoodsList,
    goodsNew,
    goodsEditor,
    getGoodsEditor,
    goodsStatus,
    exportList,
}