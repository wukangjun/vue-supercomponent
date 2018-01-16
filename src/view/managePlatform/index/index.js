import { http, service, COMMON } from '@/utils'
export default {
    state: {
        menus: [],
        searchList: [],
        power: {},
        manageMenuTitle: ""
    },
    mutations: {
        getMenus(state, params) {
            state.menus = [], state.searchList = [];
            if (service.isArray(params) && params.length > 0) {
                let manageMenu = params.find((value) => {
                    return value.id == 1
                })
                state.menus = manageMenu.child;
                manageMenu.child.forEach(val => {
                    if (service.isArray(val.child)) {
                        val.child.forEach(child => {
                            state.searchList.push({ child: child, index: val.index });
                        })
                    }
                })
            }
        },
        getMenuTitle(state, params) {
            state.manageMenuTitle = params;
        }
    },
    actions: {
        // 获取菜单接口
        getMenus({ commit }, params) {
            http({
                url: COMMON.baseUrl + '/rolemenu/findMenuTree'
            }).then(data => {
                commit('getMenus', data.data)
            })
        },
        getMenuTitle({ commit }, params) {
            commit('getMenuTitle', params);
        }
    },
    getters: {
        manageMenus(state) {
            return state.menus
        },
        manageMenuTitle(state) {
            return state.manageMenuTitle;
        }
    }
}