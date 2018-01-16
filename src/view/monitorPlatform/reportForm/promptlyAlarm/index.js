
export default {
    methods: {
        queryCompanyAlarm(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/alarmInfo/vehicleAlarmHandle',
                params: params,
                // method:'GET',
            });
        },
        queryGoupAlarm(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/alarmInfo/vehicleAlarmHandleInfo',
                params: params,
                // method:'GET',
            });
        },
     
    }
}