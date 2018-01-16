<template>
   <div class="deviceType">
   <el-row class="">
        <el-col :span="24">
            <!-- 新增/修改表单内容  -->
            <el-form 
            :model="formData" 
            label-position="right" 
            label-width="100px" 
            :inline="true"
            :rules="rules"
            ref="formItem">
                <el-form-item :label="$t('deviceManage.selectMaker')" prop="manufacturerId">
                    <el-select v-model="formData.manufacturerId" clearable :placeholder="$t('deviceManage.ph')">
                        <el-option v-for='item in manufacturerList' :label='item.name' :value='item.id+""' :key="item.id+''"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceManage.deviceType')" prop="model">
                    <el-input v-model.trim="formData.model" :maxlength='15'></el-input>
                </el-form-item>
                <el-form-item :label="$t('deviceManage.makerNum')" prop="manufacturerNumber">
                    <el-input v-model.trim="formData.manufacturerNumber" :maxlength='5'></el-input>
                </el-form-item>
                <el-form-item :label="$t('terminalProM.remark')" prop="remark">
                    <el-input v-model.trim="formData.remark" :maxlength='50'></el-input>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 弹框按钮组 -->
        <el-col :span="24" class="dialog-footer" style="text-align:center">
			<el-button @click="save" :loading="loadFlag" type="primary">{{$t('action.save')}}</el-button>
			<el-button @click="resetForm">{{$t('action.reset')}}</el-button>
		</el-col>
   </el-row>
   </div>
</template>

<script>
    import ports from './index.js'
    export default {
        props:{
            options:{}
        },
        data() {
            return {
                loadFlag:false,
                manufacturerList:[],//制造商选择下拉框数据
                formData:{
                    id:'',
                    manufacturerId:'',
                    model:'',
                    manufacturerNumber:'',
                    remark:''
                },
                rules:{
                    manufacturerId:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'}
                    ],
                    model:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                        {pattern:/^[A-Z|0-9|a-z]+$/,message:this.$t("deviceManage.rule1")},
                        {min:0,max:15,message:this.$t("deviceManage.rule2")},
                    ],
                    manufacturerNumber:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                        {pattern:/^([1-9]\d*|0)(\.\d*[1-9])?$/,message:this.$t("deviceManage.rule3")},
                        {min:5,max:5,message:this.$t("deviceManage.rule4")},
                    ]
                }
            }
        },
        mixins:[ports],
        methods:{
            //重置表单
            resetForm(){
               this.$refs['formItem'].resetFields();
            },
            //保存按钮
            save(){
                //表单内容验证
                 this.$refs['formItem'].validate(valid =>{
                     if(valid){
                        let params = {
                                manufacturerId:this.formData.manufacturerId,
                                model:this.formData.model,
                                manufacturerNumber:this.formData.manufacturerNumber,
                                remark:this.formData.remark
                        }
                        //是否为修改
                        if(this.options.isModify){
                            params.id = this.options.rowInfo.id
                            this.loadFlag = true;
                            this.updateTerminalModel(params).then(data=>{
                                // console.log(data)
                                if(data.flag){
                                    this.$message.success(this.$t('action.updateSuccess'))
                                    this.loadFlag = false
                                    this.options.flag = false;
                                    this.$emit('confirm')
                                }else{
                                    this.$message.error(this.$t("error." + data.errorCode))
                                    this.loadFlag = false
                                }
                            }).catch(_=>{
                                    this.loadFlag = false
                            })
                        }else{
                             this.loadFlag = true;
                             this.insertTerminalModel(params).then(data=>{
                                // console.log(data)
                                if(data.flag){
                                    this.$message.success(this.$t('action.addSuccess'))
                                    this.loadFlag = false
                                    this.options.flag = false;
                                    this.$emit('confirm')
                                }else{
                                    this.$message.error(this.$t("error." + data.errorCode))
                                    this.loadFlag = false
                                }
                            }).catch(_=>{
                                this.loadFlag = false
                            })
                        }
                        
                     }else{
                        return false
                     }
                 })
            },
            //获取制造商下拉列表数据
            getList(){
                let params = {}
                this.findTerminalManufacturerList().then(data=>{
                    if(data.flag){
                        this.manufacturerList = data.data
                    }
                })
            }   
        },
        //弹框内容置空
        watch:{
            'options.flag'(newVal){
                if(!newVal){
                    this.options.name = ''
                }
            }
        },
        mounted(){
            this.getList();
             if(this.options.isModify){
                let params = {
                    id:this.options.rowInfo.id
                }
                    this.formData.manufacturerId = this.options.rowInfo.manufacturerId+'';
                    this.formData.model = this.options.rowInfo.model+'';
                    this.formData.manufacturerNumber = this.options.rowInfo.manufacturerNumber+'';
                    this.formData.remark = this.options.rowInfo.remark;
                }
        }
        
    }
</script>

<style scoped lang="scss">
    .deviceType{
        .el-select,
        .el-input{
            width: 240px;
        }
    }
</style>