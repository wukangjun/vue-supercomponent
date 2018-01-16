export default {
    methods: {
        // 查询行驶里程接口
        findMieageByDate(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/report/findMieageByDate',
                params: params
            })
        },
        // 查询单日行驶里程信息接口
        findMieageByDateDetail(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/report/findMieageByDateDetail',
                params: params
            })
        }
    }
}