/**
 * author:张婵玉
 * time:2017/10
 */

export default {
    methods: {
        queryTime(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/travelSpeed/queryMinuteData',
                params: params
            });
        },
        queryInfo(params){
            return this.$http({
                url:this.$COMMON.baseUrl + '/travelSpeed/querySpeedDateDetail',
                params:params
            })
        }
    }
}