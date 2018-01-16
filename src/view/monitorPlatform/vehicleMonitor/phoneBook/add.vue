<template>

	<el-row class="container" :gutter="20">
	
	<el-col :span="24">
		<el-form :model="formData" label-position="top" :inline="false" :rules="rules" ref="addForm">
				<!-- 联系人  -->
				<el-form-item :label="$t('phoneBook.contactName')" prop="contactName">
					<el-input v-model.trim="formData.contactName" size="small" :maxlength='20'></el-input>
				</el-form-item>
				<el-form-item :label="$t('phoneBook.phoneNumber')" prop="phoneNumber">
					<el-input v-model.trim="formData.phoneNumber" size="small" :maxlength='11'></el-input>
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
			<el-button :loading="loading" type="primary" @click="confirm">{{$t('action.save')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</el-col>
	</el-row>
</template>

<script>
import {COMMON} from '@/utils'
	export default{
		props: {
			options: {} //options 相当于dialog这个对象了，车辆已经保存在phoneBook.vue页面selectVehicleObject里面了这个页面调用就是options.selectVehicleObject <===> dialog.selectVehicleObject
		},
		data(){
			return{
				formData:{
					contactName: '',
					phoneNumber:'',
					callStatus:''
				},
				loading:false,
				rules: {
					contactName: [
						{ required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' },
						{ min:0, max: 10, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:20}) }
					],
					phoneNumber: [
						{ required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' },
						{ pattern:/^1[34578]\d{9}$/, message: this.$t('terminalProM.typeCorrectNum')},
						{min:11,max:11,message: this.$filter.lanReplace(this.$t('filter.FixedLength'),{len:11})}
					],
					callStatus:[
						{ required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' }
					]
				}
			}
		},
		methods: {
		   confirm(){
					this.$refs['addForm'].validate(valid => {
						if(valid){
						    console.log(this.options.selectVehicleObject);
						    if(!this.options.selectVehicleObject){
							   this.$message.error({ message: this.$t("vgPower.choseVehicle") });
							   return false;
							}
							let params = {
							    vehicleId:this.options.selectVehicleObject.id,
								contactName:this.formData.contactName,
								phoneNumber:this.formData.phoneNumber,
								callStatus:this.formData.callStatus,
								enterpriseId:this.$store.getters.user.enterpriseId
							};

							this.loading = true;
							this.$store.dispatch('insertPhonebook', params).then(data => {
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
