<template>
    <div class="main">
        <!-- 左侧列表数据显示 -->
  <cv-header>
	<el-form :inline="true" style="padding-left:10px">
        <el-form-item label="报警类型:">
				<dropdown-tree style="display:inline-block;" :isCheck="true" :interface="$COMMON.baseUrl+'/alarmInfo/frinAlarmTypeInfoList.do'" :show-checkbox="true" @checked="checked" @allAlarmType="allAlarmType" ></dropdown-tree>
			</el-form-item>
           <el-form-item label="处理状态:">
                    <el-select  v-model="dataType" size='small' clearable>
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
           <el-form-item style="float:right;">  
              <cv-tool :name="$route.name"  :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false"  :is-add="false"  @search="searchClick" style="position:relative;top:-12px;z-index:1000;right:35px;" v-if="show" @export="deriveAlarm"></cv-tool>
             <cv-tool :name="$route.name"   :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false" :is-add="false"   @search="isSearch" style="position:relative;top:-12px;z-index:1000;right:10px;" v-if="!show" @export="derive"></cv-tool>
           </el-form-item>
         </el-form>
        </cv-header>
 <div class="content">
     <div class="left" style="position:relative;z-index:1000;">       
			<el-row v-if="show" style="position:absolute;z-index:9999;width:50px;left:705px;top:10px;">
			<el-button  @click="setClick"  disabled v-if="isD" size="small">处理</el-button>
			<el-button  @click="setClick" v-if="!isD" size="small">处理</el-button>
			</el-row>      
			<el-tabs  v-model="activeName">
			<!-- 当前告警列表 -->
            <el-tab-pane label="当前报警列表" name="ORA">
            <el-row>
                <cv-grid :options="grid.options" @load="searchClick(false)" >
                    <el-table border stripe :data="grid.table" v-loading="grid.loading" ref="table" :max-height="height"  style="position:relative;z-index=999;" @select="handleChange"  @select-all="selectAll" @selection-change="changeSelect">
                        <el-table-column type="selection" width="55"> </el-table-column>
                        <el-table-column label="报警类型" prop="alarmId" min-width="100px" :show-overflow-tooltip="true" :formatter="filterAlarmType" ></el-table-column>
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
             <el-tab-pane label="报警历史记录" name="ORB">
				 <!-- <alarm-history></alarm-history> -->
                <el-row>
                <cv-grid :options="operation.options" @load="isSearch(false)" >
                    <el-table border stripe :data="operation.table" v-loading="operation.loading" ref="table2" :max-height="height"  style="position:relative;z-index=999;" @row-click="showInfo" >
                        <el-table-column label="报警类型" prop="alarmId"   min-width="100px" :show-overflow-tooltip="true" :formatter="filterAlarmType" ></el-table-column>
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
        <!-- 右侧地图指令显示 -->
        <div class="right">
            <el-tabs v-model="activeName2" style="width:100%;height:100%;">
		<!-- 地图轨迹显示 -->
     <el-tab-pane label="地图" name="ALA"  style="position:relative;height:90%;">
       <component :is="$store.getters.mapName" style="width: 100%;height: 100%;overflow: hidden;margin:0;" id="mapCod" @ready="allReady"></component>
    </el-tab-pane>
		<!-- 拍照指令 -->
            <el-tab-pane label="拍照" name="ALC" v-if="show" style="height:300px;padding-left:30px">
               	<el-form 
	class="cv-single-camera" 
	ref="form" 
	:model="form" 
	:rules="rules"
	label-width="90px">
		<el-form-item label="摄像头:" prop="channel" id="first">
			<el-checkbox-group v-model="form.channel" size="small">
				<el-checkbox label="1" name="type">1号</el-checkbox>
				<el-checkbox label="2" name="type">2号</el-checkbox>
				<el-checkbox label="3" name="type">3号</el-checkbox>
				<el-checkbox label="4" name="type">4号</el-checkbox>
			</el-checkbox-group>
		</el-form-item>
		<el-form-item label="图片张数:" prop="photoNum" class="second">
			<el-select size="small" v-model="form.photoNum">
				<el-option label="0张" value="0"></el-option>
				<el-option label="1张" value="1"></el-option>
				<el-option label="2张" value="2"></el-option>
				<el-option label="3张" value="3"></el-option>
				<el-option label="4张" value="4"></el-option>
				<el-option label="5张" value="5"></el-option>
				<el-option label="6张" value="6"></el-option>
				<el-option label="7张" value="7"></el-option>
				<el-option label="8张" value="8"></el-option>
				<el-option label="9张" value="9"></el-option>
				<el-option label="10张" value="10"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="上传模式:" prop="sendtoServer" class="third">
			<el-radio-group v-model="form.sendtoServer">
			    <el-radio label="1">保存</el-radio>
			    <el-radio label="0">实时上传</el-radio>
			</el-radio-group>
		</el-form-item>
		<div style="margin-left:20px">
			<el-button type="primary" :loading='submitFalg'  @click="save">{{ $t('action.confirm') }}</el-button>
			<el-button @click='goBack'>{{ $t('action.cancel') }}</el-button>
		</div>
	</el-form>
              </el-tab-pane>
		<!-- 报警历史详细 -->
             <el-tab-pane label="报警历史详细" name="ALF" v-if="!show">
				 <el-row style="height:50px">
				   <el-col :span="4" class="leftText">车牌号:</el-col>
				   <el-col :span="20">{{allInfo.plateCode}}</el-col> 
				 </el-row>
         <el-row style="height:50px">
          <el-col :span="4" class="leftText">驾驶员:</el-col>
				   <el-col :span="20">{{allInfo.driver}}</el-col>
         </el-row>
				 <el-row style="height:50px">
				   <el-col :span="4" class="leftText">当前车速:</el-col>
				   <el-col :span="20">{{allInfo.carSpeed+'(km/h)'}}</el-col>	 
				 </el-row>
         <el-row style="height:50px">
              <el-col :span="4" class="leftText">GPS车速:</el-col>
				   <el-col :span="20">{{allInfo.gpsSpeed+'(km/h)'}}</el-col>
         </el-row>
         		<el-row style="height:50px">
				   <el-col :span="4" class="leftText">报警时间:</el-col>
				   <el-col :span="20">{{allInfo.alarmTime}}</el-col>		  
				 </el-row>
         	<el-row style="height:50px">
               <el-col :span="4" class="leftText">报警地点:</el-col>
				   <el-col :span="20">{{allInfo.alarmAd}}</el-col>         
          </el-row>
				 	 <el-row style="height:50px">
				   <el-col :span="4" class="leftText">所属车组:</el-col>
				   <el-col :span="20">{{allInfo.crew}}</el-col>  
				 </el-row>
         <el-row style="height:50px">
             <el-col :span="4" class="leftText">备注:</el-col>
				   <el-col :span="20">{{allInfo.alarmRemark}}</el-col>
            </el-row>
            </el-tab-pane>
            </el-tabs>    
        </div>
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog"></component>
		</el-dialog>
    </div>
