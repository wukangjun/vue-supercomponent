<template>
<div class="hot">
    <el-row >
               <img src="../../assets/img/login/title.png" alt="" title="" style="position:absolute;top:26px;left:26px;"/>
        <div class="clod">
        <div class="people">    
            <el-col  :xs="12" :sm="9" :md="8" :lg="10" :offset="3">
                <img src="../../assets/img/login/Group.png" alt="" title="" style="width:100%;"/>
            </el-col>  
        </div>
         <el-col  :xs="7" :sm="10" :md="11" :lg="9" :offset="2">      
            <div class="login">  
                <div class="upDown">
                    <el-form class="form" :model="ruleForm">
                      <div class="mvp">车辆监控系统</div>
                        <div class="item hold" v-clickoutside="disHide">
                            <el-form-item prop="enterpriseCode" class="double">
                                <cv-icon name="building" size="24" color="#999" class="img"></cv-icon>
                                <el-input type="text" class="text enterCode" id="tt_code" v-model.trim="ruleForm.enterpriseCode" placeholder="公司编号" @focus="onFocus"></el-input>
                            </el-form-item>
                            <div v-if="show" class="show">
                                <el-table :data="user" @row-click="rowChange" :show-header='false' width='100%'>
                                    <el-table-column  prop="companyCode" :show-overflow-tooltip="true" ></el-table-column>
                                    <el-table-column  prop="name" :show-overflow-tooltip="true" ></el-table-column>
                                    <el-table-column >
                                        <template scope="scope">
                                            <cv-span @click.native.stop="remove(scope,$event)" class="clear" style="color:#999;font-size:20px;">×</cv-span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>

                        </div>
                        <div class="item">
                            <el-form-item prop="account" class="double">
                                  <cv-icon name="renyuan1" size="24" color="#999" class="img"></cv-icon>
                                <el-input type="user" class="text account" id="tt_user" v-model.trim="ruleForm.account" placeholder="用户名"></el-input>
                            </el-form-item>
                        </div>
                        <div class="item">
                            <el-form-item prop="password" class="double">
                                  <cv-icon name="suo" size="24" color="#999" class="img"></cv-icon>
                                <el-input type="password" class="text passwd" id="pd_pwd" v-model.trim="ruleForm.password" placeholder="密码" autocapitalize="on"></el-input>
                            </el-form-item>
                        </div>
                        <div class="item">
                            <el-form-item  class="language">
                                <el-checkbox v-model="checked" class="rember">记住密码</el-checkbox>
                                    <el-select v-model="ruleForm.language" class="select">
                                    <el-option v-for="option in options" :value="option.value" :key="option.value" :label="option.text">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="item">
                            <el-form-item class="double">
                                <el-button class="but" type="primary" @click="handleSubmit" :loading="loading">登录</el-button>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </div>
         
            </el-col>
        </div>
  </el-row>
  </div>
</template>
<script>
import Vue from "vue";
import { password, service, mycookie, http, COMMON } from "@/utils";

