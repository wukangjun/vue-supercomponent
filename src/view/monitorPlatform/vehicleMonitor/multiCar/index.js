import { http, COMMON, service } from '@/utils'
import filter from '@/utils/filter'
export default {
    state: {
        //勾选的公共车辆
        carList: [],
        // 删除树上的节点,
        removeNode: null,
        //添加的id
        addId: null,
        // 删除的id
        removeId: null,
        // 队列的车辆位置
        carPoints: {},
        //队列车辆信息
        carPointsMess: {}, 
        // 队列车辆信息===数组形式
        carPointsArray: [],
        // 当前选中的车辆信息
        carCurrent: {},
        // 车辆列表是否显示
        isPopover: false,
        // 多车监控和历史轨迹的显示标识
        isMonitorOrTrack: false,
        isToggleMonitorTree: true,
        // 所有历史轨迹地图点
        allHistoryTrackPoint: [],
        // 是否实施最佳视野标识
        isGetBaseView: false,
        playStartFalg: false,
        trackIndex:0,//轨迹回放播放下标
        sliderIndex:0,//滑块拖动值
        trackSpeed:500,//播放倍速
        trakchanges:false,
        // 获取加载好的树节点
        getAsyncNodes: null
    },
    mutations: {
        addVehicleList(state, params) {
            if (params.type === 'addOne') {
                state.removeId = null;
                state.addId = [params.data];
            }
            state.carList.push(params.data);
            state.carList = service.unique(state.carList, 'id');
        },
        removeVehicleList(state, params) {
            if (params.type === 'removeOne') {
                state.addId = null;
                state.removeId = [params.data];
            }
            let index = state.carList.findIndex(val => {
                return val.id == params.data.id;
            })
            state.removeNode = state.carList.splice(index, 1);
        },
        clearAllVehicleList(state) {
            state.carList = [];
        },
        clearCheckId(state) {
            state.addId = null;
            state.removeId = null;
        },
        isAllInfo(state, params){
            state.isAllInfo= params;
        },
        // 添加marker
        addPoints(state, params) {
            /* 存入当前车辆的marker点 */
            state.carPoints[params.id] = params.marker;
        },
        // 添加点的信息
        carPointsMess(state, params) {
            /*. 存入当前车辆信息到公共对象中 */
            state.carPointsMess[params.id] = params.data;
            state.carPointsArray.push(params.data);
            state.carPointsArray = service.unique(state.carPointsArray, 'vehicleId');
        },
        removePoints(state, id) {
            delete state.carPoints[id];
            delete state.carPointsMess[id];
        },
        clearAllPoints(state, params) {
            state.carPoints = {};
            state.carPointsMess = {};
            state.carCurrent = {};
        },
        // 当前显示的数据
        carCurrent(state, params) {
            state.carPointsMess[params.id] 
            ? state.carCurrent = state.carPointsMess[params.id] 
            : state.carCurrent = { plateCode: params.plateCode };
        },
        // 去除当前显示的数据
        removeCarCurrent(state) {
            state.carCurrent = {}
        },
        showPopover(state, flag) {
            state.isPopover = flag;
        },
        isMonitorOrTrack(state, flag) {
            state.isMonitorOrTrack = flag;
        },
        isToggleMonitorTree(state, flag){
            state.isToggleMonitorTree = flag;
        },
        historyTrackAllPoint(state, params) {
            state.allHistoryTrackPoint = params;
        },
        // 最佳视野
        isGetBaseView(state, params) {
            state.isGetBaseView = params;
        },
        playStart(state, params) {
            state.playStartFalg = params;
        },
        setTrackIndex(state, params) {
            state.trackIndex = params;
        },
        setSliderIndex(state, params) {
            state.sliderIndex = params;
        },
        setTrackSpeed(state,params){
            state.trackSpeed = params;
        },
        setTrakchanges(state,params){
            state.trakchanges = params;
        },
        // 获取加载好的树节点
        getAsyncNodes(state, params){
            state.getAsyncNodes = params;
        }
    },
    actions: {
        isLocalPassword({commit}, params){
            commit('isLocalPassword', params)
        },
        // 根据车牌或在离线状态获取车辆列表
        getVehicleListByPlate({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/monitor/getVehicleListByPlate',
                params: params
            })
        },
        // 添加车辆关注
        insertVehicleAttentionInfo({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/vehicle/insertVehicleAttentionInfo',
                params: params
            })
        },
         // 删除车辆关注
         deleteVehicleAttentionInfo({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/vehicle/deleteVehicleAttentionInfo',
                params: params
            })
        },
        // 根据车牌或在离线状态获取车辆关注列表
        findVehicleAttentionInfoList({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/vehicle/findVehicleAttentionInfoList',
                params: params
            })
        },
        // 添加车辆集合
        addVehicleList({ commit }, params) {
            commit('addVehicleList', params)
        },
        // 删除车辆集合
        removeVehicleList({ commit }, params) {
            commit('removeVehicleList', params)
        },
        // 清空所有车辆集合
        clearAllVehicleList({ commit }) {
            commit('clearAllVehicleList')
        },
        //清空搜索的checkbox中选中和删除id
        clearCheckId({ commit }) {
            commit('clearCheckId')
        },
        // 添加车辆位置marker
        addPoints({ commit }, params) {
            commit('addPoints', params)
        },
        // 添加车辆所有位置信息
        carPointsMess({ commit }, params) {
            commit('carPointsMess', params)
        },
        // 去除车辆位置
        removePoints({ commit }, id) {
            commit('removePoints', id)
        },
        // 清空所有车辆位置的marker和信息
        clearAllPoints({ commit }, params) {
            commit('clearAllPoints', params)
        },
        // 显示当前车辆信息
        carCurrent({ commit }, params) {
            commit('carCurrent', params)
        },
        // 去除当前车辆信息
        removeCarCurrent({ commit }) {
            commit('removeCarCurrent')
        },
        // 显示当前车辆弹框
        showPopover({ commit }, flag) {
            commit('showPopover', flag)
        },
        // 是否显示历史轨迹还是多车监控的按钮
        isMonitorOrTrack({ commit }, flag) {
            commit('isMonitorOrTrack', flag);
        },
        isToggleMonitorTree({commit}, flag){
            commit('isToggleMonitorTree', flag);
        },
        historyTrackAllPoint({ commit }, params) {
            commit('historyTrackAllPoint', params)
        },
        setTrackIndex({commit},params){
            commit('setTrackIndex',params)
        },
        setSliderIndex({commit},params){
            commit('setSliderIndex',params)
        },
        setTrackSpeed({commit},params){
            commit('setTrackSpeed',params)
        },
        // 编辑图表
        editEchart({ commit }, params = {}) {
            let model = {
                title: {
                    text: params.title || '--',
                    top: '8px',
                    left: '10px',
                    textStyle: { fontWeight: "normal", fontFamily: "微软雅黑", fontSize: "14", color: "#666" }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'line' // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter(val) {
                        let html = "时间：" + val[0].axisValue + '<br/>';
                        val.forEach(item => {
                            html += item.seriesName + ':' + filter.switchState(item.data) + '<br/>';
                        })
                        return html;
                    }
                },
                grid: {
                    left: '30px',
                    right: '40px',
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLabel: {
                        margin: 10,
                        formatter: function(value) {
                            if (value) {
                                return value.split(" ").join("\n");
                            } else {
                                return '';
                            }
                        },
                        align: 'left'
                    },
                    data: params.xAxis || [1, 2, 3, 4, 5]
                },
                legend: {
                    show: true,
                    itemWidth: 15,
                    top: '10px',
                    left: '60px',
                    data: params.legend || []
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: false
                    }
                },
                series: params.series
            };
            return new Promise((resolve, reject) => {
                resolve(model)
            })
        },
        // 是否最佳视野
        isGetBaseView({ commit }, params) {
            commit('isGetBaseView', params)
        },
        // 获取加载好的树节点
        getAsyncNodes({commit}, params){
            commit('getAsyncNodes', params);
        },
        //监控车辆树接口
        getEnterpriseVehicleTreeList({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/monitor/findVehicleTreeInfoList',
                params: params
            })
        },
        //车辆锁车状态接口
        queryStatus({ commit }, params) {
            return http({
                url: COMMON.baseUrl + 'lockCar/queryStatus',
                params: params
            })
        },
        // 根据车辆ID获取位置数据
        getMultiVehicleLastLocationList({ commit }, obj) {
            return http({
                url: COMMON.baseUrl + '/monitor/getMultiVehicleLastLocationList',
                data: JSON.stringify({
                    "vehicleIds": obj.ids, //ids
                    "mapType":obj.mapType
                })
            })
        },

        playStart({ commit }, params) {
            commit('playStart', params)
        },
        setTrakchanges({ commit }, params) {
            commit('setTrakchanges', params)
        },
    },
    getters: {
        addId(state) {
            return state.addId
        },
        removeId(state) {
            return state.removeId
        },
        carList(state){
            return state.carList
        },
        carPoints(state) {
            return state.carPoints;
        },
        carPointsMess(state) {
            return state.carPointsMess;
        },
        carPointsArray(state){
            return state.carPointsArray;
        },
        carCurrent(state) {
            return state.carCurrent
        },
        isPopover(state) {
            return state.isPopover;
        },
        isMonitorOrTrack(state) {
            return state.isMonitorOrTrack;
        },
        isToggleMonitorTree(state){
            return state.isToggleMonitorTree;
        },
        allHistoryPoint(state) {
            return state.allHistoryTrackPoint;
        },
        // 是否最佳视野参数
        isGetBaseView(state) {
            return state.isGetBaseView
        },
        getPlayStartFalg(state) {
            return state.playStartFalg;
        },
        getTrackIndex(state){
            return state.trackIndex;
        },
        getSiderIndex(state){
            return state.sliderIndex;
        },
        getTrackSpeed(state){
            return state.trackSpeed;
        },
        getTrakchanges(state){
            return state.trakchanges;
        },
        getAsyncNodes(state){
            return state.getAsyncNodes;
        }
    }
}