
export default {
    methods: {
        getDownMessagePage(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/log/getDownMessagePage',
                params: params,
                method:'POST',
            });
        },
     
    }
}