</div>	
</template>

<script>
import remark from "./remark";
import pointIcon from "@/assets/img/map/green2.png";
import endIcon from "@/assets/img/map/end.png";
import zip from "@/utils/mixins/zip";
import unknow from "@/assets/img/map/red1.png";
import cars from "@/assets/img/e_1.png";
import startIcon from "@/assets/img/map/zero.png";
import dropdownTree from "@/components/dropdown-tree/dropdown.tree.vue";
import { http, COMMON, service } from "@/utils";
import port from "./index.js";
export default {
  components: { dropdownTree, remark },
  mixins: [port, zip],
  data() {
    return {
      markerAll: [],
      art: [],
      alarmPoints: [], // 报警点的point集合

      allPoints: [],
      allRow: [],
      allLinePoint: [],
      allData: null,
      // 所有轨迹集合
      listAll: [],
      startContext: null,
      endContext: null,
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
      },
      color: false,
      //弹框数据传递
      dialog: {
        title: "--",
        flag: false,
        name: "",
        size: "dialog-tiny",
        jsonP: [],
        vId: this.$route.query.vehicleId,
        multipleSelection: []
      },
      pointS: null,
      startPoint: null,
      endPoint: null,
      allInfo: {
        plateCode: "",
        carSpeed: "",
        gpsSpeed: "",
        driver: "",
        crew: "",
        alarmType: "",
        alarmAd: "",
        alarmTime: "",
        alarmRemark: ""
      },
      allAlarm: [],
      isD: true,
      value: [],
      arry: [],
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
      gou: false,
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
      infoWindow: null,
      show: true,
      height: 350,
      //tab切换的初始值定义
      activeName: "ORA",
      activeName2: "ALA",
      dataType: "",
      timeType: "24",
      //处理状态的值
      type: [
        { id: "0", name: "未处理" },
        { id: "2", name: "不做处理" },
        { id: "3", name: "将来处理" },
        { id: "1", name: "处理完毕" }
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
    goBack() {
      this.activeName2 = "ALA";
    },

    //历史轨迹点查询
    history() {
      let params = {
        vehicleId: this.$route.query.vehicleId,
        startTime: this.$filter.format(new Date().getTime()-24*3600*1000, "yyyy-MM-dd HH:mm:ss"),
        endTime: this.$filter.format(new Date().getTime(), "yyyy-MM-dd HH:mm:ss"),
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
        // let listAll = JSON.parse(result.listAll);
        this.searchResultDetail(result);
      });
    },
    // 查询结果数据处理
    searchResultDetail(result) {
      this.$map["mapCod"].clearOverlays();
      if (!this.$service.isEmptyObject(result)) {
        // json字符串---> json格式
        result.listAll = JSON.parse(result.listAll);
        /*. 所有轨迹 */
        this.listAll = this.$service.isArray(result.listAll)
          ? result.listAll
          : [];
        this.showLines(result.listAll);
      }
    },
    // 显示所有轨迹
    showLines(data) {
      let points = [];
      if (this.$service.isArray(data) && data.length > 0) {
        data.forEach(val => {
          points.push({ lng: val.mapLongitude, lat: val.mapLatitude });
        });
        this.allLineOne = this.$map["mapCod"].mapAddline(points, {
          strokeWeight: 8,
          strokeColor: "#559afc"
        });
        this.showStartEnd(data, points);
      }
    },
    // 显示起始点和信息
    showStartEnd(data, points) {
      this.allData = data;
      this.allLinePoint = points;
      let startContext,
        endContext,
        maxPoint = points.length - 1,
        maxData = data.length - 1,
        start = points[0],
        end = points[maxPoint],
        startMess = data[0],
        endMess = data[maxData];
      /* 开始点 */
      startContext = `
				<div class="mapcontent">开始位置: ${startMess.locationDesc == ""
          ? "未获取到位置信息"
          : startMess.locationDesc}
           <br>
                                  <span>车速: ` +
        startMess.gpsSpeed+
         ` km/h  ` +
        `</span>
           <br>
                                  <span>时间: ` +
        this.$filter.format(startMess.gpsTime, "yyyy-MM-dd HH:mm:ss")+
        
        `</span>
          
          
          </div>`;
      this.startPoint = this.$map["mapCod"].mapAddpoint(
        {
          longitude: Number(start.lng),
          latitude: Number(start.lat)
        },
        startIcon,
        { width: 36, height: 36 }
      );
      this.$map["mapCod"].overlayClickOpenInfoWindow(
        this.startPoint,
        this.startPoint.point,
        startContext
      );
      this.$map["mapCod"].addOverlay(this.startPoint);

      /* 结束点 */
      endContext = `
              <div class="mapcontent">
              
              结束位置: ${endMess.locationDesc == ""
                ? "未获取到位置信息"
                : endMess.locationDesc}
                       <br>
                                  <span>车速: ` +
        endMess.gpsSpeed+
         ` km/h  ` +
        `</span>
           <br>
                                  <span>时间: ` +
       this.$filter.format(endMess.gpsTime, "yyyy-MM-dd HH:mm:ss") +
        
        
        `</span>
                
                
                </div>`;
      this.endPoint = this.$map["mapCod"].mapAddpoint(
        {
          longitude: Number(end.lng),
          latitude: Number(end.lat)
        },
        endIcon,
        { width: 36, height: 36 }
      );
      this.$map["mapCod"].overlayClickOpenInfoWindow(
        this.endPoint,
        this.endPoint.point,
        endContext
      );
      this.$map["mapCod"].addOverlay(this.endPoint);
    },
    allReady() {
      this.history();
    },
    //全选时的坐标点显示
    selectAll(select) {
      this.alarmPoints = select;
    },
    //多选时的数据传递
    handleChange(select, row) {
      let content = this.tContent(row);
      let that = this;
      let callbackInfoWindow = function(infoWindow) {
        return (that.infoWindow = infoWindow);
      };
      let point = this.$map["mapCod"].point({
        lat: row.mapLa,
        lng: row.mapLo
      },
           pointIcon,
        { width: 32, height: 32 }
      
      );
      let infoWindow = this.$map["mapCod"].openInfoWindow(
        content,
        {offset:localStorage.getItem('mapType')==1? new BMap.Size(-5, -20):new AMap.Pixel(-5,-20)},
        point
      );
      if (this.markerAll[row.id]) {
        this.$map["mapCod"].removeOverlay(this.markerAll[row.id]);
        this.$map["mapCod"].closeInfoWindow(infoWindow);
        this.markerAll[row.id] = false;
      } else {
        this.markerAll[row.id] = this.$map["mapCod"].mapAddpoint({
          longitude: row.mapLo,
          latitude: row.mapLa
        },
             pointIcon,
        { width: 32, height: 32 });
        this.$map["mapCod"].addOverlay(this.markerAll[row.id]);
        this.$map["mapCod"].moveToCenter(point, 17);
        this.$map["mapCod"].openInfoWindow(
          content,
           {offset:localStorage.getItem('mapType')==1? new BMap.Size(-5, -20):new AMap.Pixel(-5,-20)},
          point
        );
        this.$map["mapCod"].overlayClickOpenInfoWindow(
          this.markerAll[row.id],
          point,
          content,
          callbackInfoWindow,
          {}
        );
      }
    },
    //地图弹窗
    tContent(data) {
      // debugger
      let content =
        `<div>
                            <span>车牌号码: ` +
        data.plateCode +
        `</span>
                            <br>
                            <span>速度: ` +
        data.speed +
        ` km/h  ` +
        ` </span>
                            <br>
                            <span>报警时间: ` +
        data.time +
        `</span>
                            <br>
                            <span>位置描述: ` +
        data.locationName +
        `</span>
                          </div>`;
      return content;
    },
    changeSelect(val) {
      this.dialog.multipleSelection = val;
      this.dialog.multipleSelection.forEach(val => {
        this.dialog.rowTime = val.time;
        this.dialog.rowType = val.alarmId;
      });
    },
    setClick() {
      this.dialog.flag = true;
      this.dialog.size = "dialog-small";
      this.dialog.name = "remark";
      this.dialog.title = "处理";
    },
    handleStutas(row) {
      return this.$filter.alarmTp(row.status);
    },
    showInfo(row) {
      this.allInfo.plateCode = row.plateCode;
      this.allInfo.crew = row.fleetName;
      this.allInfo.alarmAd = row.locationName;
      this.allInfo.gpsSpeed = row.gpsSpeed;
      this.allInfo.carSpeed = row.speed;
      this.allInfo.alarmTime = row.time;
      this.allInfo.driver = row.driverName;
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
        status: this.dataType,
        mapType:this.$store.getters.mapType,
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
        url: this.$COMMON.baseUrl + "/alarmInfo/findAlarmInfoListByVehicleId",
        params: params
      }).then(data => {
        if (!data.flag && !!data.errorCode)
          this.$message.error({ message: this.$t("error." + data.errorCode) });
        else {
          this.grid.table = data.data.records;
          this.allPoints = data.data.records;
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
          status: this.dataType,
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
        if (valid) {
          this.submitFalg = true;
          let params = {
            channel: "",
            color: Number(this.form.color),
            contrast: Number(this.form.contrast),
            enterpriseId: this.$store.getters.user.enterpriseId,
            interval: Number(this.form.photoNum),
            lightness: Number(this.form.lightness),
            photoNum: this.camera === "1" ? 0 : Number(this.form.photoNum),
            quality: Number(this.form.quality),
            resolution: Number(this.form.resolution),
            saturation: Number(this.form.saturation),
            sendtoServer: Number(this.form.sendtoServer),
            vehicleId: Number(this.$route.query.vehicleId)
          };
          if (this.form.channel.length > 0) {
            let _self = this;
            (function loop(i) {
              if (i >= _self.form.channel.length) {
                _self.submitFalg = false;

                // return _self.$message.success('指令下发成功');
              }
              params.channel = _self.form.channel[i];
              _self.cameraQuest(params).then(data => {
                if (data.flag) {
                  _self.$message.success("指令下发成功");
                  return (_self.submitFalg = false);
                } else {
                  _self.$message.error("指令下发失败");
                  return (_self.submitFalg = false);
                }
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
    deriveAlarm() {
      let downParams = {
        hour: this.timeType,
        vehicleIds: this.$route.query.vehicleId,
        status: this.dataType,
        alarmTypeStr: this.$service.isContext(
          this.operation.alarmTypes.join(",")
        )
          ? ""
          : this.operation.alarmTypes.join(","),
        current: this.grid.options.current,
        size: this.grid.options.size
      };
      //报警处理报表导出
      const getDriveMeterExcelA = this.$service.winParams(
        this.$COMMON.baseUrl + "/alarmInfo/exportAlarmInfoList",
        downParams
      );
      window.location.href = getDriveMeterExcelA;
    },
    derive() {
      if (this.timeType != undefined) {
        let deriveParams = {
          vehicleIds: this.$route.query.vehicleId,
          status: this.dataType,
          startTime: this.$filter.format(this.time[0], "yyyy-MM-dd HH:mm:ss"),
          endTime: this.$filter.format(this.time[1], "yyyy-MM-dd HH:mm:ss"),
          alarmTypeStr: this.$service.isContext(
            this.operation.alarmTypes.join(",")
          )
            ? ""
            : this.operation.alarmTypes.join(","),
          current: this.operation.options.current,
          size: this.operation.options.size
        };
        //报警处理报表导出
        const getDriveMeterExcelA = this.$service.winParams(
          this.$COMMON.baseUrl + "/alarmInfo/exportAlarmInfoList",
          deriveParams
        );
        window.location.href = getDriveMeterExcelA;
      } else {
        this.$message.error({ message: this.$t("请选择时间范围") });
      }
    }
  },
  mounted() {
    // 選中第二個
    this.searchClick();
    this.isSearch();
  },

  watch: {
    "operation.alarmTypes"(newVal) {
      this.operation.options.current = 1;
      this.reset = true;
    },
    "dialog.multipleSelection"(newVal) {
      if (this.dialog.multipleSelection.length > 0) {
        this.isD = false;
      } else {
        this.isD = true;
      }
      this.dialog.jsonP = [];
      this.dialog.multipleSelection.forEach(val => {
        this.dialog.jsonP.push({
          time: val.time,
          alarmId: val.alarmId
        });
      });
    },
    alarmPoints(newVal) {
      //全选被勾选的时候
      if (newVal.length > 0) {
        newVal.forEach(val => {
          let content = this.tContent(val);
          let that = this;
          let callbackInfoWindow = function(infoWindow) {
            return (that.infoWindow = infoWindow);
          };
          let point = this.$map["mapCod"].point({
            lat: val.mapLa,
            lng: val.mapLo
          },
           pointIcon,
        { width: 32, height: 32 }
          );
          let infoWindow = this.$map["mapCod"].openInfoWindow(
            content,
            {offset:localStorage.getItem('mapType')==1? new BMap.Size(-5, -20):new AMap.Pixel(-5,-20)},
            point
          );
          if (this.markerAll[val.id]) {
            this.$map["mapCod"].removeOverlay(this.markerAll[row.id]);
            this.$map["mapCod"].closeInfoWindow(infoWindow);
            this.markerAll[row.id] = false;
          }
          this.markerAll[val.id] = this.$map["mapCod"].mapAddpoint({
            longitude: val.mapLo,
            latitude: val.mapLa
          },
          pointIcon,
        { width: 32, height: 32 });
          this.$map["mapCod"].addOverlay(this.markerAll[val.id]);
          this.$map["mapCod"].moveToCenter(point, 12);
          this.$map["mapCod"].overlayClickOpenInfoWindow(
            this.markerAll[val.id],
            point,
            content,
            callbackInfoWindow,
            {}
          );
        });
      } else {
        //取消全选的时候
        this.allPoints.forEach(val => {
          this.$map["mapCod"].removeOverlay(this.markerAll[val.id]);
        });
      }
    },
    activeName(newVal) {
      if (this.activeName == "ORB") {
        this.show = false;
        this.activeName2 = "ALF";
      } else {
        this.show = true;
        this.activeName2 = "ALA";
      }
    },
    "allInfo.alarmType"(newVal) {
      for (var i = 0; i < this.allAlarm.length; i++) {
        if (this.allAlarm[i].alarmId == newVal) {
          return this.allAlarm[i].alarmName;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  top: 0px;
  bottom: 0px;
  .content {
    position: absolute;
    right: 0;
    left: 0px;
    top: 60px;
    bottom: 0;
    .fenchBox {
      position: absolute;
      top: 60px;
      bottom: 0px;
      left: 0;
      right: 0;
      z-index: -1000;
    }
  }
}
.main .left {
  float: left;
  width: 750px;
}
.multiMap {
  height: 100%;
  width: 100%;
}
.el-breadcrumb:after,
.el-breadcrumb:before,
.el-button-group:after,
.el-button-group:before,
.el-form-item:after,
.el-form-item:before,
.el-form-item__content:after,
.el-form-item__content:before {
  display: inline;
  content: none;
}

.main .right {
  position: relative;
  margin-left: 755px;
  height: 100%;
  width: auto;
  .leftText{
    padding-left:12px;
  }
  // .second{
  //   label{
  //  .el-form-item__label{
  //     margin-left: 43px;
  //   }
  //   }

  // }
  // .third{
  //   .el-form-item__label{
  //     margin-left: 40px;
  //   }
  // }
}
</style>

