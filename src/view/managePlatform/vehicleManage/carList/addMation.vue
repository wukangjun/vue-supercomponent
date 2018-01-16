<template>

	<el-row class="container" :gutter="20">
		<el-col :span="24">
			<el-form :model="formData" label-position="top" :inline="false" :rules="rules" ref="addForm">
				<el-col :span="12">
					<el-form-item :label="$t('dm.company')" prop="enterpriseName">
						<cv-dropdown-tree 
						:interface="$COMMON.baseUrl + '/enterprise/getEnterpriseTreeList'" 
						v-model="formData.enterpriseName"
						:is-default="true"
						@label="enterpriseId"></cv-dropdown-tree>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item :label="$t('dM.driveName')" prop="username">
						<el-input v-model.trim="formData.username" size='small' :maxlength="15"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item :label="$t('dM.telPhone')" prop="mobilephone">
						<el-input v-model.trim="formData.mobilephone" size='small' :maxlength="11"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item :label="$t('dM.driveCode')" prop="driverlicenseno">
						<el-input v-model.trim="formData.driverlicenseno" size='small' :maxlength="18"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item :label="$t('dM.sex')" prop="sex" >
						<el-select v-model="formData.sex" style="width:260px" size='small'>
							<el-option :label="$t('dM.man')" value="1"></el-option>
							<el-option :label="$t('dM.woman')" value="0"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-form>
		</el-col>
		<el-col :span="24" class="dialog-footer">
			<el-button type="primary" :loading='submitFalg'  @click="confirm">{{$t('action.save')}}</el-button>
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
				submitFalg:false,
				formData:{
					username: "",
					mobilephone: "",
                    driverlicenseno: "",
					sex:"",
					username:"" ,
					enterpriseName:'',
					id:'' 
				},
				rules: {
					username: [
						{ required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' },
						{ min:3, max: 15, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:3,max:15}) }
					],
					mobilephone: [
						{ required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' },
						{ pattern:/^1[34578]\d{9}$/, message:this.$t("filter.type6")},
						{min:11,max:11,message: this.$filter.lanReplace(this.$t('filter.FixedLength'),{len:11})}
					],
					driverlicenseno: [
						{ required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' },
						{ pattern: /^[A-za-z0-9]+$/, message:this.$t('filter.type9')},
						{min:18,max:18,message:this.$filter.lanReplace(this.$t('filter.FixedLength'),{len:18})},
					],
					enterpriseName: { required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' }
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
                    	this.options.flag = false;
						this.submitFalg=true;
						this.$store.dispatch('insertDriver', params).then(data => {
							if (data.flag){
								this.$emit('confirm')
								this.options.insterMation=true;
								this.$message.success(this.$t('action.addSuccess'));
							}else{
								this.$message.error(this.$t('error.'+data.errorCode));
								this.options.insterMation=false;
							}
							this.submitFalg=false;
						}).catch(_=>{
							this.submitFalg=false;
						});
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
	.dialog-search{
		margin-top: 24px;
	}

</style>