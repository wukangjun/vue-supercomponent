<template>
    <el-row class="container" :gutter="20">
       <el-col :span="24">
                <el-form :model="formData" label-position="top" :inline="false" :rules="rules"  ref="sendDown">
                    <el-form-item :label="$t('vehicleInfo.adScreen')" prop="adScreen">
                       <el-checkbox-group v-model="formData.checkList" :change="checkboxChange(this)">
                            <el-checkbox :label="1" >{{$t('predefinedInfo.selectOpt1')}}</el-checkbox>
                            <el-checkbox :label="4" >{{$t('predefinedInfo.selectOpt2')}}</el-checkbox>
                            <el-checkbox :label="8" >{{$t('predefinedInfo.selectOpt3')}}</el-checkbox>
                            <el-checkbox :label="16" >{{$t('predefinedInfo.selectOpt4')}}</el-checkbox>
                        </el-checkbox-group>
                        <el-radio  v-model="formData.beiDouFlag" :label="0" >{{$t('vehicleInfo.beiDouFlag.type1')}}</el-radio>
                        <el-radio  v-model="formData.beiDouFlag" :label="32" >{{$t('vehicleInfo.beiDouFlag.type2')}}</el-radio>
                    </el-form-item>
                    <el-form-item :label="$t('vehicleInfo.msgInfo')" prop="msgInfo">
                        <el-input  type="textarea"  :rows="3"   v-model.trim="formData.msgInfo"></el-input>
                     </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="24" class="dialog-footer">
                <el-button :loading="loading" type="primary" @click="confirm">{{$t('action.sendDown')}}</el-button>
                <el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
            </el-col>
    </el-row>
</template>
<script>
import {COMMON} from '@/utils'
import index from './'
export default {
    props: {
        options: {}
    },
    data() {
        return {
             formData:{
                vehicleId:'',
                type:'',
                msgInfo:'',
                checkList:[],
                beiDouFlag:''
            },
            rules:{
                msgInfo: [
						{ required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' }
				]
            },
            disable:true,
            loading:false
        }
    },
    methods: {
        confirm() {
            this.$refs['sendDown'].validate(valid => {
                if (valid) {
                    let params = {
                        type: this.formData.type?parseInt(this.formData.type):this.formData.type,
                        msgInfo:this.formData.msgInfo,
                        enterpriseId:this.$store.getters.user.enterpriseId,
                        vehicleId: this.formData.vehicleId
                    }
                    if(isNaN(params.type)){
                        this.$message.warning(this.$t('vehicleInfo.alertToSelect'));
                        return ;
                    }
                    if(!params.msgInfo){
                        this.$message.warning(this.$t('vehicleInfo.alertToInputValue'));
                        return ;
                    }
                    this.loading = true;
                    console.log("send params enterpriseId:"+params.enterpriseId);

                   this.$store.dispatch('textSendDown',params).then(data =>{
					    this.loading = false;
                        if (!data.flag && !!data.errorCode){
                            this.$message.error({ message: this.$t("error."+data.errorCode) });
                        }else{
                            this.options.flag=false;
                            this.$emit('confirm');
                            this.$message.success(this.$t('action.orderSuccess'));
                        }
					
                    }).catch(error=>{
                            this.grid.loading = false;
                    })		
                   
                }
            })
        },
        checkboxChange(obj){
            var type=parseInt(0);
            // 广告屏显示
            if(this.formData.checkList){
                this.formData.checkList.forEach(function(val,index,arr){
                      type+=parseInt(val);        
                })
            }
            
            // 北斗类型
            if(this.formData.beiDouFlag){
                  type+=parseInt(this.formData.beiDouFlag);
            }
            this.formData.type=type;
            console.log("type value is:"+this.formData.type);
        }

    },
    watch:{
        'options.flag'(newVal){
            !newVal && (this.options.name = '');
        }
    },
    created(){
        this.formData.vehicleId = this.options.sendDown.id.toString();
    }
   
}
</script>


<style lang="scss" scoped>


</style>
