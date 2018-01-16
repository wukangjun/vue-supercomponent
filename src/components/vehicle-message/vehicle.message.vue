<template>
	<div class="cv-vehicle-msg">
		<el-badge class="iconBtn" @click.native="toggle">
			<cv-icon :name="$store.getters.isMonitorOrTrack?'chart':'cheliangguanli'" scale="1.5" class="iconn"></cv-icon>
		</el-badge>
		<transition name="fade">
			<div class="vehicleMess" v-show="isShow.flag">
				<div class="messTool">
					<div class="plateCode">
						<div class="pColor" :style="{borderColor:this.$filter.plateCodeColor1(data.plateColor)}">
							<div class="inColor" :style="{backgroundColor:this.$filter.plateCodeColor1(data.plateColor),color:data.plateColor == 4?'black':'#fff' }">
								{{data.plateCode|| '--'}}
							</div>
						</div>
						<cv-span size="small" :style="{color:this.$filter.locationStatus(data.locateStatus,false),cursor:'default'}">{{this.$filter.locationStatus(data.locateStatus,true)}}</cv-span>
					</div>
					<div class="commond" v-show='isSend'>
						<el-select class="c-select" v-model="commond" placeholder="指令下发" size="small" @visible-change="commonClear" @change="commondChange">
							<el-option v-for="commond in commondList" :label="commond.name" :key="commond.id" :value="commond.value"></el-option>
						</el-select>
					</div>
					<div class="btnGroup">
						<el-tooltip :enterable="false" v-for="btn in btnList" :key="btn.text" :content="btn.text" placement="bottom" effect="light" @click.native="switchFn(btn.key)">
							<el-button size="small" style="height:30px;margin-left:5px;" :disabled="btn.disabled">
								<cv-icon :name="btn.name" size="12"></cv-icon>
							</el-button>
					  </el-tooltip>
					</div>
          <cv-icon name="remove" color="#fff" style="float:right" @click.native="isShow.flag=false"></cv-icon>
				</div>
        <cv-scrollbar style="height:170px;">
          <basic class="messBase" :basicInfo="data"></basic>
        </cv-scrollbar>
				<div class="messTab">
					<!-- tab页签 -->
					<el-tabs class="tabClass" v-model="tabActive">
  					<!-- tab内容 -->
  					<el-tab-pane v-for="tab in tabs" :label="tab.title" :name="tab.name" :key="tab.id" >
  						<cv-scrollbar style="height:100px;">
  							<component :is="tab.name" :detailInfo="data"></component>
  						</cv-scrollbar>
  					</el-tab-pane>
					</el-tabs>
				</div>
			</div>
		</transition>
		<!-- 指令弹框 -->
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog"></component>
		</el-dialog>
	</div>
</template>

