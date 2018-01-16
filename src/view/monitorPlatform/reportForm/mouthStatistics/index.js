export default {
    methods: {
        onMouthByDate(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/vehicle/queryMileageReport',
                params: params
            })
        }
    }
}