import { axiosClient } from 'common/axiosClient';

//im接口  在线客服
function getSignByUserId(params){
    return axiosClient.post('gym/Im/getSignByUserId', params);
}
export {
  getSignByUserId,
}