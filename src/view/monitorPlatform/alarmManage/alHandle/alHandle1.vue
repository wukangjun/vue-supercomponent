<template>
    <div class="main">
        <!-- 左侧列表数据显示 -->
        <div class="left" style="float:left;margin-top:9px;position:relative;z-index:1000">  
          
		<el-form :inline="true" style="padding-left:10px">
         <el-form-item label="报警类型:">
				<dropdown-tree style="display:inline-block;" :isCheck="true" :interface="$COMMON.baseUrl+'/alarmInfo/frinAlarmTypeInfoList.do'" :show-checkbox="true" @checked="checked" @allAlarmType="allAlarmType"></dropdown-tree>
			</el-form-item>
           <el-form-item label="处理状态:">
                    <el-select  v-model="dataType" size='small'>
                        <el-option v-for="item in type" :key="item.id" :value='item.id' :label="item.name"></el-option>
                    </el-select>
           </el-form-item>
            <el-form-item label="时间范围:" v-if="show">
                    <el-select  v-model="timeType" size='small'>
                        <el-option v-for="list in timeList" :key="list.id" :value='list.id' :label="list.name"></el-option>
                    </el-select>
           </el-form-item>
		    <el-form-item label="选择时间:" v-if="!show">
                <el-date-picker class="picker" v-model="time" :picker-options='pickerOptions0' :editable="false" type="datetimerange"  placeholder="选择时间范围" prop='time' size="small"></el-date-picker>
            </el-form-item> 
                <cv-tool :name="$route.name"  :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false"  :is-add="false" :is-export="false" @search="searchClick" style="position:relative;top:-12px;z-index:1000;right:48px;" v-if="show"></cv-tool>
             <cv-tool :name="$route.name"   :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false" :is-add="false"  :is-export="false" @search="isSearch" style="position:relative;top:-12px;z-index:1000;right:48px;" v-if="!show"></cv-tool>
       
            </el-form>
               <el-row  v-if="show" style="margin:10px;width:400px">
                <el-input type="textare" size="large" placeholder="请填写备注信息" v-model="remark"> </el-input>

            </el-row>   
            <el-row v-if="show">
            <el-button type="primary" size="small" @click="notHandle" style="margin-left:350px" disabled="disabled" v-if="isD">不做处理</el-button>
             <el-button type="primary" size="small" @click="futHandle"  disabled="disabled" v-if="isD">将来处理</el-button>	
              <el-button type="primary" size="small" @click="handleOver"  disabled="disabled" v-if="isD">处理完毕</el-button>
                <el-button type="primary" size="small" @click="notHandle" style="margin-left:350px" v-if="!isD">不做处理</el-button>
             <el-button type="primary" size="small" @click="futHandle"  v-if="!isD">将来处理</el-button>	
              <el-button type="primary" size="small" @click="handleOver"  v-if="!isD">处理完毕</el-button>
            </el-row>
			<el-tabs  v-model="activeName" @tab-click="tabClick">
			<!-- 当前告警列表 -->
            <el-tab-pane label="当前告警列表" name="ORA">
            <el-row>
                <cv-grid :options="grid.options" @load="searchClick(false)" >
                    <el-table border stripe :data="grid.table" v-loading="grid.loading" ref="table" :max-height="height" style="position:relative;z-index=999;" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"> </el-table-column>
                        <el-table-column label="报警类型" prop="type" min-width="100px" :show-overflow-tooltip="true" :formatter="filterAlarmType" ></el-table-column>
                        <el-table-column label="报警时间" prop="time"  min-width="130px"  :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="车速(km/h)"  prop="speed" :show-overflow-tooltip="true"  min-width="130px">    
                        </el-table-column>
                        <el-table-column label="GPS车速(km/h)" :show-overflow-tooltip="true" prop="gpsSpeed" min-width="150px">    
                        </el-table-column>
                        <el-table-column label="处理状态" :show-overflow-tooltip="true" prop="status" min-width="130px" :formatter="handleStutas">    
                        </el-table-column>             
                    </el-table>
                </cv-grid>
            </el-row>
            </el-tab-pane>
			<!-- 告警历史记录 -->
             <el-tab-pane label="告警历史记录" name="ORB">
				 <!-- <alarm-history></alarm-history> -->
                <el-row>
                <cv-grid :options="operation.options" @load="isSearch(false)" >
                    <el-table border stripe :data="operation.table" v-loading="operation.loading" ref="table" :max-height="height" style="position:relative;z-index=999;" >
                        <el-table-column type="selection" width="55"> </el-table-column>
                        <el-table-column label="报警类型" prop="type"   min-width="100px" :show-overflow-tooltip="true" :formatter="filterAlarmType" ></el-table-column>
                        <el-table-column label="报警时间" prop="time"  min-width="130px"  :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="车速(km/h)"  prop="speed" :show-overflow-tooltip="true"  min-width="130px">    
                        </el-table-column>
                        <el-table-column label="GPS车速(km/h)" :show-overflow-tooltip="true" prop="gpsSpeed" min-width="150px">    
                        </el-table-column>
                        <el-table-column label="处理状态" :show-overflow-tooltip="true" prop="status" min-width="130px" :formatter="handleStutas">    
                        </el-table-column>
                  
                    </el-table>
                </cv-grid>
            </el-row>
            </el-tab-pane> 
            </el-tabs>
        </div>
		<!--  -->
        <!-- 右侧地图指令显示 -->
        <div class="right" >
            <el-tabs v-model="activeName2" >
		<!-- 地图轨迹显示 -->
            <el-tab-pane label="地图" name="ALA" >
            <el-row style="height:600px">
               	<baidu-map id="map" class="multiMap"></baidu-map>
            </el-row>
            </el-tab-pane>
		<!-- 拍照指令 -->
            <el-tab-pane label="拍照" name="ALC" v-if="show">
                <single-camera></single-camera>
              </el-tab-pane>
		<!-- 报警历史详细 -->
             <!-- <el-tab-pane label="报警历史详细" name="ALF" v-if="!show">
        
            </el-tab-pane> -->
            </el-tabs>    
        </div>
        <!-- <div class="fenchBox"></div> -->
    </div>
