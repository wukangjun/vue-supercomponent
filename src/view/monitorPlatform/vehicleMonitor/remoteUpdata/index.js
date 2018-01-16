/**
 * author:张婵玉
 * time:2017/12
 * effect:终端远程升级
 */

export default {
    methods: {
        //查询终端列表
        queryList(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/upgradeLog/queryUpgradeLogInfo',
                params: params
            });
        },
        //终端信息初始化
        queryTerminalParam(params){
            return this.$http({
                url: this.$COMMON.baseUrl + '/upgradeLog/queryTerminalParam',
                params: params
            });
        },
       
        //新增升级
        insertUpgradeOrderInfo( params){
			return this.$http({
				url:this.$COMMON.baseUrl +'/upgradeLog/insertUpgradeOrderInfo',
				params: params
			})
        },
        viewUpta( params){
			return this.$http({
				url:this.$COMMON.baseUrl +'/upgradeLog/insertUploadBinFileInfo',
				params: params
			})
		}
      
    }
}