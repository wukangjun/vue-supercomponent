<template>
    <div>
        <el-row class="container" :gutter="20">
            <el-col :span="12">
                <el-form :model="formData" label-position="top" :inline="false" :rules="rules" ref="modify">
                    <el-col :span="24">
                        <el-form-item :label="$t('predefinedInfo.type')" prop="type" ref="modify">
                            <el-select v-model="formData.type"  size="small"  style="width:550px;" clearable>
                                <el-option :label="$t('predefinedInfo.selectOpt1')" value="0"></el-option>
                                <el-option :label="$t('predefinedInfo.selectOpt2')" value="2"></el-option>
                                <el-option :label="$t('predefinedInfo.selectOpt3')" value="3"></el-option>
                                <el-option :label="$t('predefinedInfo.selectOpt4')" value="4"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item :label="$t('predefinedInfo.msginfo')" prop="msginfo">
                            <el-input type="textarea" :rows="3"  v-model.trim="formData.msginfo" size="small" style="width:550px;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <el-col :span="24" class="dialog-footer">
                <el-button :loading="loading" type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
                <el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import {COMMON} from '@/utils'
import port from './index.js'
export default {
    props: {
        options: {}
    },
    mixins:[port],
    data() {
        return {
            formData:{
                msginfo:'',
                type:'',
                id:''
            },
            disable:true,
            rules: {
                type: [
                    { required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' }
                ],
                msginfo: [
                    { required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' }
                ]
            },
            loading:false
        }
    },
    methods: {
        confirm() {
            this.$refs['modify'].validate(valid => {
                if (valid) {
                    let params = {
                        msginfo: this.formData.msginfo,
			            type: this.formData.type,
                        id: this.options.modify.id
                    };
                    this.loading = true;
                    this.updatePredefinedInfo(params).then(data => {
                        this.loading = false
                     	if (!data.flag && !!data.errorCode){
                            this.$message.error({ message: this.$t("error."+data.errorCode) });
						}else{
                            this.options.flag=false;
                            this.$emit('confirm');
                            this.$message.success(this.$t('action.modifySuccess'));
                        }
                    }).catch(error=>{
                        this.loading = false;
                    });
                }
            });
        }

    },
    watch:{
      'options.flag'(newVal){
          if(!newVal){
              this.options.name = '';
          }
      }
     },
    mounted(){
        this.formData.msginfo = this.options.modify.msginfo;
	    this.formData.type =this.options.modify.type.toString();
    },
   
}
</script>
<style lang="scss" scoped>


</style>
