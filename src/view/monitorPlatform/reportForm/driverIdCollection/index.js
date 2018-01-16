export default{
    methods:{
        //采集记录
        collectDriverRecord(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/driverRecord/collectDriverRecord",
               params:params
            })
        },
        //详细信息
        collectGBDriverRecord(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/driverRecord/collectGBDriverRecord",
               params:params
            })
        },
        
    }
}