<script>
import basic from "./modules/base.vue";
import car from "./modules/car.vue";
import canInfo from "./modules/canInfo.vue";
import electric from "./modules/electric.vue";
import sensor from "./modules/sensor.vue";
import singleCamera from "./dialogCommand/singleCamera.vue";
import multiCamera from "./dialogCommand/multiCamera.vue";
import localCar from "./isLocalCar/localCar.vue";
import localCarPassword from "./isLocalCar/localCarPassword.vue";
import engineCar from "./isLocalCar/engineCar.vue";
import filter from "@/utils/filter";
import rollCall from "@/components/instruction/model/rollCall/roll-call";
import { http, COMMON } from "@/utils";
export default {
  components: {
    basic,
    car,
    electric,
    sensor,
    singleCamera,
    multiCamera,
    localCar,
    localCarPassword,
    engineCar,
    canInfo,
    rollCall
  },
  props: {
    isShow: {
      default() {
        return {
          flag: false
        };
      }
    },
    isSend: {
      type: Boolean,
      default: true
    },
    data: {}
  },
  data() {
    return {
      locaCarPower:false,
      btnList: [
        // { name: "vehicle", text: "单车", key: "single", disabled: true },
        { name: "aguiji", text: "轨迹回放", key: "track", disabled: false },
        { name: "bofang", text: "视频", key: "vedio", disabled: false }
      ],
      tabs: [
        { title: "车辆信息", name: "car", id: "one" },
        { title: "传感器", name: "sensor", id: "second" },
        { title: "电气信号", name: "electric", id: "third" },
        { title: "实时CAN信息", name: "canInfo", id: "fourth" }
      ],
      tabActive: "car",
      commondList: [
        {
          name: this.$store.getters.isShowCar ? "解除限制" : "限制",
          id: "1",
          value: "1"
        },
        { name: "单车拍照", id: "2", value: "2" },
        { name: "点名", id: "3", value: "3" }
      ],
      commond: "",
      dialog: {
        title: "--",
        flag: false,
        name: "",
        size: "dialog-tiny",
        infoAll: {}
      }
    };
  },
  methods: {
    //车牌过滤
    filterPlateCode(plateCode) {
      if (plateCode) return plateCode.replace(/(.{2})/, "$1·");
    },
    //根据车牌改变颜色
    changeColor(plateColor) {
      switch (plateColor) {
        case "1":
          return "blue";
        case "2":
          return "yellow";
        case "3":
          return "black";
        case "4":
          return "white";
        case "5":
          return "green";
        case "9":
          return "";
        default:
          return "blue";
      }
    },
    //面板显隐
    toggle() {
      this.isShow.flag = !this.isShow.flag;
    },
    //功能跳转
    switchFn(name) {
      switch (name) {
        case "single-camera":
          return this.singleCamera();
        case "vedio":
          return this.jumpVedio();
        case "track":
          return this.jumpTrack();
        case "baojing":
          return this.baojing();
      }
    },
    commonClear(val) {
      val && (this.commond = "");
    },
    //指令
    commondChange(val) {
      switch (val) {
        case "1":
          this.localCar();
          break;
        case "2":
          this.singleCamera();
          break;
        case "3":
          this.rollCall();
          break;
        default:
          break;
      }
    },
    // 单车拍照指令
    singleCamera() {
      // 弹框显示设置
      if (this.data.vehicleId) {
        this.dialog.flag = true;
        this.dialog.size = "dialog-tiny";
        this.dialog.name = "singleCamera";
        this.dialog.title = `单车拍照(${this.data.plateCode})`;
      } else {
        this.$message.error("请选择有位置信息的车辆");
      }
    },
    // 多车拍照指令
    multiCamera() {
      // 弹框显示设置
      if (this.data.vehicleId) {
        this.dialog.flag = true;
        this.dialog.size = "dialog-tiny";
        this.dialog.name = "multiCamera";
        this.dialog.title = `单车拍照(${this.data.plateCode})`;
      } else {
        this.$message.error("请选择有位置信息的车辆");
      }
    },
    // 点名
    rollCall() {
      // 弹框显示设置
      if (this.data.vehicleId) {
        this.dialog.flag = true;
        this.dialog.size = "dialog-tiny";
        this.dialog.name = "rollCall";
        this.dialog.title = `点名(${this.data.plateCode})`;
        this.dialog.id = this.data.vehicleId;
      } else {
        this.$message.error("请选择有位置信息的车辆");
      }
    },
    //报警指令
    baojing() {},
    isUserPower(){
        this.$http({
        url: COMMON.baseUrl + "/lockCar/hasPerm",
        method: "POST"
      }).then(data => {
        if (data.flag) {
          this.locaCarPower=true;
        }else{
           this.locaCarPower=false;
            this.$message.error({
                message: this.$t("error." + data.errorCode)
              }); 
        }
      });

    },
    // 锁车指令
  localCar() { 
    this.isUserPower()
    if(this.locaCarPower){
      if (this.data.vehicleId){  
        this.dialog.flag = true;
        this.dialog.size = "dialog-small";
        this.dialog.name = "localCarPassword";
        this.dialog.title = this.$store.getters.isShowCar
          ? `解除限制(${this.data.plateCode})`
          : `限制车辆(${this.data.plateCode})`;
      } else {
        this.$message.error("请选择车辆");
      }
      }
      else{
        return false;
      
      }  
    },
    // 跳转视频页面
    jumpVedio() {
      if (this.data.vehicleId) {
        this.$store.dispatch("getVideoLogin", this.data.vehicleId);
      } else {
        this.$message.error("请选择车辆");
      }
    },
    // 跳转历史轨迹
    jumpTrack() {
      let vehicleId = this.data.vehicleId,
        plateCode = this.data.plateCode;
      if (vehicleId) {
        let winParams = this.$service.winParams("/monitor/historyTrack", {
          id: vehicleId,
          plateCode: plateCode
        });
        this.$service.winOpen(winParams);
      } else {
        this.$message.error("请选择车辆");
      }
    },
    //锁车状态判断
    isCarStatus(id) {
      let params = {
        vehicleId: id
      };
      this.$http({
        url: COMMON.baseUrl + "/lockCar/queryStatus",
        method: "POST",
        params: params
      }).then(data => {
        if (data.flag) {
          if (data.data == "0") {
            this.$store.dispatch("isShowCar", false);
          } else {
            this.$store.dispatch("isShowCar", true);
          }
        } else {
        }
      });
    },
    //解除限制时的所有更改数据的接口调用
    freeLocal() {
      let params = {
        vehicleId: this.data.vehicleId
      };
      this.$http({
        url: COMMON.baseUrl + "/lockCar/findOne",
        method: "POST",
        params: params
      }).then(data => {
        let _self = this;
        if (data.flag) {
          _self.$store.dispatch("isAllInfo", data.data);
        } else {
          return false;
        }
      });
    }
  },
  mounted(){ },
  watch: {
    "isShow.flag"(newVal) {
      !newVal && (this.commond = "");
    },
    "$store.getters.isPopover"(newVal) {
      if (newVal && this.$store.getters.isMonitorOrTrack) {
        setTimeout(_ => {
          this.trackStateChart();
        }, 0);
      }
    },
    "$store.getters.isShowCar"(newVal) {
      if (newVal) {
        this.freeLocal();
        this.commondList[0].name = "解除限制";
      } else {
        this.commondList[0].name = "限制";
      }
    },
    "$store.getters.isMonitorOrTrack"(newVal) {
      !newVal && (this.name = "");
      newVal && (this.name = "echart");
    },
    "$store.getters.carCurrent.vehicleId"(newVal) {
      this.isCarStatus(newVal);
      let index = this.$store.state["multiCar"].carList.findIndex(val => {
        return val.id == newVal;
      });
      this.scrollbarTop = index * 41;
    }
  }
};
</script>

