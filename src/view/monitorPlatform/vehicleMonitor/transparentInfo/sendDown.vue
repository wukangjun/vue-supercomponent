<template>
	<el-row class="sendDown" :gutter="20">	
		<el-col :span="24">
			<el-form :model="formData" label-position="top" :inline="false" :rules="rules" ref="sendDowm">
				   <el-form-item :label="$t('transparentInfoSend.type')" prop="type">
					   <el-select v-model="formData.type" :rows="3" size='small'>
						 <el-option :label="$t('transparentInfoSend.gnssModelDetailData')" value='0'></el-option>
						 <el-option :label="$t('transparentInfoSend.roadTransICCardInfo')" value='11'></el-option>
						 <el-option :label="$t('transparentInfoSend.serialCom1')" value='65'></el-option>
						 <el-option :label="$t('transparentInfoSend.serialCom2')" value='66'></el-option>
						 <el-option :label="$t('transparentInfoSend.selfDefined245')" value='245'></el-option>
						 <el-option :label="$t('transparentInfoSend.userSelfDefined')" value='-1'></el-option>
					   </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('transparentInfoSend.data')" prop="data">
                        <el-input type="textarea" :rows="3" v-model.trim="formData.data " size="small" ></el-input>
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
			options: {
			}
		},
		data(){
			return{
				formData:{
					type:"0",
					data:""
				},
				loading:false,
				rules: {
					type: { required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' },
                    data:  { required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' }
                }
			}
		},
		methods: {
		   confirm(){
				this.$refs['sendDowm'].validate(valid => {
					if(valid){
						let params = {
							type: this.formData.type,
							data:this.formData.data,
							enterpriseId:this.options.enterpriseId,
							vehicleId: this.options.id
						}
						if(!params.type||isNaN(params.type)){
							this.$message.warning(this.$t('transparentInfoSend.alertToSelect'));
							return ;
						}
						if(!params.data){
							this.$message.warning(this.$t('transparentInfoSend.alertToInputValue'));
							return ;
						}
						this.loading = true;
						this.$store.dispatch('sendTransparentinfoSendCmd',params).then(data =>{
							if (!data.flag && !!data.errorCode){
								this.$message.error({ message: this.$t("error."+data.errorCode) });
							}else{
								this.$message.success(this.$t('action.addSuccess'));
								this.options.flag = false;
								this.$emit('confirm');
							}
							this.loading = false
						}).catch(error=>{
							this.loading = false;
						})		
					}else{
							return false
					}
				})
			}
		},
		watch: {
			'options.flag'(newVal){
				if(!newVal){
					this.$refs['sendDowm'].resetFields()
				}
			}
		}
	}
</script>
<style lang="scss" >
	.sendDown{
		.el-input ,.el-select{
			width:360px;
		}
	}
</style>
