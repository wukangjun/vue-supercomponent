
export default {
    methods: {
        getEventinfoLogPage(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/log/getEventinfoLogPage',
                params: params,
                // method:'POST',
            });
        },
     
    }
}