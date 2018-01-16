import { http, COMMON, service} from '@/utils'

export default {
    state: {
        user: null,
        mapName: null,
        mapType: null,
        token: null
    },
    mutations: {
        setUser(state, params) {
            state.user = params.userInfo;
            switch(parseInt(params.mapType)){
                case 1: state.mapName = 'baiduMap';break;
                case 2: state.mapName = 'sm';break;
                case 4: state.mapName = 'googleMap';break;
                case 3: state.mapName = 'gaodeMap';break;
                default: state.mapName = 'gaodeMap';break;
            }
            localStorage.setItem('token', params.token);
            localStorage.setItem('mapType', params.mapType);
            localStorage.setItem('user', JSON.stringify(params.userInfo));
        },
        setMapType(state, params){
            state.mapType = params;
            localStorage.setItem('mapType', params);
            switch(parseInt(params)){
                case 1: state.mapName = 'baiduMap'; break;
                case 4: state.mapName = 'googleMap'; break;
                case 3: state.mapName = 'gaodeMap'; break;
                default: state.mapName = 'gaodeMap'; break;
            } 
        }
    },
    actions: {
        setMapType({commit}, params){
            commit('setMapType', params)
        },
        // 获取token接口
        getToken({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/login',
                params:params
            })
        },
        // 设置用户的信息--- maptype userMess 
        setUser({ commit, dispatch }, params) {
            if (service.isObject(params)) {
                commit('setUser', params);
            }
        },
        // 获取公司信息
        findUserList({ commit }, id) {
            return http({
                url: COMMON.baseUrl + '/enterprise/getEnterpriseById',
                params: {
                    id: id
                }
            })
        },
        // 进入首次判断session是否存在
        verifySessionStatus({commit}, params){
            return http({
                url: COMMON.baseUrl + '/verifySessionStatus'
            })
        },
        // 退出登录
        exit({commit}, params){         
            return http({
                url: COMMON.baseUrl + '/logout'
            })
        }
    },
    getters: {
        user(state) {
            let user = JSON.parse(localStorage.getItem('user'));
            return state.user || (service.isObject(user) ? user : {})
        },
        mapType(state){
            return state.mapType || localStorage.getItem('mapType');
        },
        mapName(state) {
            //state.mapType == null && (state.mapName ='')
            let mapType = localStorage.getItem('mapType');
            switch(parseInt(mapType)){
                case 1: return  state.mapName || 'baiduMap';
                case 2: return  state.mapName || 'sm';
                case 4: return  state.mapName || 'googleMap';
                case 3: return  state.mapName || 'gaodeMap';
                default: return   state.mapName || 'gaodeMap';
           
            }
        }
    }
}