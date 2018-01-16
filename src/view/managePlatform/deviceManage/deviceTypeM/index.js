export default{
	methods:{
        //设备型号分页查询
        findTerminalModelPage(params){
            return this.$http({
                url:this.$COMMON.baseUrl + "/terminalModel/findTerminalModelPage",
                params:params
            })
        },
        //保存设备型号
        insertTerminalModel(params){
            return this.$http({
                url:this.$COMMON.baseUrl + "/terminalModel/insertTerminalModel",
                params:params
            })
        },
        //修改设备型号
        updateTerminalModel(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/terminalModel/updateTerminalModel",
               params:params
            })
        }, 
        //根据id删除设备型号
        deleteTerminalModelById(params){
            return this.$http({
                url:this.$COMMON.baseUrl + "/terminalModel/deleteTerminalModelById",
                params:params
            })
        },
        //根据企业id查询当前的终端制造商的列表 ，返回id和制造商的名称
        findTerminalManufacturerList(params){
            return this.$http({
                url:this.$COMMON.baseUrl + "/tmanuf/findTerminalManufacturerList",
                params:params
            })
        },
        //设备型号重复查询 
        isExistTerminalModel(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/terminalModel/isExistTerminalModel",
               params:params
            })
        },
        
    }
}