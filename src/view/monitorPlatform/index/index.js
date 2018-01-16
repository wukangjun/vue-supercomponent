import { http, service, COMMON } from '@/utils'
export default {
    state: {
        menus: [],
        onlineList: [],
        onlineNub: [],
        sendDirective: [],
        secondMenus: [],
        searchList: [],
        alarmNum: 0,
        power: {},
        menuTitle: "",
        isToggleTree: false,
        ptSingleCar: {},
        ptMultiCar: [],
        // socket推送过来的公司信息
        socketEnterprise: {},
        // socket推送过来的车辆信息
        socketVehicle: {},
        isAttention:{},
        //推送查岗
        socketInspector:{}
    },
    mutations: {
        mtgetMenus(state, params) {
            state.menus = [], state.searchList = [];
            if (service.isArray(params) && params.length > 0) {
                let monitorMenu = params.find((value) => {
                    return value.id==2
                })
                if (monitorMenu) {
                    let num=0;
                    monitorMenu.child.forEach((val, count) => {  //第一级菜单
                        if (service.isArray(val.child) && val.child.length > 0) {
                            val.child.forEach((child, index) => {//第二级菜单
                                // index == 0 ? (val.url = child.url) : null;
                                // 给路由添加序列号
                                child.child.forEach((item,list)=> {//第三级菜单
                                    
                                    if(item.url !== ''){
                                        item.list = list;
                                        item.num = num;
                                        item.fistCount=count;
                                        state.searchList.push(item);
                                    }
                                })
                                child.num = num;
                                child.fistCount=count;
                                state.secondMenus.push(child);
                                //state.searchList.push(child);
                                num++;
                            })
                        } else {
                            val.fistCount = count;//首页
                            state.searchList.push(val);
                        }
                        val.fistCount=count;
                    });
                    state.menus = monitorMenu.child;
                }
            }
        },
        onlineList(state, params) {
            state.onlineList = params;
        },
        onlineNub(state, params) {
            state.onlineNub = params;
        },
        addAlarmNum(state, params) {
            state.alarmNum = params;
        },
        addDirective(state, params) {
            state.sendDirective = params;
        },
        upMenuTitle(state, params) {
            state.menuTitle = params;
        },
        upSecondMenus(state, params) {
            state.secondMenus = params;
        },
        // 收缩公共树
        isToggleTree(state, params){
            state.isToggleTree = params;
        },
        // 公共树的单车信息
        ptSingleCar(state, params){
            state.ptSingleCar = params;
        },
        // 公共树的多车信息
        ptMultiCar(state, params){
            state.ptMultiCar = params;
        },
        // 清除公共树信息
        clearPtAllMessage(state){
            state.ptSingleCar = {};
            state.ptMultiCar = [];
        },
        // 添加了公司或者车组
        socketIsManage(state, params){
            state.socketEnterprise = params;
        },
        // 添加了车辆
        socketIsVehicle(state, params){
            state.socketVehicle = params;
        },
        isAttention(state, params){
            state.isAttention = params;
        },
        //查岗应答
        socketInspector(state,params){
            state.socketInspector = params;
        }
    },
    actions: {
        // 菜单获取接口
        mtgetMenus({ commit }, params) {
            http({
                url: COMMON.baseUrl + '/rolemenu/findMenuTree'
            }).then(data => {
                commit('mtgetMenus', data.data)
            })
        },
        //获得用户设置的报警提醒列表
        getUserRemindAlarmList({ commit }, params) {
            return  http({
                url:COMMON.baseUrl+"/userRemindAlarm/getUserRemindAlarmList",
                params:params
            });
        },
        //用户设置修改密码
         updatePswd({ commit }, params) {
            return  http({
                url:COMMON.baseUrl+"/user/updatePswd",
                params:params
            });
        },
        //保存用户设置的报警提醒
       saveUserRemindAlarm({ commit }, params) {
            return  http({
                url:COMMON.baseUrl+"/userRemindAlarm/saveUserRemindAlarm",
                params:params
            });
        },
        onlineList({ commit }, params) {
            commit('onlineList', params)
        },
        onlineNub({ commit }, params) {
            commit('onlineNub', params)
        },
        addAlarmNum({ commit }, params) {
            commit('addAlarmNum', params)
        },
        addDirective({ commit }, params) {
            commit('addDirective', params)
        },
        upMenuTitle({ commit }, params) {
            commit('upMenuTitle', params)
        },
        upSecondMenus({ commit }, params) {
            commit('upSecondMenus', params)
        },
        // 是否收缩树
        isToggleTree({commit}, params){
            commit('isToggleTree', params)
        },
        // 单车信息的保存
        ptSingleCar({commit}, params){
            commit('ptSingleCar', params)
        },
        // 多车信息保存
        ptMultiCar({commit}, params){
            commit('ptMultiCar', params)
        },
        // 清除公共树信息
        clearPtAllMessage({commit}){
            commit('clearPtAllMessage');
        },
        socketIsManage({commit}, params){
            commit('socketIsManage', params);
        },
        socketIsVehicle({commit}, params){
            commit('socketIsVehicle', params);
        },
        isAttention({commit}, params){
            commit('isAttention', params);
        },
        socketInspector({commit},params){
            commit('socketInspector',params)
        }
    },
    getters: {
        monitorMenu(state) {
            return state.menus
        },
        getSecondMenus(state) {
            return state.secondMenus;
        },
        onlineList(state) {
            return state.onlineList;
        },
        onlineNub(state) {
             return state.onlineNub;
        },
        sendDirective(state) {
            return state.sendDirective;
        },
        alarmNumS(state) {
            return state.alarmNum;
        },
        menuTitle(state) {
            return state.menuTitle;
        },
        isToggleTree(state){
            return state.isToggleTree;
        },
        ptSingleCar(state){
            return state.ptSingleCar;
        },
        ptMultiCar(state){
            return state.ptMultiCar;
        },
        // 推送公司车组
        socketEnterprise(state){
            return state.socketEnterprise;
        },
        // 推送车辆
        socketVehicle(state){
            return state.socketVehicle;
        },
        // 推送车辆
        isAttention(state){
            return state.isAttention;
        },
        //查岗
        socketInspector(state){
            return state.socketInspector
        }
    }
}