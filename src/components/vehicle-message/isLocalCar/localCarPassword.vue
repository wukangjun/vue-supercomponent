<template>
	<div class="loaclNext">
		<el-steps :space="250" :active="dialog.active" style="position:absolute;left:40px;top:45px;margin-right:30px">
			<el-step title="步骤 1" icon='edit' ></el-step>
			<el-step title="步骤 2" icon="upload" ></el-step>
			<el-step title="步骤 3" icon="picture" ></el-step>
		</el-steps>
		<el-form :model="dialog.form" :rules="rules" ref="form" label-width="90px" style="padding:40px">
			<el-form-item label="锁车原因:" prop="reason" v-if="$store.getters.isShowCar" class="text1">
				<el-input v-model="$store.getters.isAllInfo.reason" disabled="disabled"></el-input>
			</el-form-item>
			<el-form-item label="限制密码:" prop="localPassword" class="passLocal text1">
				<el-input v-model="dialog.form.localPassword" type="password" ></el-input>
			</el-form-item>
			<el-form-item label="手机验证:" prop="phone" class="passLocal text1">
				<el-input v-model="dialog.form.phone"  auto-complete="on" class="set" placeholder="请输入有效手机号">	
				</el-input>
                  <button @click.stop.prevent="getCode(formData)"  :disabled="!show" class="sendSmsBtn">
                    <span v-show="show">获取验证码</span>
                    <span v-show="!show" class="count">{{count}} s</span>
            </button>      
			</el-form-item>          
			<el-form-item label="手机验证码:" prop="phoneWord" class="passLocal text1" >
				<el-input v-model="dialog.form.phoneWord" auto-complete="off"></el-input>
			</el-form-item>
			<el-button class="goSet" @click="setPassword()" size="small" >设置密码</el-button>
			<el-form-item class=" footer1 text1">
				<el-button type="primary"  @click="closed()" class="confirm1" >取消</el-button>
				</el-button>
				<el-button type="primary" :loading="loading" @click="submitForm('form')" class="cancel1" @disabled="next">下一步</el-button>
			</el-form-item>
		</el-form>
		<div v-if="dialog.btnClick">
			<local-car :data="dialog"> </local-car>
		</div>
	</div>
</template>
<script>
import header from "../../../view/monitorPlatform/index/header";
import localCar from "./localCar.vue";
import { password, service, http, COMMON } from "@/utils";