export default {
  data() {
    return {
      user: {
        companyCode: "",
        name: "",
        passWord: ""
      },
      str: "",
      art: [],
      appear: false,
      obj: {},
      obt: {},
      show: false,
      next: [],
      arry: [],
      arr: {},
      blow: [],
      checked: true,
      // 表单数据
      ruleForm: {
        enterpriseCode: "",
        account: "",
        password: "",
        index: Number,
        language: "zh-cn"
      },
      options: [
        { text: "中文", value: "zh-cn" }
        // { text: 'English', value: 'en' },
        // { text: 'Français', value: 'franch' }
      ],
      loading: false,
      loginFlag: false,
      logining: "登录"
    };
  },
  methods: {
    //判断ie9以下版本时
    guffwType() {
      // if(this.$service.isIe()){
      // }
      //         var userAgent = navigator.userAgent
      //         let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
      //         console.log(userAgent+'---------');
      //      if(isIE)
      //          {
      //       var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
      //        reIE.test(userAgent);
      //        var fIEVersion = parseFloat(RegExp["$1"]);
      //        if(fIEVersion < 9)
      //        { return this.$message.error(this.$t('action.typeAss'));}
      //     //IE版本过低
      //    }
    },
    //点击下拉框之外的点关闭下拉框
    disHide() {
      this.show = false;
    },
    //公司编号输入框获焦时判断本地存储中是否有无数据；
    onFocus() {
      if (
        localStorage.getItem("login") != null &&
        localStorage.getItem("login") != "[]"
      ) {
        this.user = JSON.parse(localStorage.getItem("login"));
        this.show = true;
      } else {
        this.show = false;
      }
    },
    //选中下拉框中的某条信息并绑定到文本框中；
    rowChange(row, event) {
      this.ruleForm.enterpriseCode = row.companyCode;
      this.ruleForm.account = row.name;
      this.ruleForm.password = row.passWord;
      this.show = false;
    },
    //调用登录接口
    handleSubmit() {
        // let buttonColor=document.getElementsByClassName('but')[0];
      let params = {
        enterpriseCode: this.ruleForm.enterpriseCode,
        account: this.ruleForm.account,
        password: password.$SHA512(password.$SHA512(this.ruleForm.password)+'&'+this.ruleForm.account), 
        language: this.ruleForm.language
      };
      // password.$SHA512(password.$SHA512(this.ruleForm.password)+'&'+this.ruleForm.account)
      if (this.ruleForm.enterpriseCode == "") {
        this.$message.error("公司编号不能为空");
        return false;
      } else if (this.ruleForm.account == "") {
        this.$message.error("用户名不能为空");
        return false;
      } else if (this.ruleForm.password == "") {
        this.$message.error("密码不能为空");
        return false;
      } else {
        //初次登录时对本地存储中的信息筛选和信息的校验
        this.obj = JSON.parse(localStorage.getItem("login"));
        if (this.obj != null && this.obj != "[]") {
          for (let i = 0; i < this.obj.length; i++) {
            this.arry.push(this.obj[i]);
            for (let j = 0; j < this.arry.length; j++) {
              if (this.arry[j].passWord == this.ruleForm.password) {
                params.password = this.ruleForm.password;
              }
            }
          }
        } else {
          params.password = password.$SHA512(password.$SHA512(this.ruleForm.password)+'&'+this.ruleForm.account);
        }
        this.loading = true;
        this.loginNormalAction(params);
        // this.$store.dispatch('verifySessionStatus').then(mess => {
        //   const {flag } = mess;
        //   if(flag){
        //     this.$router.push("/monitor");
        //   }else{
        //     loginNormalAction(params);
        //   }
        // }).catch(err => {
        //    loginNormalAction(params);
        // })
      }
    },
    loginNormalAction(params){
      this.$store.dispatch("getToken", params).then(data => {
        if (data.flag) {
          this.getValue();
          try {
            this.$store.dispatch("setUser", data.data);
            this.$router.push("/monitor");
          } catch (err) {
            console.log(err);
          }
        } else {
          this.$message.error({
            message: this.$t("error." + data.errorCode)
          });
          this.loading = false;
        }
      });
    },
    getValue() {
      //每次清空之前对象里的数据；
      this.user = {};
      //勾选记住密码的选项
      this.obt = JSON.parse(localStorage.getItem("login"));
      if (this.checked) {
        this.user.companyCode = this.ruleForm.enterpriseCode;
        this.user.name = this.ruleForm.account;
        this.user.passWord = password.$SHA512(password.$SHA512(this.ruleForm.password)+'&'+this.ruleForm.account);
        if (this.obt != null && this.obt != "[]") {
          for (let i = 0; i < this.obt.length; i++) {
            this.blow.push(this.obt[i]);
          }
          for (let j = 0; j < this.blow.length; j++) {
            //当有相同的密码的时候 就不需要加密直接取文本框中选中的值；
            //当存储里的数据在初次未保存密码的时候；再次选中此账号 勾选记住项 这个时候需要将存储里的值重新赋值；
            if (
              this.blow[j].companyCode == this.ruleForm.enterpriseCode &&
              this.blow[j].passWord == ""
            ) {
              this.blow.splice(j, 1);
              localStorage.clear();
              this.blow.push(this.user);
              localStorage.setItem("login", JSON.stringify(this.blow));
            }
            //不相同的密码有两种情况；1，有一个和这个密码相同的 其他的都是不相同的 需要去处理 2，没有一个和这个密码相同的密码
            if (this.ruleForm.password.length > 20) {
              this.user.passWord = this.ruleForm.password;
            } else {
              this.user.passWord = password.$SHA512(password.$SHA512(this.ruleForm.password)+'&'+this.ruleForm.account);
            }
          }
        } else {
          //本地存储的数据是空的是所以每一个输入的密码都需要加密进行保存；
          this.user.passWord = password.$SHA512(password.$SHA512(this.ruleForm.password)+'&'+this.ruleForm.account);
        }
        this.setValue();
        //当没有勾选记住密码的时候 保存时就将密码赋空值；
      } else {
        this.user.companyCode = this.ruleForm.enterpriseCode;
        this.user.name = this.ruleForm.account;
        this.user.passWord = "";
        this.setValue();
      }
    },
    //将登录的信息保存进本地存储中
    setValue() {
      if (localStorage.getItem("login") == null) {
        this.next.push(this.user);
        localStorage.setItem("login", JSON.stringify(this.next));
      } else {
        this.next = JSON.parse(localStorage.getItem("login"));
        this.next.push(this.user);
        this.art = service.unique(this.next, "name", "companyCode");
        localStorage.setItem("login", JSON.stringify(this.art));
      }
    },
    //点击×同时删除下拉表中和本地存储的信息
    remove(scope, $event) {
      let e = $event || window.event;
      window.e ? (window.e.cancelBubble = true) : e.stopPropagation();
      for (let i = 0; i < this.user.length; i++) {
        if (this.user[i] == scope.row) {
          this.user.splice(i, 1);
        }
      }
      if (this.user.length > 0) {
        localStorage.setItem("login", JSON.stringify(this.user));
        this.show = true;
      } else {
        this.ruleForm.enterpriseCode = "";
        this.ruleForm.account = "";
        this.ruleForm.password = "";
        localStorage.removeItem("login");
        this.show = false;
      }
    },
    banBackSpace(event) {
      var ev = event || window.event; //获取event对象
      var obj = ev.target || ev.srcElement; //获取事件源
      var t = obj.type || obj.getAttribute("type"); //获取事件源类型
      //获取作为判断条件的事件类型
      var vReadOnly = obj.getAttribute("readonly");
      var vEnabled = obj.getAttribute("enabled");
      //处理null值情况
      vReadOnly = vReadOnly == null ? false : true;
      vEnabled = vEnabled == null ? true : false;
      //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
      //并且readonly属性为true或enabled属性为false的，则退格键失效
      var flag1 =
        ev.keyCode == 8 &&
        (t == "password" || t == "text" || t == "textarea") &&
        (vReadOnly == true || vEnabled != true)
          ? true
          : false;
      //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
      var flag2 =
        ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea"
          ? true
          : false;
      //判断
      if (flag2) {
        return false;
      }
      if (flag1) {
        return false;
      }
    },
    commingHome(event) {
      // console.log('in')
      let e = event || arguments.callee.caller.arguments[0];
      // let e=event || window.event;
      if (e.keyCode == 13) {
        //阻止在其他界面回车事件的执行
        if (this.$route.path == "/login") {
          this.handleSubmit();
        } else {
          return false;
        }
      } else {
        this.loginFlag = false;
      }
      this.loading = false;
    }
  },
  mounted() {
    //禁止后退键 作用于Firefox、Opera
    document.onkeypress = this.banBackSpace;
    //禁止后退键 作用于IE、Chrome
    document.onkeydown = this.banBackSpace;
    Vue.config.lang = this.ruleForm.language;
    localStorage.setItem("language", this.ruleForm.language);
    // enter事件
    $(document).off("keydown");
    $(document).on("keydown", this.commingHome);
    //this.$myJq.on(document, 'keydown', this.commingHome)
    this.$store.dispatch('verifySessionStatus').then(mess => {
      const {flag, data} = mess;
      flag && this.$router.push("/monitor");
    }).catch(err => {
      this.$router.push("/login");
    })
  },
  watch: {
    "ruleForm.language"(newVal, oldVal) {
      Vue.config.lang = newVal;
      localStorage.setItem("language", newVal);
    },
    "ruleForm.enterpriseCode"(newVal) {
      if (newVal) {
        this.show = false;
      }
    }
  },
  created() {
    this.$service.extend(this.$store.state, JSON.parse(this.$COMMON.store));
    setTimeout(_ => {
      this.$store.dispatch("getAsyncNodes", []);
    });
  }
};
</script>
<style lang='scss'>
$loginH:3em;
input::-ms-clear,
::-ms-reveal {
  display: none;
}
     .el-select-dropdown__item.selected.hover{
              color:#9f9f9f;
               background-color:#fff;
          }
          .el-select-dropdown__item.selected{
                color:#9f9f9f;
                 background-color:#fff;
          }
