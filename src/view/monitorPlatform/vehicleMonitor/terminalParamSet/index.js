export default{
	methods:{
        // 查询终端参数
        terminalquery(id){
            return this.$http({
               url:this.$COMMON.baseUrl + "/terminalParam/query",
               method:'GET',
               params: {
                    vehicleId: id
               }
            })
        },
        //下发查询终端参数指令
        terminalupload(id){
            return this.$http({
               url:this.$COMMON.baseUrl + "/terminalParam/upload",
               params: {
                   vehicleId: id
               }
            })
        },
        //追踪sendflag
        trackSendFlag(id){
            return this.$http({
               url:this.$COMMON.baseUrl + "/orderinfo/queryfendflagvalue",
               params: {
                   id: id
               }
            })
        },
        //更新服务器参数
        update(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/terminalParam/update",
               data: JSON.stringify(params)
            })
        },
        //查询实时参数
        queryTerminalParams(id){
            return this.$http({
               url:this.$COMMON.baseUrl + "/terminalParam/queryTerminalParams",
               params: {
                   id: id
               }
            })
        },
        //设置终端参数
        set(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/terminalParam/set",
               params:params
            })
        }        
    }
}