const TIME_COUNT = 60;
export default {
  components: {
    localCar
    // header
  },
  props: {
    options: {}
  },
  mixins: [header],
  // 锁车(${this.$store.getters.carCurrent.plateCode})
  data() {
    return {
      next: false,
      //   open: false,
      formData: {
        phone: "",
        code: ""
      },
      show: true,
      count: "",
      timer: null,

      isFocu: false,
      idP: "",
      dialog: {
        // title:`锁车(${this.$store.getters.carCurrent.plateCode})`
        flag: false,
        active: 1,
        name: "",
        size: "dialog-tiny",
        btnClick: false,
        ablitly: "",
        allData: {},
        form: {
          localPassword: "",
          phone: "",
          phoneWord: ""
        }
      },
      overTime: "",
      radio: "1",
      text1area2: "",
      loading: false,
      rules: {
        localPassword: [
          { required: true, message: "密码不能为空", trigger: "blur,change" }
          // {pattern:/^(?!\d+$).*\d.*$/,message:this.$t("filter.type13"),trigger: 'blur,change' },
        ],
        phone: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur,change,blurClick"
          },
          {
            pattern: /^1[34578]\d{9}$/,
            message: this.$t("terminalProM.typeCorrectNum")
          }
          // { validator: this.validatePass}
          // {min:11,max:11,message: this.$filter.lanReplace(this.$t('filter.FixedLength'),{len:11})}
        ],
        phoneWord: [
          { required: true, message: "手机验证码不能为空", trigger: "blur,change" }
        ]
      }
    };
  },
  methods: {
    //设置限制密码的跳转
    setPassword() {
      let that = this.$parent.$parent.$parent.$parent.$children[0].dialog;
      that.flag = true;
      that.size = "dialog-middle";
      that.title = "设置";
      that.name = "userSetting";
    },
    //点击短信发
    getCode(formData) {
      if (
        this.dialog.form.phone != "" &&
        /^1[34578]\d{9}$/.test(this.dialog.form.phone) == true
      ) {
        this.sendMessage();
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }
      } else {
        return false;
      }
    },

    //短信发送验证码
    sendMessage() {
      let params = {
        //限制或解除限制的类型
        type: this.$store.getters.isShowCar ? "0" : "1",
        //手机号码
        bindingPhoneNum: this.dialog.form.phone,
        //车辆id
        vehicleId: this.$store.getters.carCurrent.vehicleId
      };
      this.$http({
        url: COMMON.baseUrl + "/sms/getVerifiCode",
        method: "POST",
        params: params
      }).then(data => {
        let _self = this;
        if (data.flag) {
          _self.idP = data.data;
          this.$message.success("短信验证码发送成功");
        } else {
          this.$message.error("短信验证码发送失败");
        }
      });
    },
    //步骤条的显示和前进
    nextStep() {
      if (this.dialog.active++ > 3) {
        this.dialog.active = 1;
      }
    },
    closed() {
      this.options.flag = false;
    },
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let params = {
            //短信验证码
            code: this.dialog.form.phoneWord,
            //短信接口返回的id
            vid: this.idP,
            //限制密码
            password: password.$SHA512(
              password.$SHA512(this.dialog.form.localPassword) +
                "&" +
                JSON.parse(localStorage.getItem("user")).account
            ),
            phoneNum: this.dialog.form.phone
          };
          this.loading = true;
          this.$http({
            url: COMMON.baseUrl + "/lockCar/verify",
            method: "POST",
            params: params
          }).then(data => {
            this.$store.dispatch("isLocalPassword", params.password);
            if (data.flag) {
              if (data.data) {
                this.dialog.btnClick = true;
                if (this.$store.getters.isShowCar == "0") {
                  this.getPower();
                }
                this.nextStep();
              }
              this.loading = false;
              this.$message.success("操作成功");
            } else {
              this.$message.error({
                message: this.$t("error." + data.errorCode)
              });
              this.loading = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    //获取第二步骤的能力项
    getPower() {
      let params = {
        vehicleId: this.$store.getters.carCurrent.vehicleId
      };
      this.$http({
        url: COMMON.baseUrl + "/terminalAbility/getTerminalAbilityByVehicleId",
        method: "POST",
        params: params
      }).then(data => {
        if (data.flag) {
          if (data.errorCode == "208") {
            this.dialog.ablitly = "";
          }
          this.dialog.ablitly = data.data;
        } else {
          return false;
        }
      });
    }
  },
  mounted() {},
  watch: {
    "options.flag"(newVal) {
      this.dialog.flag = newVal;
      if (!newVal) {
        this.options.name = "";
      }
    }
    // '$store.getters.carCurrent.vehicleStatus'(newVal){
    //   if(newVal==1){
    //     this.next=false;
    //   }else{
    //     this.next=true;
    //   }
    // }
  }
};
</script>
<style lang="scss">
$Height: 300px;
$width: 450px;
.localNext {
  width: $width;
  // height: $Height;
  overflow: hidden;
  .el-steps {
    font-size: 24px;
  }
}
.passLocal.is-required .el-form-item__label:before {
  content: "";
}

.goSet {
  text-decoration: none;
  float: right;
}

.goSet:hover {
  cursor: pointer;
}

.btn2 {
  //   color: #fff;
  //   height: 34px;
  //   width: 100px;
  //   border:none;
  //   background-color: #20a0ff;
  //   border-radius: 0;
}
.setPassword {
  cursor: pointer;
  position: relative;
  top: 35px;
}

.set .el-input-group__append {
  padding: 0;
}

.text1 {
  margin: 18px 0;
}

.confirm1 {
  width: 150px;
}

.cancel1 {
  position: relative;
  left: 78px;
  width: 150px;
}

.footer1 {
  position: relative;
  bottom: -35px;
}
.sendSmsBtn {
  position: absolute;
  right: 0px;
  height: 35px;
  line-height: 34px;
  border-radius: 3px;
  background: #2ca2fc;
  border: none;
  padding: 0 6px;
  color: #fff;
  display: inline-block;
  width: 90px;
  top: 0;
}
</style>
