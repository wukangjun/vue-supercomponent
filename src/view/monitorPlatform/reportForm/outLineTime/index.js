export default {
    methods: {
        findVehicleOfflineOverTime(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/vehicle/findVehicleOfflineOverTime.do',
                params: params
            })
        }
    }
}