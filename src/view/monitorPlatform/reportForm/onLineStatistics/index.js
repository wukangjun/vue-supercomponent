export default {
    methods: {
        findSingleVehicleOnLineRate(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/report/findSingleVehicleOnLineRate',
                params: params
            })
        }
    }
}