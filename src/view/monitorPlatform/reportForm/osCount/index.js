export default{
    methods:{
        findSpeedInfoList(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/alarmInfo/findSpeedInfoList",
               params:params
            })
        },
        findSpeedDetailsListInfo(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/alarmInfo/findSpeedDetailsListInfo",
               params:params
            })
        }
    }
}