export default{
    methods:{
        //聚合
        findSpeedingPointsCountInfo(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/report/findSpeedingPointsCountInfo",
               params:params
            })
        },
        
        //超速点详情
        findSpeedingPointsListInfo(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/report/findSpeedingPointsListInfo",
               params:params
            })
        },
        //轨迹详情
        findVehicleSpeedDetailListInfo(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/report/findVehicleSpeedDetailListInfo",
               params:params
            })
        }
    }
}