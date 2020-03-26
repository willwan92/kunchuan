export const project = {
    namespaced: true,
    state: {
        projectList: [],
    },
    getters: {
        // doubleCount(state) {
        //     return state.count * 2;
        // }
    },
    mutations: {
        SET_PROJECT_LIST(state, projectList) {
            console.log(fetch);

            state.projectList = projectList;
        }
    },
    actions: {
        getProjectList(context, playload) {

        }
    }
}