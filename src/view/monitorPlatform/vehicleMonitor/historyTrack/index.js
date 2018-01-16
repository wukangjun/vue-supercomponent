import { http, COMMON, service } from '@/utils'
import filter from '@/utils/filter'
export default {
    state: {
        //列表图表显隐标识
        isTogglePanelList:false,
        //总里程 
        mileageTotal: null,
        //总平均油耗
        averageOil: null,
        //总平均速度 
        averageSpeed: null,
        //总油耗
        oilTotal: null,
        //行程列表
        listST: [],
        //县城列表
        listCounty: [],
        //报警列表 
        alarmListMap: [],
        // 历史轨迹点
        trackLists: [],
        //所有的历史轨迹点
        allTrackPoints:[],
        // 能力项
        abillity: null,
        //历史轨迹树显隐
        isToggleHistoryTree: true,
        //历史轨迹路段面板显隐
        isToggleHistoryPanel: false,
        //can数据
        canData: null
    },
    mutations: {
        //总里程
        mileageTotal(state, params) {
            state.mileageTotal = params
        },
        //总平均油耗
        averageOil(state, params) {
            state.averageOil = params
        },
        //总平均速度
        averageSpeed(state, params) {
            state.averageSpeed = params
        },
        //总油耗
        oilTotal(state, params) {
            state.oilTotal = params
        },
        //行程列表
        listST(state, params) {
            state.listST = params
        },
        //县城列表
        listCounty(state, params) {
            state.listCounty = params
        },
        //报警列表
        alarmListMap(state, params) {
            state.alarmListMap = params
        },
        // 添加轨迹列表
        addTrackLists(state, params) {
            if (service.isArray(params)) {
                state.trackLists = params;
            } else {
                state.trackLists = []
            }
        },
        // 添加轨迹点
        addTrackPoints(state, params) {
            if (service.isArray(params)) {
                state.allTrackPoints = params;
            } else {
                state.allTrackPoints = []
            }
        },
        // 添加能力id
        addTrackAbillity(state, params) {
            let chartParams = { xAxis: null, series: null, legend: [] },
                time = [],
                liftingState = [], loadCondition = [], openCapState = [],
                obj = {}, series = [], abs = params.length !== 0 ? params.split(',') : [];
            if (state.trackLists.length > 0) {
                state.trackLists.forEach(ele => {
                    time.push(filter.format(ele.gpsTime, 'yyyy-MM-dd HH:mm:ss'))
                    liftingState.push(filter.liftingState(ele.liftingState))
                    loadCondition.push(filter.loadCondition(ele.loadCondition))
                    openCapState.push(filter.openCapState(ele.openCapState))
                });
                chartParams.xAxis = time;
                chartParams.series = series;
                abs.forEach(ele => {
                    switch (ele) {
                        case '2':
                            series.push(
                                { name: '承重状态', type: 'line', data: loadCondition, itemStyle: { normal: { color: '#0083e5' } } }
                            );
                            chartParams.legend.push({ name: '承重状态' })
                            break;
                        case '3':
                            series.push(
                                { name: '速度', type: 'line', data: [], itemStyle: { normal: { color: 'red' } } }
                            )
                            break;
                        case '4':
                            series.push(
                                { name: '顶盖开启', type: 'line', data: openCapState, itemStyle: { normal: { color: '#f9a000' } } }
                            )
                            chartParams.legend.push({ name: '顶盖开启' })
                            break;
                        case '5':
                            series.push(
                                { name: '车斗举升', type: 'line', data: liftingState, itemStyle: { normal: { color: '#01c302' } } }
                            )
                            chartParams.legend.push({ name: '车斗举升' })
                            break;
                    }
                })
                let model = {
                    title: {
                        text: chartParams.title || "",
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
                        top: '35px',
                        left: '30px',
                        right: '55px',
                        bottom: '40px'
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: true,
                        axisLabel: {
                            color:'#fff',
                            margin: 10,
                            formatter: function (value) {
                                if (value) {
                                    return value.split(" ").join("\n");
                                } else {
                                    return '';
                                }
                            },
                            align: 'left'
                        },
                        data: chartParams.xAxis || [1, 2, 3, 4, 5]
                    },
                    legend: {
                        show: true,
                        itemWidth: 15,
                        top: '5px',
                        right: '40px',
                        textStyle:{
                            color:"#fff"
                        },
                        data: chartParams.legend || []
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: false
                        },
                        splitLine: {
                            show:false,
                        },
                    },
                    series: chartParams.series
                };
                state.abillity = model;
            } else {
                state.abillity = null;
            }
        },
        //CAN数据
        addCanData(state, params) {
            let chartParams = { xAxis: null, series: null, legend: [] },
                series = [],
                time = [],
                dspeed = [],
                gpsSpeed = [],
                oilMass = [],
                accStatus = [];
            params.forEach(ele => {
                if(ele.gpsTime - 0){
                    time.push(filter.format(ele.gpsTime, 'yyyy-MM-dd HH:mm:ss'))
                }else{
                    time.push(ele.gpsTime)
                }
                dspeed.push(ele.dspeed)
                gpsSpeed.push(ele.gpsSpeed)
                oilMass.push(ele.oilMass)
                ele.accStatus && accStatus.push(ele.accStatus)
                ele.accState && accStatus.push(ele.accState)
            });
            chartParams.xAxis = time;
            series.push(
                { name: '行驶速度', type: 'line', data: dspeed, itemStyle: { normal: { color: 'rgba(109,147,253,1)' } },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(109,147,253,1)'
                        }, {
                            offset: 1,
                            color: 'rgba(109,147,253,0)'
                        }])
                    }
                } }
            );
            chartParams.legend.push({ name: '行驶速度' })
            series.push(
                { name: 'GPS速度', type: 'line', data: gpsSpeed, itemStyle: { normal: { color: 'rgba(73,239,186,1)' } }, 
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(73,239,186,1)'
                        }, {
                            offset: 1,
                            color: 'rgba(73,239,186,0)'
                        }])
                    }
                }}
            );
            chartParams.legend.push({ name: 'GPS速度' })
            series.push(
                { name: '油耗', type: 'line', data: oilMass, itemStyle: { normal: { color: '#f9a000' } } }
            );
            chartParams.legend.push({ name: '油耗' })
            series.push(
                { name: 'ACC开关', type: 'line', data: accStatus, itemStyle: { normal: { color: '#01c302' } } }
            );
            chartParams.legend.push({ name: 'ACC开关' })
            chartParams.series = series;
            let model = {
                title: {
                    text: chartParams.title || "",
                    top: '8px',
                    left: '10px',
                    textStyle: { fontWeight: "normal", fontFamily: "微软雅黑", fontSize: "14", color: "#666" }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'line' // 默认为直线，可选为：'line' | 'shadow'
                    },
                    confine: true,
                    formatter(val) {
                        let html = "时间：" + val[0].axisValue + '<br/>';
                        val.forEach(item => {
                            html += item.seriesName + ':' + filter.canDataReturn(item)+ '<br/>';
                        })
                        return html;
                    }
                },
                grid: {
                    top: '35px',
                    left: '30px',
                    right: '55px',
                    bottom: '40px'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    axisLabel: {
                        color:'#fff',
                        margin: 10,
                        formatter: function (value) {
                            if (value) {
                                return value.split(" ").join("\n");
                            } else {
                                return '';
                            }
                        },
                        align: 'left'
                    },
                    data: chartParams.xAxis || [1, 2, 3, 4, 5]
                },
                legend: {
                    show: true,
                    itemWidth: 15,
                    zlevel:10,
                    top: '5px',
                    right: '40px',
                    textStyle:{
                        color:"#fff"
                    },
                    data: chartParams.legend || []
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: false
                    },
                    splitLine: {
                        show:false,
                    },
                },
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100,
                        borderColor:'rgba(0,0,0,0)',
                        textStyle:{
                            color:'rgba(0,0,0,0)'
                        }
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 30,
                        end: 70,
                    }
                ],
                series: chartParams.series
            };
            state.canData = model;
        },
        //历史轨迹树显隐
        isToggleHistoryTree(state, params) {
            state.isToggleHistoryTree = params
        },
        //历史轨迹路段面板显隐
        isToggleHistoryPanel(state, params) {
            state.isToggleHistoryPanel = params
        },
        //历史轨迹列表图表面板显隐
        isTogglePanelList(state,params){
            state.isTogglePanelList = params
        }

    },
    actions: {
        //轨迹查询--type: 'json'
        getVehicleTrackByBigData({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/vtrack/findDailyMileage.do',
                responseType: 'arraybuffer',
                params: params
            })
            // if(service.isIe()){
            //     return http({
            //         url: COMMON.baseUrl + '/vtrack/findDailyMileage.do',
            //         params: params
            //     })
            // }else{
            //     return http({
            //         url: COMMON.baseUrl + '/vtrack/findDailyMileage.do',
            //         responseType: 'arraybuffer',
            //         params: params
            //     })
            // }
        },
        //轨迹CAN信息查询
        queryVehicleCan({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/vtrack/queryVehicleCan',
                responseType: 'arraybuffer',
                params: params
            })
        },
        //总里程
        setMileageTotal({ commit }, params) {
            commit('mileageTotal', params)
        },
        //总平均油耗
        setAverageOil({ commit }, params) {
            commit('averageOil', params)
        },
        //总平均速度
        setAverageSpeed({ commit }, params) {
            commit('averageSpeed', params)
        },
        //总油耗
        setOilTotal({ commit }, params) {
            commit('oilTotal', params)
        },
        //行程列表
        setListST({ commit }, params) {
            commit('listST', params)
        },
        //县城列表
        setListCounty({ commit }, params) {
            commit('listCounty', params)
        },
        //报警列表
        setAlarmListMap({ commit }, params) {
            commit('alarmListMap', params)
        },
        // 添加轨迹点
        addTrackLists({ commit }, params) {
            commit('addTrackLists', params)
        },
        addTrackPoints({ commit }, params) {
            commit('addTrackPoints', params)
        },
        //能力项id
        addTrackAbillity({ commit }, params) {
            commit('addTrackAbillity', params)
        },
        //can数据
        addCanData({ commit }, params) {
            commit('addCanData', params)
        },
        //历史轨迹树显隐
        isToggleHistoryTree({ commit }, params) {
            commit('isToggleHistoryTree', params)
        },
        //历史轨迹路段面板显隐
        isToggleHistoryPanel({ commit }, params) {
            commit('isToggleHistoryPanel', params)
        },
        //历史轨迹列表图表面板显隐
        isTogglePanelList({commit},params){
            commit('isTogglePanelList',params)
        }
    },
    getters: {
        //总里程
        mileageTotal(state) {
            return state.mileageTotal
        },
        //总平均油耗
        averageOil(state) {
            return state.averageOil
        },
        //总平均速度
        averageSpeed(state) {
            return state.averageSpeed
        },
        //总油耗
        oilTotal(state) {
            return state.oilTotal
        },
        //行程列表
        listST(state) {
            return state.listST
        },
        //县城列表
        listCounty(state) {
            return state.listCounty
        },
        //报警列表
        alarmListMap(state) {
            return state.alarmListMap
        },
        //历史轨迹
        trackLists(state) {
            return state.trackLists
        },
        //历史轨迹
        allTrackPoints(state) {
            return state.allTrackPoints
        },
        //能力项id
        abillity(state) {
            return state.abillity
        },
        //CAN数据
        canData(state) {
            return state.canData
        },
        //历史轨迹树显隐
        isToggleHistoryTree(state) {
            return state.isToggleHistoryTree
        },
        //历史轨迹路段面板显隐
        isToggleHistoryPanel(state) {
            return state.isToggleHistoryPanel
        },
        //历史轨迹列表图表面板显隐
        isTogglePanelList(state){
            return state.isTogglePanelList
        }
    }
}