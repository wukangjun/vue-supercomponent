<template>
    <div>
        <el-row class="container" :gutter="20">
            <el-col :span="24">
                <el-form :model="formData" label-position="top" :inline="false" :rules="rules" ref="modify">
                    <el-col :span="12">
                        <el-form-item :label="$t('dM.driveName')" prop="username">
                            <el-input v-model.trim="formData.username" size="small" :maxlength='10'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('dM.telPhone')" prop="mobilephone">
                            <el-input v-model.trim="formData.mobilephone" size="small" :maxlength='11'></el-input>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                        <el-form-item :label="$t('dM.driveCode')" prop="driverlicenseno">
                            <el-input v-model.trim="formData.driverlicenseno" size="small" :maxlength='18'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('dm.company')" prop="enterpriseName" >
                           	<cv-dropdown-tree 
                            :readonly='disable'
						:interface="interface" 
						v-model="formData.enterpriseName"
						@label="enterpriseId"></cv-dropdown-tree>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('dM.sex')" prop="sex">
                            <el-select v-model="formData.sex" style="width:260px;" size="small">
                                <el-option :label="$t('dM.man')" value="1"></el-option>
                                <el-option :label="$t('dM.woman')" value="0"></el-option>
                            </el-select>
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
export default {
    props: {
        options: {}
    },
    data() {
        return {
            formData:{
                username:'',
                mobilephone:'',
                sex:'',
                driverlicenseno:'',
                enterpriseName:'',
                idS:'',
                
            },
            disable:true,
            interface: COMMON.baseUrl + '/enterprise/getEnterpriseTreeList',

             rules: {
                    username: [
                        { required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' },
                        { min:0, max: 10, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:10}) }
                    ],
                    mobilephone: [
                       { required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' },
                        { pattern:/^1[34578]\d{9}$/, message: this.$t('terminalProM.typeCorrectNum')},
                        {min:11,max:11,message: this.$filter.lanReplace(this.$t('filter.FixedLength'),{len:11})}
                    ],
                    driverlicenseno: [
                        { required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' },
                        { pattern: /^[a-zA-Z\d]+$/, message: this.$t('filter.type9') },
                        {min:18,max:18,message:this.$filter.lanReplace(this.$t('filter.FixedLength'),{len:18})},
                        ],
                    enterpriseName: [
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
                        username: this.formData.username,
                        mobilephone: this.formData.mobilephone,
                        sex: this.formData.sex,
                        driverlicenseno: this.formData.driverlicenseno,
                        enterpriseId: this.formData.idS,
                        id: this.options.modify.id
                    }
                    this.loading = true
                    this.$store.dispatch('updateDriverInfo', params).then(data => {
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
        },
        enterpriseId(val){
				this.formData.idS = val.id
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
        this.formData.username = this.options.modify.username;
        this.formData.mobilephone=this.options.modify.mobilephone;
        this.formData.sex=this.options.modify.sex;
        this.formData.driverlicenseno=this.options.modify.driverlicenseno;
        this.formData.enterpriseName=this.options.modify.enterpriseName;
        this.formData.vehicleId=this.options.modify.vehicleId;
        this.formData.idS=this.options.modify.enterpriseId;

        if(this.formData.vehicleId==undefined||this.formData.vehicleId==null){
            this.disable=false;            
        }
    },
   
}
</script>


<style lang="scss" scoped>


</style>
