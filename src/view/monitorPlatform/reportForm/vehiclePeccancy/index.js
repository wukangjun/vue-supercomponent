/**
 * author:张婵玉
 * time:2017/10
 */

export default {
    methods: {
        queryCompanyAlarm(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/alarmInfo/vehiclePeccancyStatistics',
                params: params,
                // method:'GET',
            });
        },
        queryGoupAlarm(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/alarmInfo/groupPeccancyStatistics',
                params: params,
                // method:'GET',
            });
        },
     
    }
}