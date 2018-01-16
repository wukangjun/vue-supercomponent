export default{
    methods:{
        //列表查询接口
        findProtocolTransferGroupPageInfo (params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/transfer/findProtocolTransferGroupPageInfo",
               params:params
            })
        },
        //新增协议
        insertProtocolTransferGroupInfo(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/transfer/insertProtocolTransferGroupInfo",
               params:params
            })
        },
        //修改协议
        updateProtocolTransferGroupInfo(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/transfer/updateProtocolTransferGroupInfo",
               params:params
            })
        },
        
        //删除
        deleteProtocolTransferGroupInfo(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/transfer/deleteProtocolTransferGroupInfo",
               params:params
            })
        },
        //车辆绑定上级平台
        insertVehicleAttachPlatBeanListInfo(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/transfer/insertVehicleAttachPlatBeanListInfo",
               params:params
            })
        },
        //查询当前平台未绑定的服务
        findEznServiceInfoPageInfo(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/transfer/findEznServiceInfoPageInfo",
               params:params
            })
        },
        //809服务列表
        findEznServicePage(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/serviceManagement/findEznServicePage",
               params:params
            })
        },
        //查找绑定车辆
        findVehiclePlatInfoList(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/transfer/findVehiclePlatInfoList",
               params:params
            })
        },
        //删除绑定车辆
        delProtocolTransferVehicleInfo(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/transfer/delProtocolTransferVehicleInfo",
               params:params
            })
        },
        
    }
}