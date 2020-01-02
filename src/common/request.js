/**
 * @desc 暴露api的重复部分
 */

import { axiosClient, axiosClientFuzz } from 'common/axiosClient';

export const fetch = async({ url, params = {}, type = 'post', vm }) => {
    const data = await axiosClient[type](url, params);
    if (Number(data.status) === 200) {
        return data.data
    } else {
        vm.$message.error(data.statusText)
    }
}

export const fetchFuzz = async({ url, params = {}, type = 'get', vm }) => {
    const data = await axiosClientFuzz[type](url, {
        'params': params
    });

    if (Number(data.status) === 200) {
        return data.data
    } else {
        vm.$message.error(data.statusText)
    }
}

export const postFuzz = async({ url, params = {}, type = 'post', vm }) => {
    console.log(params)
    const data = await axiosClientFuzz[type](url, params);
    if (Number(data.status) === 200) {
        return data.data
    } else {
        vm.$message.error(data.statusText)
    }
}