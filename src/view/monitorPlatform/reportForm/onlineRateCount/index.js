export default{
    methods:{
        //上下线统计
        findVehicleOnOffRateInfoList(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/report/findVehicleOnOffRateInfoList",
               params:params
            })
        },
        //车辆不在线统计
        findVehicleNolineInfoList(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/report/findVehicleNolineInfoList",
               params:params
            })
        },
        //公司在线率
        findEnterpriseOnLineRate(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/report/findEnterpriseOnLineRate",
               params:params
            })
        },
        //公司在线率详细
        findEnterpriseDetailsOnLineRate(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/report/findEnterpriseDetailsOnLineRate",
               params:params
            })
        },
        //分组在线率
        findFleetOnLineRate(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/report/findFleetOnLineRate",
               params:params
            })
        },
        //分组在线率详细
        findFleetDetailsOnLineRate(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/report/findFleetDetailsOnLineRate",
               params:params
            })
        },
        
    }
}