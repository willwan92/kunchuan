import Vue from 'vue';
import Vuex from 'vuex';
import { fetch } from 'common/request';

import { project } from './modules/project';

Vue.use(Vuex);



export default new Vuex.Store({
    modules: {
        project
    }
})