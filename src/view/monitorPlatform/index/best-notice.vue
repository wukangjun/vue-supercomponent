<template>
    <div id="body" v-show="boxShowFlag&&hent">
        <div class="head">
            提示时间
             <el-select v-model="value" clearable :placeholder="$t('terminal.placeholder')" size='small' id="change"  style="width:120px;height:20px;">
				<el-option v-for="item in filterTime" :key="item.id" :label="item.label" :value="item.id" >
			    </el-option>
			</el-select>
        <a @click="confirm" class="confirm">{{$t('action.confirm')}}</a>
        <cv-icon name="remove" 
        color="#fff"
        @click.native="boxShowFlag=false" 
        style="float:right;margin-top:7px"></cv-icon>
        </div>
        <el-row class="notice-header">
            <el-col :span="8" class="notice-item" 
            :class="[currentName=='serious'?'noticeOn':'']"
            @click.native="chnageTablePage('serious')">
                紧急报警
            	<el-badge :value="serNum" :max="99" style="cursor:pointer"></el-badge>
            </el-col>
            <el-col :span="8" class="notice-item" 
            :class="[currentName=='intermediate'?'noticeOn':'']"
            @click.native="chnageTablePage('intermediate')">
                中级报警
            	<el-badge :value="intNum" :max="99" style="cursor:pointer"></el-badge>
            </el-col>
            <el-col :span="8" class="notice-item" 
            :class="[currentName=='ordinary'?'noticeOn':'']"
            @click.native="chnageTablePage('ordinary')">
                一般报警
            	<el-badge :value="ordNum" :max="99" style="cursor:pointer"></el-badge>	
            </el-col>
        </el-row>
        <el-row class="notice-table-head" style="background:#dfe6ec">
            <el-col :span="5" class="notice-item">车牌号</el-col>
            <el-col :span="5" class="notice-item">报警类型</el-col>
            <el-col :span="5" class="notice-item">信息内容</el-col>
            <el-col :span="5" class="notice-item">报警时间</el-col>
            <el-col :span="4" class="notice-item">操作</el-col>
        </el-row>
        <cv-scrollbar class="notice-table-body" style="height:130px">
            <el-row 
            :key="data"
            class="notice-table-body" 
            v-for="data in currentData">
                <el-col 
                :span="5" class="notice-item"
                @mouseenter.native="tooltipContent=mouseenterShowTip($event, 'tooltip')"
                @mouseleave.native="mouseoverHideTip('tooltip')">{{data.plateCode}}</el-col>
                <el-col 
                :span="5" class="notice-item"
                @mouseenter.native="tooltipContent=mouseenterShowTip($event, 'tooltip')"
                @mouseleave.native="mouseoverHideTip('tooltip')">{{data.alarmTypeName}}</el-col>
                <el-col 
                :span="5" class="notice-item"
                @mouseenter.native="tooltipContent=mouseenterShowTip($event, 'tooltip')"
                @mouseleave.native="mouseoverHideTip('tooltip')">{{data.messageText}}</el-col>
                <el-col 
                :span="5" class="notice-item"
                @mouseenter.native="tooltipContent=mouseenterShowTip($event, 'tooltip')"
                @mouseleave.native="mouseoverHideTip('tooltip')">{{data.time}}</el-col>
                <el-col :span="4" class="notice-item">
                    <cv-span 
                    type="success"
                    v-loading="data.loadFlag?true:false"
                    v-show="data.action=='1'?true:false"
                    @click.native="handelEvent(data)">确认</cv-span>
                </el-col>
            </el-row>
            <el-tooltip 
				:content="tooltipContent" 
				placement="top" 
				ref="tooltip" 
				effect="light"></el-tooltip>
        </cv-scrollbar>   
      <audio autoplay="autoplay"  v-if="isAudio"
      loop        
    src="http://test.cvtsp.com/msg.mp3">
</audio>
    </div>
</template>

