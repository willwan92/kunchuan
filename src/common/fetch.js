/**
 * @desc 暴露api的重复部分
 */

import { axiosClient } from 'common/axiosClient';

export const fetch = async ({ url, params = {}, type = 'post', vm }) => {
  const data = await axiosClient[type](url, params);
  if (Number(data.status) === 200) {
    return data.data
  } else {
    vm.$message.error(data.statusText)
  }
}