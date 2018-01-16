<template>
	<el-form :model="form" :rules="rules" ref="form" label-width="90px">
		<el-form-item label="旧密码:" prop="oldPassword">
		    <el-input v-model="form.oldPassword"></el-input>
		</el-form-item>
	  	<el-form-item label="密码:" prop="pass">
	    	<el-input type="password" v-model="form.pass" auto-complete="off"></el-input>
	  	</el-form-item>
		<el-form-item label="确认密码:" prop="checkPass">
		    <el-input type="password" v-model="form.checkPass" auto-complete="off"></el-input>
		</el-form-item>
		<el-form-item class="dialog-footer">
		    <el-button type="primary" @click="submitForm('form')">保存</el-button>
		    <el-button @click="resetForm('form')">重置</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	export default{
		props: {
			options: {}
		},
		data(){
			return{
				form:{
					oldPassword: '',
					pass: '',
					checkPass: ''
				},
				rules:{
					pass: [
						{required: true, message: '密码不能为空', trigger: 'blur,change'},
						{ validator: this.validatePass}
					],
					checkPass: [
						{required: true, message: '密码不能为空', trigger: 'blur,change'},
						{validator: this.validatePass2}
					],
					oldPassword: [
						{required: true, message: '密码不能为空', trigger: 'blur,change'}
					]
				}
			}
		},
		methods:{
			validatePass(rule, value, callback){
				if (value === '') {
		          callback(new Error('请输入密码'));
		        } else {
		          if (this.form.checkPass !== '') {
		            this.$refs.form.validateField('checkPass');
		          }
		          callback();
		        }
			},
			validatePass2(rule, value, callback){
				if (value === '') {
		          callback(new Error('请再次输入密码'));
		        } else if (value !== this.form.pass) {
		          callback(new Error('两次输入密码不一致!'));
		        } else {
		          callback();
		        }
			},
			submitForm(form){
				this.$refs[form].validate(valid => {
					if(valid){

					}else{
						return false;
					}
				})
			},
			resetForm(form){
				this.$refs[form].resetFields();
			}
		}
	}
</script>