<template>
<div class='modifyPass'>
  <el-form :model="form" :rules="rules" ref="form" label-width="120px" style='width:435px;margin:0 auto;'>
    <el-form-item label="旧的登录密码:" prop="oldPassword">
        <el-input v-model.trim="form.oldPassword" name="form.oldPassword" auto-complete="off" :maxlength='20' type="password" class="modify-item"></el-input>
    </el-form-item>
      <el-form-item label="新的登录密码:" prop="pass">
        <el-input type="password" v-model.trim="form.pass" name="form.pass"  auto-complete="off" :maxlength='20' class="modify-item"></el-input>
        <cv-password-strength v-model="form.pass"></cv-password-strength>
      </el-form-item>
    <el-form-item label="请再输入一次:" prop="checkPass">
        <el-input type="password" v-model.trim="form.checkPass"  name="form.checkPass" auto-complete="off" :maxlength='20' class="modify-item"></el-input>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="submitForm('form')" class='' :loading="loading" style="margin-left:45px;">保存</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
    </el-form-item>
     </el-form>
</div>
</template>

<script>
import { password, service} from '@/utils'
import common from '@/utils/mixins/common'

  export default{
    mixins: [common],
    props: {
      options: {
      }
    },
    data(){
      return{
        loading:false,
         form:{
          oldPassword: '',
          pass: '',
          checkPass: ''
        },
        rules:{
          pass: [
            {required: true, message: '密码不能为空', trigger: 'blur,change'},
            { validator: this.validatePass},
            { min:4, max: 20, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:4,max:20}) }
          ],
          checkPass: [
            {required: true, message: '密码不能为空', trigger: 'blur,change'},
            {validator: this.validatePass2},
            { min:4, max: 20, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:4,max:20}) }
          ],
          oldPassword: [
            {required: true, message: '密码不能为空', trigger: 'blur,change'},
            { min:4, max: 20, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:4,max:20}) }
          ]
        },
      }
    },
    methods:{
      validatePass(rule, value, callback){
        if (value === '') {
              callback(new Error('请输入密码'));
            } else {
               if (value == this.form.oldPassword) {
                callback(new Error('新旧密码不能相同！'));
               }
              if (this.form.checkPass !== '') {
                this.$refs.form.validateField('checkPass');
              }
              callback();
            }
      },
      validatePass2(rule, value, callback){
        if (value === '') {
              callback(new Error('请再次输入密码'));
            }else if (value !== this.form.pass) {
              callback(new Error('两次输入密码不一致!'));
            }else if(value == this.form.oldPassword){
              callback(new Error('新旧密码不能相同！'));
            }
            else {
              callback();
        }
      },
      submitForm(form){
        this.$refs[form].validate(valid => {
          if(valid){   
            this.$store.dispatch("updatePswd", { pswd:password.$SHA512(password.$SHA512(this.form.oldPassword)+'&'+JSON.parse(localStorage.getItem('user')).account),newPswd:password.$SHA512(password.$SHA512(this.form.checkPass)+'&'+JSON.parse(localStorage.getItem('user')).account)}).then((data) => {
              this.loading = false;
              if(data.flag){
                this.$message.success("修改成功！")
                this.options.flag =false
              }else{
                this.$message.error({ message: this.$t("error."+data.errorCode) });
              }
            }).catch(error=>{
              this.loading = false;
            })
          }else{
            return false;
          }
        })
      },
      resetForm(form){
        this.$refs[form].resetFields();
      }
    },
    watch:{
      "options.flag"(newVal){
         this.$refs['form'].resetFields();
      }
    }
  }
</script>
<style lang='scss'>
  .modifyPass{
    .modify-item{
      width: 180px;
    }
  }
</style>
