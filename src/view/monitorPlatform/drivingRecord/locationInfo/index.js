/**
 * author:张婵玉
 * time:2017/10
 */

export default {
    methods: {
        queryTime(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/locationRecord/queryHourData',
                params: params
            });
        },
        queryInfo(params){
            return this.$http({
                url:this.$COMMON.baseUrl + '/locationRecord/queryHourDataDetail',
                params:params
            })
        },
        queryTrack(params){
            return this.$http({
                url:this.$COMMON.baseUrl + '/locationRecord/queryVehicleTrack',
                params:params
            })
        },
        queryPointLocation(params){
            return this.$http({
                url:this.$COMMON.baseUrl + '/report/findDrivingDataInfo',
                params:params
            })
        }
    }
}