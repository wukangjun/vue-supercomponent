<template>
   <el-row class="terminalContainer">
        <el-col :span="24">
            <!-- 新增/修改表单内容  -->
            <el-form 
            :model="formData" 
            label-position="right" 
            label-width="70px" 
            :inline="true"
            :rules="rules"
            ref="formItem">
                <el-form-item :label="$t('terminalProM.name')" prop="name">
                    <el-input v-model.trim="formData.name" :maxlength='15'></el-input>
                </el-form-item>
                <el-form-item :label="$t('terminalProM.contactsPerson')" prop="manufacturerContacts">
                    <el-input v-model.trim="formData.manufacturerContacts" :maxlength='20'></el-input>
                </el-form-item>
                <el-form-item :label="$t('terminalProM.phoneNumber')" prop="manufacturerTel">
                    <el-input v-model.trim="formData.manufacturerTel" :maxlength='11'></el-input>
                </el-form-item>
                <el-form-item :label="$t('terminalProM.remark')" prop="remark">
                    <el-input v-model.trim="formData.remark" :maxlength='50'></el-input>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 弹框按钮组 -->
        <el-col :span="24" class="dialog-footer" style="text-align:center">
			<el-button :loading="loadFlag" @click="save" type="primary">{{$t('action.save')}}</el-button>
			<el-button :disabled="isDisabled" @click="resetForm">{{$t('action.reset')}}</el-button>
		</el-col>
   </el-row>
</template>
<script>
import port from './index.js'
export default {
  props:{
      options:{}
  },
  mixins:[port],
  data(){
      return {
          isDisabled:false,
          loadFlag:false,
          formData:{
            name:'',
            manufacturerContacts:'',
            manufacturerTel:'',
            remark:''
          },
          rules:{
              name:[
                  {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                  {validator:this.isSame, trigger: 'blur' }
              ],
              manufacturerTel:[
                  {pattern:/^1[34578][0-9]{9}$/,message:this.$t('terminalProM.typeCorrectNum'),trigger:'blur,change'}
              ]
          }
      }
  },
  methods:{
      //保存
      save(){
          this.$refs['formItem'].validate(valid => {
              //表单验证
              if(valid){
                  this.loadFlag = true;
                  let params = {
                        manufacturerContacts:this.formData.manufacturerContacts,
                        name:this.formData.name,
                        manufacturerTel:this.formData.manufacturerTel,
                        remark:this.formData.remark
                    }
                    //是否为编辑状态
                  if(this.options.isModify){
                    params.id = this.options.rowInfo.id
                    this.updateTerminalManufacturer(params).then(data=>{
                        if(data.flag){
                            this.$message.success(this.$t('action.updateSuccess'))   
                            this.$emit('confirm');
                            this.options.flag = false;
                        }else{
                            this.$message.error(this.$t("error." + data.errorCode))
                        }
                        this.loadFlag = false;  
                    }).catch(_=>{
                        this.loadFlag = false;            
                    })
                    }else{
                        this.insertTerminalManufacturer(params).then(data=>{
                            if(data.flag){
                                this.$message.success(this.$t('action.updateSuccess'))
                                this.$emit('confirm');
                                this.options.flag = false;
                            }else{
                                this.$message.error(this.$t("error." + data.errorCode))
                            }
                            this.loadFlag = false
                        }).catch(_=>{
                            this.loadFlag = false        
                        })
                    }
              }else{
                return false;
              }
          })
      },
      //表单重置
      resetForm(){
          this.$refs['formItem'].resetFields();
      },
      //添加名称是否重复
      isSame(rules,value,callback){
            if(!this.$service.isContext(value)){
					let name = value+"";
					if(name != this.options.name1){
						this.isExistTerminalManufacturerName({"name":value}).then(data => {
							if(!data.flag){
								callback(new Error(this.$t("terminalProM.sameName")));
							}else{
								callback();
							}
						});
					}else{
						callback();
					}
				}
      }
  },
  //弹框重置
  watch:{
      'options.flag'(newVal){
          if(!newVal){
              this.options.name = '';
          }
      }
  },
  mounted(){
      if(this.options.isModify){
        let loadingInstance = this.$loading({
            text: this.$t('role.type1'),
            target: document.querySelector('.el-dialog')
        });
        let params = {
            id:this.options.rowInfo.id
        }
        this.getTerminalManufacturerById(params).then(data=>{
            loadingInstance.close();
            if(data.flag){
                this.formData = data.data;
            }else{
                 
            }
        }).catch(_=>{
            loadingInstance.close()                        
        })
      }
  }
}
</script>
<style lang="scss">
    .terminalContainer{
        .el-input{
            width: 270px;
        }
    }
</style>
