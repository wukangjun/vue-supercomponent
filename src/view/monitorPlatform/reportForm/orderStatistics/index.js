export default {
    methods: {
          // 信息接口
          pageorderinfo(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/orderinfo/pageorderinfo',
                params: params
            })
        },
      
        
    }
}