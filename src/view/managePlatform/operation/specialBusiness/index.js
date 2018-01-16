import { http, COMMON } from '@/utils'
export default {
    actions: {
        // 查询车辆表格列表接口
        findVehiclePage({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/vehicle/findVehiclePage',
                params: params
            })
        },
        // 修改公司
        modifyEnterprise({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/specialBiz/modifyEnterprise',
                data: params
            })
        },
        // 删除单条数据
        deleteVehicle({ commit }, id) {
            return http({
                url: COMMON.baseUrl + '/vehicle/deleteVehicle',
                params: {
                    id: id
                }
            })
        },
        //根据公司id设备数据查询
        findUnbindTerminalList({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/terminal/findUnbindTerminalList',
                params: params
            })
        },

        //根据公司id司机数据查询
        findDriverList({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/driver/findDriverList',
                params: params
            })
        },

        //设备添加更新数据
        insertTerminal({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/terminal/insertTerminal',
                params: params
            })
        },
        //获取Can版本数据
        getCanCfgVersionList() {
            return http({
                url: COMMON.baseUrl + '/canCfgVersion/findCanCfgVersionList'
            });
        },
        //获取终端版本数据
        getProtocolVersionList() {
            return http({
                url: COMMON.baseUrl + '/terminalProtocol/findTerminalProtocolList'
            });
        },
        //根据企业ID查询当前制造商
        findManufacturerList({ commit }) {
            return http({
                url: COMMON.baseUrl + '/tmanuf/findTerminalManufacturerList'
            });
        },
        //根据制造商ID查终端编号和型号
        findModelList({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/terminalModel/findTerminalModelList',
                params: params
            });
        },

        //公司树接口
        getEnterpriseTreeList() {
            return COMMON.baseUrl + '/enterprise/getEnterpriseTreeList';
        },
        //查询手机号是否重复
        isExistTerminalMobile({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/terminal/isExistTerminalMobile',
                params: params
            });
        },
        //查询相同制造商终端编号是否重复
        isExistTerminalCode({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/terminal/isExistTerminalCode',
                params: params
            });
        },
        //验证车牌号是否存在
        isExistPlateCode({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/vehicle/isExistPlateCode',
                params: params
            })
        },

        //修改单条车辆数据
        updateVehicle({ commit }, params) {
            return http({
                url: COMMON.baseUrl + '/vehicle/updateVehicle',
                data: params
            })
        },

        //根据车辆id查车辆数据
        getVehicleById({ commit }, id) {
            return http({
                url: COMMON.baseUrl + '/vehicle/getVehicleById',
                params: {
                    id: id
                }
            })
        },
        //车辆下线
        logoutVehicle({commit},id){
            return http({
                url: COMMON.baseUrl + '/vehicle/logoutVehicle',
                params: {
                    vehicleId: id
                }
            })
        },
        //根据企业ID,查询车辆品牌,车厂
        getFindBrand({ commit }, param) {
            return http({
                url: COMMON.baseUrl + '/vbrand/findBrand',
                params: param
            })
        },
        //根据品牌ID,查询型号
        getFindModel({ commit }, param) {
            return http({
                url: COMMON.baseUrl + '/vmodel/findModel',
                params: param
            })
        },
        //导出
        exportCarExl({ commit }, param) {
            return http({
                url: COMMON.baseUrl + '/vehicle/exportCarExcel',
                params: param
            })
        },
        //启用，停用车辆
        updateVehicleUserStatus({ commit }, param) {
            return http({
                url: COMMON.baseUrl + '/vehicle/updateVehicleUserStatus',
                params: param
            })
        },
        //替换设备
        replaceTerminal({ commit }, param) {
            return http({
                url: COMMON.baseUrl + '/vehicle/replaceTerminal',
                params: param
            })
        },
        //解绑设备
        unBindTerminal({ commit }, param) {
            return http({
                url: COMMON.baseUrl + '/vehicle/unBindTerminal',
                params: param
            })
        },
        //设备分页查询
        findTerminalPage({ commit }, param) {
            return http({
                url: COMMON.baseUrl + '/terminal/findUnbindTerminalPage',
                params: param
            })
        },


    }
}