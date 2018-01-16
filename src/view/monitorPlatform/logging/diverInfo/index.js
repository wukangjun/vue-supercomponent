
export default {
    methods: {
        getDriver(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/log/getDriverCheckLogPage',
                params: params,
                // method:'GET',
            });
        },
     
    }
}