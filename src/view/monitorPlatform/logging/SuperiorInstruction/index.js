
export default {
    methods: {
        getMonConnlogPage(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/log/getMonConnlogPage',
                params: params,
                method:'POST',
            });
        },
     
    }
}