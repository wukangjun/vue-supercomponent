export default {
    methods: {
        // 查询报警表格接口
        findVehicleBasicsInfo(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/report/findVehicleBasicsInfo',
                params: params
            })
        }
    }
}