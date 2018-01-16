<template>
    <div>
        <el-row class="container" :gutter="20">
            <el-col :span="24">
                <el-form :model="formData" label-position="top" :inline="false" :rules="rules" ref="modify">
                    <el-form-item :label="$t('eventInfo.eventinfo')" prop="eventinfo">
                        <el-input v-model.trim="formData.eventinfo" size="small" :maxlength='100'></el-input>
                    </el-form-item>
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
export default {
    props: {
        options: {}
    },
    data() {
        return {
            formData:{
                eventinfo:'',
                id:''
            },
            disable:true,
            rules: {
                    eventinfo: [
                        { required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' },
                        { min:1, max: 20, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:1,max:20}) }
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
                        eventinfo: this.formData.eventinfo,
                        id: this.options.modify.id
                    }
                    this.loading = true
                    this.$store.dispatch('updateEventInfo', params).then(data => {
                         this.loading = false
                     	if (!data.flag && !!data.errorCode){
						// this.$notify.error({message: this.$t("error."+data.errorCode)});
                        this.$message.error({ message: this.$t("error."+data.errorCode) });
						}else{
                                    this.options.flag=false;
									this.$emit('confirm');
									// this.$notify.success(this.$t('action.modifySuccess'));
                                    this.$message.success(this.$t('action.modifySuccess'));
                                   
								}
                    }).catch(error=>{
                    this.loading = false;
                   })
                }
            })
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
        this.formData.eventinfo = this.options.modify.eventinfo;
    },
   
}
</script>


<style lang="scss" scoped>


</style>