<script>
import common from "@/utils/mixins/common";
export default {
  mixins: [common],
  data() {
    return {
      //查岗dialog
      // dialog:{
      //     flag:false,
      //     title:'查岗应答',
      //     size:'dialog-small',
      //     name:'inspectAnswer',
      //     mess:{}
      // },
      // 显示当前的列表中的内容信息
      isAudio: false,
      tooltipContent: "",
      currentData: [],
      currentName: "ordinary",
      boxShowFlag: false,
      showtimer: 10000,
      filterTime: [
        { id: 1, label: "15秒" },
        { id: 2, label: "30秒" },
        { id: 3, label: "10分钟" },
        { id: 4, label: "暂时关闭" }
      ],
      data: {},
      value: 4,
      waring: true,
      closeLong: false,
      cont: 1,
      show: true,
      hent: false,
      music: false,
      isActive: false,
      timeInterval: null,
      laterTime: null,
      activeName: "third",
      serNum: 0,
      intNum: 0,
      ordNum: 0,
      onlineNum: 0,
      //定义报警类型的初始值
      serious: [],
      intermediate: [],
      ordinary: [],
      //表格内部显示字段
      plateCode: "",
      alarmTypeId: "",
      gpsdeep: "",
      deep: "",
      time: "",
      socket: null,
      alarmNum: 0,
      directive: [],
      online: [],
      //数据
      nameS: "",
      data1: [],
      data2: [],
      data3: []
    };
  },
  methods: {
    chnageTablePage(name) {
      this.currentData = [];
      switch (name) {
        case "serious":
          this.currentData = this.serious;
          this.currentName = "serious";
          break;
        case "intermediate":
          this.currentData = this.intermediate;
          this.currentName = "intermediate";
          break;
        case "ordinary":
          this.currentData = this.ordinary;
          this.currentName = "ordinary";
          break;
      }
    },
    async handelEvent(result) {
      const params = {
        sim: result.simCode,
        serialNumber: result.serialNumber,
        alarmTypeId: result.alarmTypeId
      };
      result.loadFlag = true;
      const { data, flag } = await this.$http({
        url: this.$COMMON.baseUrl + "/sendOrder/alarmSingleNotarize",
        params: params
      });
      result.loadFlag = false;
      flag
        ? this.$message.success(this.$t("action.noticeSuccess"))
        : this.$message.error(this.$t("action.noticeFail"));
    },
    confirm() {
      switch (this.value) {
        case 1:
          return this.timeShow();
        case 2:
          return this.longShow();
        case 3:
          return this.tenShow();
        case 4:
          return this.closed();
      }
    },
    clearInterval() {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    },
    closed() {
      this.createDom();
      this.closeLong = true;
      this.clearInterval();
    },
    controncl(time) {
      this.clearInterval();
      this.createDom();
      this.timeInterval = setInterval(() => {
        this.domShow();
      }, time);
    },
    timeShow() {
      this.controncl(15000);
    },
    longShow() {
      this.controncl(30000);
    },
    tenShow() {
      this.controncl(600000);
    },
    getIndex(id) {
      let commands = this.directive;
      for (let i = 0; i < commands.length; i++) {
        if (commands[i].id == id) {
          return { flag: true, index: i };
        }
      }
      return { flag: false, index: -1 };
    },
    domShow() {
      this.boxShowFlag = true;
    },
    createDom() {
      this.boxShowFlag = false;
    },
    arrSplice(arr, data) {
      if (arr.length <= 50) {
        arr.unshift(data);
      } else {
        arr.unshift(data);
        arr.pop();
        return arr;
      }
    },
    outTime() {
      let token = localStorage.getItem("token"); //登录之后,取token的值
      let user = localStorage.getItem("user");
      if (user == "" || user == null) {
        return false;
      }
      let userId = JSON.parse(user).id.toString();
      if (token) {
        let socket = io(this.$COMMON.socketUrl, {
          query: {
            token: token,
            userId: userId
          }
        });
        socket.on("connect", function() {
          console.log("连上了");
        });
        //到时候改回t1暂时用A来测试；
        socket.on("t1", mess => {
      
          let data = null;
          if (typeof mess === "string") {
            data = JSON.parse(mess);
          } else {
            data = mess;
          }
          // console.log(JSON.stringify(data));
          if (this.boxShowFlag) {
            switch (data.alarmLevel) {
              case "0":
              this.hent = true;
                this.serNum++;
                this.arrSplice(this.serious, data);
                break;
              case "1":
              this.hent = true;
                this.intNum++;
                this.arrSplice(this.intermediate, data);
                break;
              case "2":
              this.hent = true;
                this.ordNum++;
                this.arrSplice(this.ordinary, data);
                break;
            }
          }
          switch (data.msgType) {
            case "W":
             this.hent = true;
              this.directive.unshift(data);
              this.$store.dispatch("addDirective", this.directive);
              break;
            // 上下线统计
            case "O":
             this.hent = true;
              this.onlineNum++;
              this.$store.dispatch("onlineList", data);
              this.$store.dispatch("onlineNub", this.onlineNum);
              break;
            // 企业和车组
            case "ENTERPRISE_FLEET_MSG":
              return this.$store.dispatch("socketIsManage", data);
            // 车辆
            case "VehicleMsg":
              return this.$store.dispatch("socketIsVehicle", data);
            // 关注车辆
            case "attentionMsg":
              return this.$store.dispatch("isAttention", data);
          }
        });
        socket.on("s1", mess => {
          this.$store.dispatch("socketInspector", mess);
  
        });
        socket.on("disconnect", data => {
          console.log("连接断开");
        });
        return (this.socket = socket);
      }
    }
  },
  mounted() {
    this.outTime();
    this.boxShowFlag = true;
    this.currentData = this.ordinary;
    // setTimeout(_ => {
    // this.boxShowFlag = true;
    // this.currentData = this.ordinary;
    // }, this.showtimer);
  },
  destroyed() {
    this.timeInterval &&
      (clearInterval(this.timeInterval), (this.timeInterval = null));
    this.socket && this.socket.disconnect();
  },
  watch: {
    boxShowFlag(newVal) {
      if (newVal) {
        this.isAudio = true;
      } else {
        this.isAudio = false;
      }
    }
  }
};
</script>

