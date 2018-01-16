<template>
  <div class="alarmbox">
    <el-tabs class="tab">
      <el-tab-pane v-for="elTabs in elTabPanes" :key="elTabs.name" :label="elTabs.name">
         <component :is="elTabs.component" :options="dialogClosed"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
 import alarmTip from './alarmTip.vue'
 // import modifyPass from '@/components/modifypass/modifyPass.vue'
 import modifyPass from './modifyPass.vue'
 import vehicleLimite from './vehicleLimite.vue'
export default{
    components: {alarmTip,vehicleLimite,modifyPass},
    props: {
      options: {
      }
    },
    data(){

      return{
        dialogClosed:{
          flag: true
        },
        //这里是设置中每个切换栏的组建模板的引用
        elTabPanes:[
        {name:'用户安全',component:'modifyPass'},
        {name:'车辆限制',component:'vehicleLimite'},
        {name:'报警提醒',component:'alarmTip'},
        ]
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
              this.options.flag=false;
              data.flag==true ? this.$message.success("修改成功！") : this.$message.error({ message: this.$t("error."+data.errorCode) });
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
      "dialogClosed.flag"(newVal){
        this.options.flag = newVal
      }
    }

  }
</script>
<style lang='scss'>
.alarmbox{
    width:100%;
    .textcenter{
      text-align: center;
    }
}

</style>
