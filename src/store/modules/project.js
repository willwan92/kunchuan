export const project = {
    namespaced: true,
    state: {
        count: 1
    },
    getters: {
        doubleCount(state) {
            return state.count * 2;
        }
    },
    mutations: {
        increment(state) {
            state.count++;
        }
    },
    actions: {
        asyncIncrement(context, playload) {
            setTimeout(() => {
                context.commit('increment');
            }, 2000)
        }
    }
}