<style lang="scss">
#body {
  font-family: "微软雅黑";
  background: #fff;
  position: fixed;
  z-index: 2001;
  right: 10px;
  bottom: 10px;
  width: 400px;
  box-shadow: 2px 2px 2px #eee;
  .noticeOn {
    border-bottom: 2px solid #20a0ff;
  }
  .notice-item {
    text-align: center;
    height: 30px;
    line-height: 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .el-tabs__header {
    margin: 0;
  }
  .el-checkbox-button__original,
  .el-pagination--small .arrow.disabled,
  .el-table .hidden-columns,
  .el-table td.is-hidden > *,
  .el-table th.is-hidden > *,
  .el-table--hidden {
    visibility: visible !important;
  }
  .el-table thead {
    width: 100%;
  }
  .el-table__body-wrapper {
    overflow-x: hidden;
  }
  .head {
    background: #f7ba2a;
    height: 30px;
    padding: 5px 20px;
  }
  .right {
    margin-left: 300px;
    cursor: pointer;
  }
  #chang {
    position: absolute;
    z-index: 999;
  }
  .el-table__body,
  .el-table__header {
    width: 489px !important;
  }

  .confirm {
    width: 40px;
    height: 30px;
    cursor: pointer;
  }
  .time {
    display: inline-block;
    margin-left: 20px;
    height: 30px;
    width: 40px;
    font-size: 28px;
  }
  .later {
    position: absolute;
    left: 200px;
  }
  .show {
    cursor: pointer;
    margin-left: 400px;
  }
  .closed {
    cursor: pointer;
  }
}
//cesh
</style>

