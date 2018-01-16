<template>
	<div class="localCar">
		<el-form :model="dialog.form" :rules="rules" ref="form" label-width="100px" v-show="!dialog.moreErect">
			<el-form-item label="" style="line-height:24px">
				<span style="color:#000;font-size:16px;font-weight:700;position:relative;left:-85px;top:-10px">{{vaule2}}</span>
			</el-form-item>
			<el-form-item prop="" label="" v-if="!$store.getters.isShowCar">
				<el-radio-group v-model="dialog.form.result" @change="checkAbility()" v-if="isAblitly">
					<el-radio v-for="item in itemList" :key="item.type" :label="item.type">{{item.name}}</el-radio>
				</el-radio-group>
				<p v-if="!isAblitly">该车辆无车辆限制的能力，请联系管理员设置</p>
			</el-form-item>
			<div v-if="$store.getters.isShowCar" class="short">
				<el-form-item label="所属公司:" v-if="$store.getters.isShowCar">
					<el-input v-model="$store.getters.isAllInfo.enterpriseName" disabled="disabled"></el-input>
				</el-form-item>
				<el-form-item label="锁车人员:" v-if="$store.getters.isShowCar">
					<el-input v-model="$store.getters.isAllInfo.userName" disabled="disabled"></el-input>
				</el-form-item>
				<el-form-item label="限制类型:" v-if="$store.getters.isShowCar">
					<el-input v-model="dialog.form.ablitly" disabled="disabled"></el-input>
				</el-form-item>
				<el-form-item label="手机号码:" v-if="$store.getters.isShowCar">
					<el-input v-model="$store.getters.isAllInfo.mobilePhone" disabled="disabled"></el-input>
				</el-form-item>
				<el-form-item label=" 锁车原因:" v-if="$store.getters.isShowCar">
					<el-input v-model="$store.getters.isAllInfo.reason" disabled="disabled"></el-input>
				</el-form-item>
			</div>
			<el-form-item :class="[$store.getters.isShowCar?'':'beTop']" >
				<el-button type="primary" @click="cancel()" class="confirm">上一步</el-button>
				<el-button type="primary" @click="localCarNext()" class="cancel" v-show="isAblitly">下一步</el-button>
				<el-button type="primary" @click="localColsed()" class="cancel" v-show="!isAblitly">关闭</el-button>
			</el-form-item>
		</el-form>
		<div v-show="dialog.moreErect">
			<engine-car :data="dialog"></engine-car>
		</div>
	</div>
</template>

<script>
import engineCar from "./engineCar.vue";
import { http, COMMON } from "@/utils";
export default {
  components: {
    engineCar
  },
  props: {
    data: {}
  },
  data() {
    return {
      isAblitly: Boolean,
      dialog: {
        moreErect: false,
        flag: false,
        form: {
          result: "",
          ablitly: "断油"
        },
        active: ""
      },
      vaule2: "",
      itemList: [],
      rules: {}
    };
  },
  methods: {
    cancel() {
      this.data.btnClick = false;
      this.data.active = 1;
    },
    checkAbility() {
      // console.log(this.dialog.form.result);
    },
    //下一步操作
    localCarNext() {
      if (this.$store.getters.isShowCar) {
        this.dialog.moreErect = true;
        this.data.active = 3;
      } else {
        if (this.dialog.form.result != "") {
          this.dialog.moreErect = true;
          this.data.active = 3;
        } else {
          return this.$message.error("请选择一项进行操作");
        }
      }
    },

    //步骤二的能力项获取与匹配
    showAblity(value) {
      let art = [];
      art = this.data.ablitly.split(",");
      art.forEach((ele, index) => {
        switch (ele) {
          // case '5':
          // 	this.itemList.push({
          // 		name: '车斗举升', type: '5',
          // 	});

          // 	break;
          // case '4':
          // 	this.itemList.push({
          // 		name: '顶盖开启', type: '4',

          // 	});

          // 	break;
          // case '2':
          // 	this.itemList.push({
          // 		name: '承重状态', type: '2',

          // 	});
          // 	break;
          // case '3':
          // 	this.itemList.push({
          // 		name:'速度',type:'3'
          // 	})
          // break;
          // case '6':
          // 	this.itemList.push({
          //         name:'发动机转速限制',type:'6'
          // 	})
          // break;
          case "7":
            this.itemList.push({
              name: "断油",
              type: "7"
            });
            break;
          // case '8':
          // 	this.itemList.push({
          // 		name:'发动机停止工作',type:'8'
          // 	})
          // break;
        }
      });
    },
    getAblityS() {
      // let arr = this.data.ablitly.split(",");
      // arr.forEach((ele, index) => {
      //   let that = this;
      //   if (ele == "7") {
      //     that.isAblitly = false;
      //     that.itemList.push({
      //       name: "断油",
      //       type: "7"
      //     });
      //   } else {
      //     that.isAblitly = true;
      //   }
      // });
      let str=this.data.ablitly;
      if(str.indexOf('7')==-1&&this.$store.getters.isShowCar==false){
          this.isAblitly=false
      }else{
          this.isAblitly = true;
          this.itemList.push({
            name: "断油",
            type: "7"
          });
      }
    },
    localColsed() {
      this.$parent.$parent.$parent.dialog.flag = false;
    }
  },
  mounted() {
    // (this.data.ablitly==null&&this.data.ablitly=='')?this.isAblitly=true:this.isAblitly=false;

    this.getAblityS();
  },
  watch: {
    "data.ablitly"(newVal) {
      this.getAblityS();
    },
    "dialog.form.result"(newVal) {
      if (newVal) {
        this.$store.dispatch("isLocalCar", newVal);
      }
    },
    "data.flag"(newVal) {
      this.dialog.flag = newVal;
    }
  }
};
</script>

<style lang="scss">
.localCar {
  padding: 0 20px 10px 20px;
  width: 560px;
  height: 300px;
  position: absolute;
  background: #fff;
  top: 105px;
  z-index: 2;
  left: 0;
  overflow: hidden;

  .el-radio__label {
    padding: 0 150px 0 30px;
    font-size: 16px;
  }
  .el-radio__inner {
    box-sizing: inherit;
    margin-bottom: 3px;
  }
  .el-radio-group .el-radio {
    font-size: 16px;
  }
  .beTop {
    margin-top: 100px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .cancel {
    position: relative;
    left: 95px;
    width: 150px;
  }
  .confirm {
    width: 150px;
  }
  // .footer1{
  // 		position:relative;
  // 		bottom:-15px;
  // }
  .short {
    width: 512px;
  }
}
</style>