</template>

<script>
import startIcon from "@/assets/img/map/zero.png";
import endIcon from "@/assets/img/map/end.png";
import zip from "@/utils/mixins/zip";
import unknow from "@/assets/img/map/red1.png";
import cars from "@/assets/img/e_1.png";
import history from "../../../../components/history-track/history.track";
import singleCamera from "../../../../components/vehicle-message/dialogCommand/singleCamera";
import dropdownTree from "@/components/dropdown-tree/dropdown.tree.vue";
import { http, COMMON } from "@/utils";
import port from "./index.js";
export default {
  components: { dropdownTree, singleCamera, history },
  mixins: [port, zip],
  data() {
    return {
      multipleSelection: [],
      allAlarm:[],
      isD:true,
      value: [],
      jsonP: [],
      remark: "",
      arry:[],
      reset: false,
      time: [
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd start")
        ),
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd end")
        )
      ],
      //开始结束时间
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      operation: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        loading: false,

        startTime: null,
        endTime: null,
        alarm: "1",
        alarmTypes: [],
        vehicleIds: []
      },
      //当前告警列表的初始值
      grid: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        alarm: "1",
        table: [],
        loading: false,
        alarmTypes: []
      },

      show: true,
      height: 300,
      //tab切换的初始值定义
      activeName: "ORA",
      activeName2: "ALA",
      dataType: "0",
      timeType: "24",
      //处理状态的值
      type: [
        { id: "0", name: "全部" },
        { id: "1", name: "处理完毕" },
        { id: "2", name: "不做处理" },
        { id: "3", name: "将来处理" }
      ],
      //时间范围的值
      timeList: [
        { id: "4", name: "4小时" },
        { id: "8", name: "8小时" },
        { id: "12", name: "12小时" },
        { id: "24", name: "24小时" }
      ],
      // 拍照相关的数控初始值
      fence: {
        fenceName: "",
        fenceType: ""
      },
      camera: "0",
      form: {
        channel: ["1"],
        interval: "1",
        photoNum: 1,
        resolution: 1,
        quality: 1,
        lightness: 1,
        contrast: 0,
        saturation: 0,
        color: 0,
        sendtoServer: "0"
      },
      submitFalg: false,
      rules: {
        interval: [
          {
            pattern: /^[0-9]/,
            message: this.$t("filter.type2"),
            trigger: "blur,change"
          },
          { min: 1, max: 5, message: "长度1-5之间" }
        ],
        quality: {
          pattern: /^([1-9]{1}|10)$/,
          message: "1-10的数字",
          trigger: "blur, change"
        },
        lightness: {
          pattern: /^([1-9]{1}|10)$/,
          message: "1-10的数字",
          trigger: "blur, change"
        },
        contrast: {
          pattern: /^(\d{1}|[1-9]\d{1}|1\d{2}|2[0-4]\d{1}|25[0-5])$/,
          message: "0-255的数字",
          trigger: "blur, change"
        },
        saturation: {
          pattern: /^(\d{1}|[1-9]\d{1}|1[0-2]{1}[0-7]{1})$/,
          message: "0-127的数字",
          trigger: "blur, change"
        },
        color: {
          pattern: /^(\d{1}|[1-9]\d{1}|1\d{2}|2[0-4]\d{1}|25[0-5])$/,
          message: "0-255的数字",
          trigger: "blur, change"
        }
      }
    };
  },
  computed: {},
  methods: {
    //多选时的数据传递
    handleSelectionChange(val) {
        this.multipleSelection=val;
      for (let i = 0; i < this.multipleSelection.length; i++){
        this.rowTime = this.multipleSelection[i].time;
        this.rowType = this.multipleSelection[i].type;

      }
    },
    notHandle() {
      this.jsonP.push({ time: this.rowTime, alarmId: this.rowType });
      let params = {
        context: this.remark,
        alarmJson: JSON.stringify(this.jsonP),
        status: "1",
        vehicleId: this.$route.query.vehicleId
      };
      this.$http({
        url: this.$COMMON.baseUrl + "alarmInfo/updateAlarmInfo",
        params: params
      }).then(data => {
        if (!data.flag && !!data.errorCode)
          this.$message.error({ message: this.$t("error." + data.errorCode) });
        else {
        }
        this.grid.loading = false;
      });
    },
    futHandle() {
      this.jsonP.push({ time: this.rowTime, alarmId: this.rowType });
      let params = {
        context: this.remark,
        alarmJson: JSON.stringify(this.jsonP),
        status: "3",
        vehicleId: this.$route.query.vehicleId
      };
      this.$http({
        url: this.$COMMON.baseUrl + "alarmInfo/updateAlarmInfo",
        params: params
      }).then(data => {
        if (!data.flag && !!data.errorCode)
          this.$message.error({ message: this.$t("error." + data.errorCode) });
        else {
          // this.grid.table = data.data.records;
          // this.grid.options.total = data.data.total;
        }
        this.grid.loading = false;
      });
    },
    handleOver() {
      this.jsonP.push({ time: this.rowTime, alarmId: this.rowType });
      let params = {
        context: this.remark,
        alarmJson: JSON.stringify(this.jsonP),
        status: "2",
        vehicleId: this.$route.query.vehicleId
      };
      this.$http({
        url: this.$COMMON.baseUrl + "alarmInfo/updateAlarmInfo",
        params: params
      }).then(data => {
        if (!data.flag && !!data.errorCode)
          this.$message.error({ message: this.$t("error." + data.errorCode) });
        else {
          // this.grid.table = data.data.records;
          // this.grid.options.total = data.data.total;
        }
        this.grid.loading = false;
      });
    },
    handleStutas(row) {
      return this.$filter.alarmTp(row.status);
    },
    // 左侧tab切换
    tabClick() {
      if (this.activeName == "ORB") {
        this.show = false;
      } else {
        this.show = true;
      }
    },
    //左侧当前告警列表
    searchClick(flag) {
      if (flag) {
        this.grid.options.flag = true;
        this.grid.options.current = 1;
      } else {
        this.grid.options.flag = false;
      }
      this.LoadGrid();
    },
    LoadGrid() {
      let params = {
        hour: this.timeType,
        vehicleIds: this.$route.query.vehicleId,
        status: this.dataType == "0" ? null : this.dataType,
        alarmTypeStr: this.$service.isContext(
          this.operation.alarmTypes.join(",")
        )
          ? null
          : this.operation.alarmTypes.join(","),
        current: this.grid.options.current,
        size: this.grid.options.size
      };
      this.grid.loading = true;
      this.$http({
        url: this.$COMMON.baseUrl + "alarmInfo/findAlarmInfoListByVehicleId",
        params: params
      }).then(data => {
        if (!data.flag && !!data.errorCode)
          this.$message.error({ message: this.$t("error." + data.errorCode) });
        else {
          this.grid.table = data.data.records;
          this.grid.options.total = data.data.total;
        }
        this.grid.loading = false;
      });
    },

    // 告警历史数据的方法
    isSearch(type) {
      if (type) {
        this.operation.options.flag = true;
        this.operation.options.current = 1;
      } else {
        this.operation.options.flag = false;
      }
      this.search();
    },
    async search() {
      this.operation.loading = true;
      let ids = [],
        params;
      if (this.operation.vehicleIds.length > 0) {
        this.operation.vehicleIds.forEach(val => {
          ids.push(val.id);
        });
      }
      if (this.time != undefined) {
        params = {
          vehicleIds: this.$route.query.vehicleId,
          status: this.dataType == "0" ? null : this.dataType,
          startTime: this.$filter.format(this.time[0], "yyyy-MM-dd HH:mm:ss"),
          endTime: this.$filter.format(this.time[1], "yyyy-MM-dd HH:mm:ss"),
          alarmTypeStr: this.$service.isContext(
            this.operation.alarmTypes.join(",")
          )
            ? null
            : this.operation.alarmTypes.join(","),
          current: this.operation.options.current,
          size: this.operation.options.size
        };
        if (params.startTime != undefined && params.endTime != undefined) {
          if (this.$filter.timeRange(params.startTime, params.endTime) <= 3) {
            const { flag, data } = await this.getAlarmSearch(params);
            this.operation.loading = false;
            if (flag && data.length != 0) {
              this.operation.table = data.records;
              this.operation.options.total = data.total;
            } else {
              this.operation.table = [];
              this.operation.options.total = 0;
            }
          } else {
            this.operation.loading = false;
            this.$message.error({ message: this.$t("时间范围为3天") });
          }
        } else {
          this.$message.error({ message: this.$t("请选择时间范围") });
          this.operation.loading = false;
        }
      } else {
        this.$message.error({ message: this.$t("请选择时间范围") });
        this.operation.loading = false;
      }
    },
    // 过滤报警类型
    filterAlarmType(row) {
      for (var i = 0; i < this.allAlarm.length; i++) {
        if (this.allAlarm[i].alarmId == row.alarmId) {
          return this.allAlarm[i].alarmName;
        }
      }
    },
    allAlarmType(type) {
      this.allAlarm = type;
    },
    checked(alarms) {
      this.operation.alarmTypes = alarms;
    },
    //拍照
    save() {
      this.$refs["form"].validate(valid => {
        let _self = this;
        if (valid) {
          this.submitFalg = true;
          let params = {
            channel: "",
            color: Number(this.form.color),
            contrast: Number(this.form.contrast),
            enterpriseId: this.$store.getters.carCurrent.enterpriseId,
            interval: Number(this.form.photoNum),
            lightness: Number(this.form.lightness),
            photoNum: this.camera === "1" ? 0 : Number(this.form.photoNum),
            quality: Number(this.form.quality),
            resolution: Number(this.form.resolution),
            saturation: Number(this.form.saturation),
            sendtoServer: Number(this.form.sendtoServer),
            vehicleId: Number(_self.$route.query.vehicleId)
          };
          if (this.form.channel.length > 0) {
            let _self = this;
            (function loop(i) {
              if (i >= _self.form.channel.length) {
                _self.submitFalg = false;
                _self.$message.success("指令下发成功");
                return;
              }
              params.channel = _self.form.channel[i];
              _self.cameraQuest(params).then(data => {
                ++i;
                loop(i);
              });
            })(0);
          } else {
            this.submitFalg = false;
            this.$message.error("请先选中摄像头");
          }
        } else {
          return false;
        }
      });
    },
    cameraQuest(params) {
      return this.$http({
        url: this.$COMMON.baseUrl + "/sendOrder/photo",
        params: params
      });
    },
    handle() {},
    //历史轨迹
    history() {
      let params = {
        vehicleId: this.$route.query.vehicleId,
        startTime: this.$filter.format(this.time[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: this.$filter.format(this.time[1], "yyyy-MM-dd HH:mm:ss"),
        isCompress: true,
        isAllLocations: false,
        mapType: this.$store.getters.mapType,
        trackType: this.$store.getters.user.trackType
      };
      this.$http({
        url: this.$COMMON.baseUrl + "/vtrack/findDailyMileage.do",
        responseType: "arraybuffer",
        params: params
      }).then(data => {
        let result = JSON.parse(this.unzip(data.data));
        let listAll = JSON.parse(result.listAll);
        let points = [];
        listAll.forEach(val => {
          points.push({ lng: val.mapLongitude, lat: val.mapLatitude });
        });
        this.$map["map"].mapAddline(points,{
          strokeWeight: 8,
          strokeColor: "#8b8b8a"
        });
      });
    }
  },
  mounted() {
    this.history();
    this.searchClick();
    this.isSearch();
  },
  watch: {
    "operation.alarmTypes"(newVal) {
      this.operation.options.current = 1;
      this.reset = true;
    },
    'multipleSelection'(newVal){
        if(this.multipleSelection.length>0){
             this.isD=false;
        }else{
            this.isD=true;
        }
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  top: 0px;
  bottom: 0px;
  .fenchBox {
    position: absolute;
    top: 60px;
    bottom: 0px;
    left: 0;
    right: 0;
    z-index: -1000;
  }
}
.main .left {
  float: left;
  width: 600px;
}
.el-form-item__content:before {
  display: none;
  content: "";
}
.multiMap {
  height: 100%;
  width: 100%;
}
.main .right {
  position: relative;
  margin-left: 610px;
  height: 100%;
  width: auto;
}
</style>