<style lang="scss">
$propW: 440px;
$size: 40px;
$pWidth: 85px;
$height: 250px;
$color: #fff;
$blue: #20a0ff;
$titleH: 40px;
$shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
.el-select-dropdown {
  width: 105px;
}
.cv-vehicle-msg {
  position: absolute;
  right: 0px;
  top: 2px;

  @keyframes bounce-in {
    0% {
      transform: scale(0);
      transform-origin: top right;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
  .fade-enter-active {
    animation: bounce-in 0.4s;
  }
  .fade-leave-active {
    animation: bounce-in 0.4s reverse;
  }
  .iconBtn {
    position: absolute;
    right: 0px;
    width: $size;
    height: $size;
    border-radius: $size/2;
    background: rgba(0, 0, 0, 0.7);
    line-height: $size;
    text-align: center;
    margin: 10px;
    cursor: pointer;
    box-shadow: $shadow;
    .el-badge__content.is-fixed {
      top: 2px;
      right: 15px;
    }
    .iconn {
      color: #fff;
      padding: 7px 9px;
    }
  }
  .vehicleMess {
    width: $propW;
    min-height: 260px;
    position: absolute;
    right: 7px;
    top: 60px;
    box-shadow: $shadow;
    padding: 5px;
    background-color: rgba(0, 0, 0, 0.7);
    .messTool {
      width: 100%;
      background-size: border-box;
      .plateCode {
        border: 1px solid #ccc;
      }
      .plateCode,
      .commond {
        display: inline-block;
        box-sizing: border-box;
        background-color: #fff;
        .pColor {
          display: inline-block;
          height: 25px;
          border-radius: 5px;
          border: 1px solid #2b62d0;
          margin: 1px 0px 1px 8px;
          .inColor {
            width: $pWidth;
            text-align: center;
            background-color: #2b62d0;
            color: #fff;
            height: 21px;
            line-height: 21px;
            margin: 2px;
            border-radius: 3px;
            padding: 0 10px;
          }
        }
        .c-select {
          width: 105px;
          .el-input__inner {
            border-radius: 0;
          }
        }
        .linkTo {
          width: 70px;
        }
      }
      .plateCode {
        width: 170px;
        text-align: center;
      }
      .btnGroup {
        display: inline-block;
        .el-button {
          width: 38px;
          padding: 9px 0;
        }
        .el-button:first-child {
          margin-left: 3px;
        }
      }
    }
    .messBase {
      background-color: #fff;
      margin-top: 5px;
      padding: 10px;
    }
    .messTab {
      margin-top: 5px;
      .el-tabs__header {
        margin-bottom: 0px;
      }
      .el-tabs__content {
        background-color: #fff;
        padding: 10px;
      }
      .el-tabs__item {
        height: 32px;
        line-height: 32px;
      }
      .el-tabs__item.is-active {
        background-color: #fff;
      }
      .el-tabs__item:hover {
        color: #20a0ff;
      }
    }
  }
}
</style>