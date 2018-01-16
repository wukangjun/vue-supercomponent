/**
 * author:张婵玉
 * time:2017/7
 * effect:设备管理功能的相关接口请求
 */

export default {
    methods: {
        //公司树接口
        getEnterpriseTreeList() {
            return this.$COMMON.baseUrl + '/enterprise/getEnterpriseTreeList';
        },
        //获取设备列表
        queryTerminalMsg(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminal/findTerminalPage',
                params: params
            });
        },
        //新增，修改设备
        setUpTerminal(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminal/insertTerminal',
                params: params
            });
        },
        //根据ID查设备信息
        getTerminalById(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminal/getTerminalById',
                params: params
            });
        },
        //查询手机号是否存在
        isExistTerminalMobile(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminal/isExistTerminalMobile',
                params: params
            });
        },
        //删除设备记录
        deleteTerminalById(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminal/deleteTerminalById',
                params: params
            });
        },
        //获取Can版本数据
        getCanCfgVersionList() {
            return this.$http({
                url: this.$COMMON.baseUrl + '/canCfgVersion/findCanCfgVersionList'
            });
        },
        //获取终端版本数据
        getProtocolVersionList() {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminalProtocol/findTerminalProtocolList'
            });
        },
        //根据企业ID查询当前制造商
        getTerminalManufacturerList() {
            return this.$http({
                url: this.$COMMON.baseUrl + '/tmanuf/findTerminalManufacturerList'
            });
        },
        //根据制造商ID查制造商编号和型号
        findTerminalModelList(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminalModel/findTerminalModelList',
                params: params
            });
        },
        //验证相同制造商终端编号是否重复
        isExistTerminalCode(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminal/isExistTerminalCode',
                params: params
            });
        },
        //设备注销
        logoutTerminal(id){
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminal/logoutTerminal',
                params: {
                    vehicleId:id
                }
            });
        }
    }
}