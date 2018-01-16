<template>
<div class='vehicleLimite'>
  <el-form :model="form" :rules="rules" ref="form" label-width="180px" style='width:500px;margin:0 auto;'>
    <el-form-item label="旧密码/用户登录密码:" prop="oldPassword" >
        <el-input v-model.trim="form.oldPassword" name="form.oldPassword" placeholder='车辆限制旧密码' auto-complete="off" :maxlength='20' type="password" class="modify-item"></el-input>
        <span class='toolTip'>用户第一次设置车辆限制密码，需填入用户登陆密码</span>
    </el-form-item>
      <el-form-item label="新密码:" prop="pass">
        <el-input type="password" v-model.trim="form.pass" name="form.pass" placeholder='车辆限制新密码' auto-complete="off" :maxlength='20' class="modify-item"></el-input>
        <cv-password-strength v-model="form.pass" v-on:level='listenToChild'></cv-password-strength>
      </el-form-item>
    <el-form-item label="确认密码:" prop="checkPass" style='margin-bottom:45px;'>
        <el-input type="password" v-model.trim="form.checkPass"  name="form.checkPass" placeholder='车辆限制确认密码' auto-complete="off" :maxlength='20' class="modify-item"></el-input>
        <!-- <span class='toolTip'>忘记密码请联系系统管理员，联系电话：XXXXXX</span> -->
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="submitForm('form')" class='' :loading="loading" style="margin-left:45px;">保存</el-button>
        <el-button @click="resetForm('form')" >重置</el-button>
    </el-form-item>
     </el-form>
</div>
</template>

<script>
import { password, service,COMMON, http} from '@/utils'
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
          checkPass: '',
          isSafe:false,
        },
        setPsdType:'',
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
               if(this.isSafe!=3){
                 callback(new Error('新密码安全级别必须为安全！'));
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
            this.firstSetPsd();
          }else{
            return false;
          }
        })
      },
      //初始设置密码的接口
      firstSetPsd(){
         http({
                url: COMMON.baseUrl + '/lockCar/setPassword',
                params:{ oldpwd: password.$SHA512(password.$SHA512(this.form.oldPassword)+'&'+JSON.parse(localStorage.getItem('user')).account),newpwd:password.$SHA512(password.$SHA512(this.form.checkPass)+'&'+JSON.parse(localStorage.getItem('user')).account)}
            }).then((data) => {
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

      },
      resetForm(form){
        this.$refs[form].resetFields();
      },
      //用来监听密码加强的安全的值
      listenToChild(data){
        this.isSafe=data;
      },
      //判断是否设置过车辆限制密码
      isSetVehiclePsd(){
          http({
                url: COMMON.baseUrl + '/lockCar/existPwd',
            }).then((data) => {
              if(data.flag){
                if(data.data=="0"){
                  //初次设置密码
                  this.setPsdType='0'
                }else{
                  //设置过密码
                  if(data.data=="1"){
                    this.setPsdType='1'
                  }
                }
              }
            })
      },

    },
     mounted() {
        this.isSetVehiclePsd();
        console.log(JSON.parse(localStorage.getItem('user')).account+'------')
    },
    watch:{
      "options.flag"(newVal){
         this.$refs['form'].resetFields();
      }
    }
  }
</script>
<style lang='scss'>
  .vehicleLimite{
    .modify-item{
      width: 180px;
    }
    .toolTip{
      position:absolute;
      top:45px;
      left:0px;
      color:red;
      font-size: 12px;
    }
    .el-form-item{
      margin-bottom: 40px;
    }
  }
</style>
