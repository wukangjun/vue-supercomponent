export default{
    methods:{
        //采集记录
        collectExternalPower(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/externalPower/collectExternalPower",
               params:params
            })
        },
        //详细信息
        collectGBExternalPower(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/externalPower/collectGBExternalPower",
               params:params
            })
        },
    }
}