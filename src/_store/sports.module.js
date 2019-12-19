import { sportService } from '../_services';

export const sports = {
    namespaced: true,
    state: {
        all: {}
    },
    actions: {
        getAll({ commit }) {
            commit('getAllRequest');

            sportService.getAll()
                .then(
                    sports => commit('getAllSuccess', sports),
                    error => commit('getAllFailure', error)
                );
        }
    },
    mutations: {
        getAllRequest(state) {
            state.all = { loading: true };
        },
        getAllSuccess(state, sports) {
            state.all = { items: sports };
        },
        getAllFailure(state, error) {
            state.all = { error };
        }
    }
}
