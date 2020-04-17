import { post } from 'common/request';
import { formatTreeData } from "common/utils";

export const project = {
    namespaced: true,
    state: {
        projectList: [],
    },
    getters: {
        pjTreeData(state) {
            return formatTreeData(state.projectList);
        }
    },
    mutations: {
        SET_PROJECT_LIST(state, playload) {
            state.projectList = playload.projectList;
        }
    },
    actions: {
        async getProjectList({ commit }, playload) {
            const data = await post({
                url: "/projectInfo/getEnableRole",
                params: {
                    enablerole: `(${playload.roleId})`
                },
                vm: null
            });

            commit({
                type: 'SET_PROJECT_LIST',
                projectList: data
            });
        }
    }
}