<template>

	<el-row class="container" :gutter="20">
	
	<el-col :span="24">
		<el-form :model="formData" label-position="top" :inline="false" :rules="rules" ref="addForm">
	
				<!-- 司机姓名  -->
				<el-col :span="12">
					<el-form-item :label="$t('dM.driveName')" prop="username">
						<el-input v-model.trim="formData.username" size="small" :maxlength='10'></el-input>
					</el-form-item>
				</el-col>
				<!-- 手机号  -->
				<el-col :span="12">
					<el-form-item :label="$t('dM.telPhone')" prop="mobilephone">
						<el-input v-model.trim="formData.mobilephone" size="small" :maxlength='11'></el-input>
					</el-form-item>
				</el-col>
				
				<!-- 驾驶证号  -->
				<el-col :span="12">
					<el-form-item :label="$t('dM.driveCode')" prop="driverlicenseno">
						<el-input v-model.trim="formData.driverlicenseno" size="small" :maxlength='18'></el-input>
					</el-form-item>
				</el-col>
				<!-- 所属企业  -->
				<el-col :span="12">
					<el-form-item :label="$t('dm.company')" prop="enterpriseName">
						<cv-dropdown-tree 
						:interface="interface" 
						v-model="formData.enterpriseName"
						@label="enterpriseId"></cv-dropdown-tree>
					</el-form-item>
				</el-col>
				<!-- 性别  -->
				<el-col :span="12">
					<el-form-item :label="$t('dM.sex')" prop="sex">
						<el-select v-model="formData.sex" style="width:260px;"size="small" clearable>
							<el-option :label="$t('dM.man')" value="1"></el-option>
							<el-option :label="$t('dM.woman')" value="0"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-form>
		</el-col>
		<el-col :span="24" class="dialog-footer">
			<el-button :loading="loading" type="primary" @click="confirm">{{$t('action.save')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</el-col>
	</el-row>
</template>

<script>
import {COMMON} from '@/utils'
	export default{
		props: {
			options: {}
		},
		data(){
			return{
				interface: COMMON.baseUrl + '/enterprise/getEnterpriseTreeList',
				formData:{
					username: "",
					mobilephone: "",
          driverlicenseno: "",
					sex:"",
					username:"" ,
					enterpriseName:'',
					id:'' 	
					
				},
				loading:false,
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
				}
			}
		},
		methods: {
           confirm(){
				this.$refs['addForm'].validate(valid => {
					if(valid){
						let params = {
							enterpriseId: this.formData.id,
							enterpriseName:this.formData.enterpriseName,
              username: this.formData.username,
              mobilephone: this.formData.mobilephone,
              driverlicenseno: this.formData.driverlicenseno,
							sex: this.formData.sex
							};
						this.loading = true
						this.$store.dispatch('insertDriver', params).then(data => {
						   this.loading = false
						   if (!data.flag && !!data.errorCode){
						   		// this.$notify.error({message: this.$t("error."+data.errorCode)});
						   			this.$message.error({ message: this.$t("error."+data.errorCode) });
						   }else{
						   		this.$emit('confirm')
						   		// this.$notify.success(this.$t('action.addSuccess'));
						   			this.$message.success(this.$t('action.addSuccess'));
						   		this.options.flag = false;
						   }
						}).catch(error=>{
              this.loading = false;
            })
						
					}else{
						return false
					}
				})
			},
			enterpriseId(val){
				this.formData.id = val.id
			}
		},
		watch: {
			'options.flag'(newVal){
				if(!newVal){
					this.$refs['addForm'].resetFields()
				}
			}
		}
	}
</script>
<style lang="scss" scoped>

</style>
