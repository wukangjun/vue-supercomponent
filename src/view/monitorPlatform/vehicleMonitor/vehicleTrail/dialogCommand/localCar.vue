<template>
	<el-form :model="form" :rules="rules" ref="form" label-width="90px" class="cv-local-car">
		<el-form-item label="限制转速:" prop="oldPassword">
		    <el-input v-model="form.oldPassword"></el-input>
		</el-form-item>
	  	<el-form-item label="限制车速:" prop="pass">
	    	<el-input type="password" v-model="form.pass" auto-complete="off"></el-input>
	  	</el-form-item>
		<el-form-item label="确认密码:" prop="checkPass">
		    <el-checkbox-group v-model="ruleForm.type">
		      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
		      <el-checkbox label="地推活动" name="type"></el-checkbox>
		      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
		      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
		    </el-checkbox-group>
		</el-form-item>
		<el-form-item class="dialog-footer">
		    <el-button type="primary" @click="submitForm('form')">保存</el-button>
		    <el-button @click="resetForm('form')">重置</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	export default{
		data(){
			return{
				form:{
					
				},
				rules: {

				}
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.cv-local-car{

	}
</style>