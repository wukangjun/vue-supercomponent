<template>
    <el-row class="container" :gutter="20">
        <el-col :span="24">
            <el-form :inline="false" label-position="top" :model="formData" :rules="rules" ref='modify'>
                <el-form-item :label="$t('phoneBook.contactName')" prop="contactName">
                    <el-input v-model.trim="formData.contactName" size="small" :maxlength='100'></el-input>
                </el-form-item>
                <el-form-item :label="$t('phoneBook.phoneNumber')" prop="phoneNumber">
                    <el-input v-model.trim="formData.phoneNumber" size="small" :maxlength='100'></el-input>
                </el-form-item>
                <el-form-item :label="$t('phoneBook.callStatus')" prop="callStatus">
                    <el-select v-model="formData.callStatus" style="width:360px;"size="small" clearable>
                        <el-option :label="$t('phoneBook.callIn')" value="1"></el-option>
                        <el-option :label="$t('phoneBook.callOut')" value="2"></el-option>
                        <el-option :label="$t('phoneBook.callInAndOut')" value="3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="24" class="dialog-footer">
            <el-button :loading="loading" type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
            <el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
        </el-col>
    </el-row>
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
                contactName:'',
        		phoneNumber:'',
        		callStatus:'',
                id:''
            },
            disable:true,
            rules: {
                contactName: [
					{ required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' },
					{ min:0, max: 10, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:20})}
				],
	            phoneNumber: [
					{ required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' },
					{ pattern:/^1[34578]\d{9}$/, message: this.$t('terminalProM.typeCorrectNum')},
					{min:11,max:11,message: this.$filter.lanReplace(this.$t('filter.FixedLength'),{len:11})}
			    ],
				callStatus:[
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
                        contactName: this.formData.contactName,
            			phoneNumber: this.formData.phoneNumber,
            			callStatus: this.formData.callStatus,
                        id: this.options.modify.id
                    }
                    this.loading = true
                    this.$store.dispatch('updatePhonebook', params).then(data => {
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
                    }).catch(error => {
                        this.loading = false;
                    })
                }
            })
        }

    },
    watch:{
        'options.flag'(newVal){
            !newVal && (this.options.name = '');
        }
    },
    created(){
        this.formData.contactName = this.options.modify.contactName;
	    this.formData.phoneNumber = this.options.modify.phoneNumber;
	    this.formData.callStatus = this.options.modify.callStatus.toString();
    },
   
}
</script>


<style lang="scss" scoped>


</style>
