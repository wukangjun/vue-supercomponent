export default {
    methods: {
        // 驾驶员数据接口
        queryDRDriverLog(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/driverRecordOld/queryDRDriverLog',
                params: params
            })
        },
        // 实时时钟接口
        queryDRGetTimeLog(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/driverRecordOld/queryDRGetTimeLog',
                params: params
            })
        }
    }
}