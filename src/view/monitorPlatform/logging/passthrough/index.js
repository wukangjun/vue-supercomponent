
export default {
    methods: {
        getTransparentin(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/log/getTransparentinfoReceivelogPage',
                params: params,
                method:'POST',
            });
        },
     
    }
}