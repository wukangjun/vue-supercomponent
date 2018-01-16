export default{
    methods:{
        findAreaDelimitedQueryLocationListInfo(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/monitor/findAreaDelimitedQueryLocationListInfo",
               params:params
            })
        },
        
    }
}