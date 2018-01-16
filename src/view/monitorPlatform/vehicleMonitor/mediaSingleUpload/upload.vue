<template>
   <div class="uploadDia">
        <i class="el-icon-warning" style="font-size:30px;color:#E6A23C;"></i><cv-span style="position:relative;top:-6px;left:10px;">选择删除，终端设备将在上传后删除该媒体数据！</cv-span>
        <el-radio-group class="radioGroup" v-model="radio">
            <el-radio :label="0">保留</el-radio>
            <el-radio :label="1">删除</el-radio>
        </el-radio-group>
        <el-col :span="24" class="dialog-footer">
            <el-button type="primary" :loading="upFlag" @click="confirm">{{$t('上传')}}</el-button>
            <el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
        </el-col>
   </div>
</template>
<script>
import prot from './index.js'
 export default {
    props: {
        options: {}
    },
     components: {
      
     },
     mixins:[prot],
     data(){
       return {
           radio:1,
           upFlag:false
       }
     },
     methods:{
        confirm(){
            let params = {
                vehicleId:this.options.vehicleId,
                ids:this.options.selectId,
                delFlag:this.radio
            }
            this.upFlag = true;
            this.sendMediaUploadCmd(params).then(data=>{
                if(data.flag){
                    this.options.flag = false;
                    this.upFlag = false;
                    this.$message.success({message:this.$t('指令下发成功'+data.data.success+'条，失败'+data.data.fail+'条')});
                    this.$emit('confirm')
                }else{
                    this.$message.error({message:this.$t('error.'+data.errorCode)});
                    this.upFlag = false;
                }
            })
        } 
     }
 }
</script>
<style lang="scss">
    .uploadDia{
        text-align: center;
        .radioGroup{
            margin: 15px;
        }
        .dialog-footer{
            margin:10px 0;
        }
    }
</style>
