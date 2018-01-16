export default{
    methods:{
        fatigueStatistics(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/driver/fatigueStatistics",
               params:params
            })
        },
        
    }
}