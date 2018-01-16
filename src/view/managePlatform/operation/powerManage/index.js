import {http, COMMON} from '@/utils'
export default{
	methods: {
		// 查询能力项列表接口
         findTerminalAbilityList(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminalAbility/findTerminalAbilityList',
                params: params
            });
        },
        //新增，修改接口
        insertTerminalAbility(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminalAbility/insertTerminalAbility',
                params: params
            });
        },
      
          //删除接口
        deleteAbilityById(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminalAbility/deleteTerminalAbilityById',
                params: params
            });
        },
        //验证姓名是否重复
         isExistAbilityName(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/terminalAbility/isExistAbilityName',
                params: params
            });
        },


	}
}