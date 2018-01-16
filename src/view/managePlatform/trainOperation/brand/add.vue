<template>
	<el-row class="brandAdd">
		<el-form 
		:inline="true" 
		label-position="right" 
		label-width="90px"
		:model="formData"
		:rules="rules"
		ref="formItem">
			<el-form-item label="所属企业" prop="enterName">
				<el-input v-model="formData.enterName"></el-input>
			</el-form-item>
			<el-form-item label="车厂名称"  prop="carname">
				<el-input v-model="formData.carname"></el-input>
			</el-form-item>
			<el-form-item label="品牌名称"  prop="brand">
				<el-input v-model="formData.brand"></el-input>
			</el-form-item>
			<el-form-item label="备注说明" prop="remark">
				<el-input v-model="formData.remark"></el-input>
			</el-form-item>
		</el-form>
		<div class="dialog-footer">
			<el-button type="primary">{{$t('msg.confirm')}}</el-button>
			<el-button @click="options.flag=false">{{$t('msg.cancel')}}</el-button>
		</div>
	</el-row>
</template>

<script>
	export default{
		props: {
			options: {}
		},
		data(){
			return{
				formData: {
					enterName: "",
					carname: "",
					brand: "",
					remark: ""
				},
				rules: {
					enterName: [
						{required: true, message: this.$t('msg.notEmpty'), trigger: 'blur,change'},
						{pattern: /\d/, message: '必须为数字'},
						{min:3, max:6, message: '长度在3-6'}

					]
				}
			}
		},
		watch: {
			'options.flag'(newVal){
				if(!newVal){
					this.$refs['formItem'].resetFields()
				}
			}
		}
	}
</script>

<style lang="scss">
	.brandAdd{
		.dropdown{
			width: 169px
		}
	}
</style>