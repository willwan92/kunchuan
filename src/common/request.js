/**
 * @desc 暴露api的重复部分
 */

import { axiosClient, axiosClientFuzz } from 'common/axiosClient';

export const post = async({ url, params = {}, type = 'post', vm }) => {
    let data;

    await axiosClient[type](url, params)
        .then(res => {
            if (Number(res.status) === 200) {
                data = res.data;
            } else {
                vm.$message.error(res.statusText)
            }
        })
        .catch(err => {
            vm.$message.error('服务器错误，请检查输入或稍后重试！');
        });

    return data;
}

export const getFuzz = async({ url, params = {}, type = 'get', vm }) => {
    let data;

    await axiosClientFuzz[type](url, {
            'params': {
							...params,
							timestamp: Date.now()
						}
        }).then(res => {
            if (Number(res.status) === 200) {
                data = res.data;
            } else {
                vm.$message.error(res.statusText)
            }
        })
        .catch(err => {
            vm.$message.error('服务器错误，请检查输入或稍后重试！');
        });

    return data;
}

export const postFuzz = async({ url, params = {}, type = 'post', vm }) => {
    let data;
    await axiosClientFuzz[type](url, params)
        .then(res => {
            if (Number(res.status) === 200) {
                data = res.data;
            } else {
                vm.$message.error(res.statusText)
            }
        })
        .catch(err => {
            vm.$message.error('服务器错误，请检查输入或稍后重试！');
        });

    return data;
}