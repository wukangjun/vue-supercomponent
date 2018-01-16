import {http, COMMON} from '@/utils'
export default{
	methods: {
		// 查询能力项列表接口
         findTerminalProtocolList(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminalProtocol/findTerminalProtocolList',
                params: params
            });
        },
        //新增，接口
       insertTerminalProtocol(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminalProtocol/insertTerminalProtocol',
                params: params
            });
        },
        
        //修改接口
         updateTerminalProtocol(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminalProtocol/updateTerminalProtocol',
                params: params
            });
        },
        //删除接口
        deleteTerminalProtocolById(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminalProtocol/deleteTerminalProtocolById',
                params: params
            });
        },
        //验证姓名是否重复
         isExistTerminalProtocol(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminalProtocol/isExistTerminalProtocol',
                params: params
            });
        },
    
        //根据协议id查询未绑定的能力项
        findUnBindAbilityList(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminalProtocol/findUnBindAbilityList',
                params: params
            });
        },
        //根据协议id查询已绑定的能力项
        findBindedAbilityList(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminalProtocol/findBindedAbilityList',
                params: params
            });
        },
        //添加协议与能力项的绑定关系
        insertProtocolAndAbility(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminalProtocol/insertProtocolAndAbility',
                params: params
            });
        },
        //删除协议与能力项的绑定关系
        deleteProtocolAndAbility(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminalProtocol/deleteProtocolAndAbility',
                params: params
            });
        },
        findTerminalAbilityList(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminalAbility/findTerminalAbilityList',
                params: params
            });
        },




	}
}