.hot {
  width: 100%;
  height:100%;
  padding:0;
  margin: 0;
  position: absolute;
  // background: url("../../assets/img/login/newLogin.png") no-repeat;
  background:url("../../assets/img/login/newLogin.png");
background-size:cover;
background-repeat:no-repeat;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  .clod {
    width: 100%;
    height: 50%;
    position: relative;
  top: 300px;
    .people {
      position: relative;
      top: 25%;
    }
  @media screen and (min-width: 900px) {
    .people {
      top: 10px;
    }
  }
  @media screen and (min-width: 1024px) {
    .people {
      top: 10px;
    }
  }
  @media screen and (min-width: 1280px) {
    .people {
      top: 10px;
    }
  }
  @media screen and (min-width: 1366px) {
    .people {
      top: 10px;
    }
  }
  @media screen and (min-width: 1440px) {
    .people {
      top: 50px;
    }
  }
  @media screen and (min-width: 1680px) {
    .people {
      top: 65px;
    }
  }
  @media screen and (min-width: 1920px) {
    .people {
      top: 85px;
    }

  }

  }

  .login {
    width: 50%;
    position: relative;
    z-index:999;
    left: 50px;
  

  }
  @media screen and (min-width: 900px) {
    .login {
      top: -10px;
    }
  }
  @media screen and (min-width: 1024px) {
    .login {
      top: -5px;
    }
  }
  @media screen and (min-width: 1280px) {
    .login {
      top: 5px;
    }
  }
  @media screen and (min-width: 1366px) {
    .login {
      top: 10px;
    }
  }
  @media screen and (min-width: 1440px) {
    .login {
      top: 50px;
    }
  }
  @media screen and (min-width: 1680px){
    .login {
      top: 65px;
    }
  }
  @media screen and (min-width: 1920px) {
    .login {
      top: 85px;
    }
  }
  .upDown {
    position: absolute;
    width: 100%;
    height: 100%;
    max-width: 419px;
    max-height: 420px;
    min-height: 250px;
    min-width: 300px;
    .image {
      width: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    border-radius: 5px;
    text-align: center;
    .mvp {
      font-family: PingFangSC-Regular;
      text-align: center;
      border-radius: 5px 5px 0 0;
      font-size: 36px;
      line-height: 50px;
      color: #fff;
      margin-bottom:20px;
  
    }
    .form {
      width: 100%;
      height: 135%;
      right: 5%;
      top:-35%;
      border-radius:5px;
      padding: 10px 35px;
      position: absolute;
      text-align: center;
      background: -webkit-linear-gradient(left top, rgba(255,255,255,0.6), rgba(255,255,255,0.3)); 
      background: -o-linear-gradient(bottom right, rgba(255,255,255,0.6), rgba(255,255,255,0.3)); 
      background: -moz-linear-gradient(bottom right, rgba(255,255,255,0.6), rgba(255,255,255,0.3)); 
      background: linear-gradient(to bottom right, rgba(255,255,255,0.6) , rgba(255,255,255,0.3)); 
      .el-form-item__error {
        color: #ff3030;
      }
      .double {
        margin-top: -10px;
        position: relative;
        .img {
          position: absolute;
          z-index: 996;
          left:14px;
          top: 10px;
          // padding-right:14px;
          border-right:1px solid #9f9f9f;
        }
        .el-button {
          font-weight:200;
          background: #f5a623;
          border-radius: 3px;
          width:100%;
          height: 48px;
          font-size:18px;
          position: relative;
          z-index: 998;
          margin-bottom: 15px !important;
        }
        .el-button--primary {
          border-color: #f5a623;
        }
 
      }
      .item {
        width: 100%;
        .language {
          width: 100%;
          .select {
            color: #9f9f9f;
            margin-left: 16%;
            width: 36%;
            input {
            font-weight: 400;
            color: #9f9f9f;
            border: 1px solid #9f9f9f;
            background-color:#fff;
            }
     
          }
          .rember {
            color: #fff;
            width: 66%;
            margin-left: -20%;
          }
        }
        .account {
          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #fff inset;
            -webkit-text-fill-color: #9f9f9f;
          
          }
        }
        .passwd {
          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #fff inset;
            -webkit-text-fill-color: #9f9f9f;
            -webkit-background-composite: url("../../assets/img/login/password.png")
              no-repeat left;
          }
        }
        .text {
          width: 100%;
          input::-webkit-input-placeholder {
            color: #999;
            font-size: 16px;
            font-weight: 300;

          }
          input::-moz-placeholder {
            color: #999;
            font-size: 16px;
            font-weight: 300;
          }
          input::-ms-input-placeholder {
            color: #999;
            font-size: 16px;
            font-weight: 300;
          }
          input {
            height: $loginH;
            width: 100%;
            border: none;
            font-size: 1em;
            border-radius: 5px;
            padding-left: 68px;
            border: 1px solid #9f9f9f;
          }
        }
        .hold {
          position: relative;
        }
        .show {
          height: 184px;
          animation: move 0.1s;
          @keyframes move {
            0% {
              height: 46px;
            }
            50% {
              height: 92px;
            }
            75% {
              height: 138px;
            }
            100% {
              height: 184px;
            }
          }
          width: 82%;
          position: absolute;
          left: 8.5%;
          background: #fff;
          z-index: 999;
          overflow-x: hidden;
          border-radius: 5px;
          font-size: 1em;
          border: 1px solid #9f9f9f;

          .cell {
            color: #9f9f9f;
          }
          .clear {
            cursor: pointer;
          }
        }
      }
    }
  }
}

</style>
