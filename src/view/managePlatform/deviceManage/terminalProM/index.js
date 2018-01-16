export default{
    methods:{
        //设备厂商分页查询
        findTerminalManufacturerPage(params){
            return this.$http({
                url:this.$COMMON.baseUrl + "/tmanuf/findTerminalManufacturerPage",
                params:params
            })
        },
        //添加设备厂商
        insertTerminalManufacturer(params){
            return this.$http({
                url:this.$COMMON.baseUrl + "/tmanuf/insertTerminalManufacturer",
                params:params
            })
        },
        //删除设备厂商
        deleteTerminalManufacturer(params){
            return this.$http({
                url:this.$COMMON.baseUrl + "/tmanuf/deleteTerminalManufacturer",
                params:params,
                method:"GET"
            })
        },
        //更新终端厂商接口
        updateTerminalManufacturer(params){
            return this.$http({
                url:this.$COMMON.baseUrl + "/tmanuf/updateTerminalManufacturer",
                params:params,
                method:"GET"
            })
        },
        //根据厂商id查询明细
        getTerminalManufacturerById(params){
            return this.$http({
                url:this.$COMMON.baseUrl + "/tmanuf/getTerminalManufacturerById",
                params:params,
                method:"GET"
            })
        },
        //验证厂商名称重复
        isExistTerminalManufacturerName(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/tmanuf/isExistTerminalManufacturerName",
               params:params,
               method:'GET'
            })
        },
        
    }
}
