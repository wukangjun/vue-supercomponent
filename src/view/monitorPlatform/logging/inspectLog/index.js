export default{
    methods:{
        //采集记录
        getDownPlatformMsgInfoPage(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/inspectionlog/getDownPlatformMsgInfoPage",
               params:params
            })
        }
    }
}