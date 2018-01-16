<template>
	<div class="historyTrack">
    <!-- 头部工具条 -->
		<component :is="loadComponents.topBar" 
		:selectedVehicle="selectVehicle" 
		@trackSearch="trackS"
		@isScreenFull="screenF"
    @childToFather="cTof"
		:btnFlag="trackFlag"
		:screenFullSize="mapFull"
		></component>
    <!-- 历史轨迹树 -->
		<component :is="loadComponents.monitorTree"
		ref="monitor"
		class="history-monitor-tree" 
		:class="[!$store.getters.isToggleHistoryTree?'toggle-tree':'']"
		:is-check="false"
		:show-checkbox="true"
		size="big"
		:is-show-track="false"
		:default-show="true"
		@single="single"
		></component>
    <!-- 历史轨迹面板 -->
		<component :is="loadComponents.historyPanel"
		class="history-panel"
		:class="[!$store.getters.isToggleHistoryPanel?'toggle-panel':'']"
    :data="allGpsPoint"
    :allPointArry='allPoints'
    :allAbillity="allAbillityIds"
    :allCanDatas="allCanData"
    :bestViewPoint="bestViewPoint"></component>
    <!-- 地图 -->
    <component 
		:is="$store.getters.mapName" 
		id="map" class="multiMap" @ready="mapReady"></component>
    <!-- 下部列表面板 -->
		<scrollbar-pagination 
			ref="pagination"
			class="track-list" 
			:is-tree="true"
      :plateCode='selectVehicle'
			@history-panel="togglePanel"></scrollbar-pagination>
	</div>
</template>

<script>
import topBar from "./topBar.vue";
import historyPanel from "./historyPanel.vue";
import monitorTree from "@/components/monitor-tree/monitor.tree.vue";
import scrollbarPagination from "./model/history.scrollbar.vue";
import zip from "@/utils/mixins/zip";
import startIcon from "@/assets/img/map/zero.png";
import endIcon from "@/assets/img/map/end.png";
export default {
  components: { monitorTree, topBar, historyPanel, scrollbarPagination },
  mixins: [zip],
  data() {
    return {
      bestViewPoint: null, //需要获取最佳视野的点
      allGpsPoint: null, //GPS点集合
      allPoints:null,
      allAbillityIds: null, //能力项点集合
      allCanData: null, //can数据点集合
      fullPoster: null, //全屏
      mapFull: false,
      //组件加载
      loadComponents: {
        topBar: "",
        monitorTree: "",
        historyPanel: "historyPanel"
      },
      //搜索loading
      trackFlag: {
        flag: false
      },
      //选择车辆的信息
      selectVehicle: {},
      //总里程
      mileageTotal: "",
      // 所有轨迹集合
      listAll: [],
      //按行程
      listST: [],
      //按县城
      listCounty: [],
      //报警点
      alarmMap: [],
      //是否返回轨迹数据
      isReturnData: false,
      allLineOne: null,
      allLineTwo: null,
      startPoint: null,
      endPoint: null,
      allData: null,
      num: 0,
      addPoint: null,
      plateCode: "",
      playFalg: false,
      alarmMarkerGroup: [], // 报警点的marker集合
    };
  },
  methods: {
    //全屏
    screenF() {
      this.mapFull = !this.mapFull;
      if (this.mapFull) {
        this.fullPoster.style.top = 0 + "px";
      } else {
        this.fullPoster.style.top = 90 + "px";
      }
    },

    //轨迹查询接口
    trackS(val) {
      this.$map["map"] && this.$map["map"].clearOverlays();
      this.$store.dispatch("addTrackLists", []);
      this.$store.dispatch("addTrackPoints", []);
      this.$store.dispatch("addTrackAbillity", []);
      let params = {
        vehicleId: this.selectVehicle.id,
        startTime: val.startTime,
        endTime: val.endTime,
        isCompress: true,
        isAllLocations: val.isAllLocations,
        mapType: this.$store.getters.mapType,
        trackType: this.$store.getters.user.trackType
      };
      let paramsCAN = {
        startTime: val.startTime,
        endTime: val.endTime,
        vehicleId: this.selectVehicle.id
      };
      let type;
      this.trackFlag.flag = true;
      this.$store
        .dispatch("getVehicleTrackByBigData", params)
        .then(data => {
          let result;
          this.unzip(data.data) && (result = JSON.parse(this.unzip(data.data)));
          if(result.mileageTotal == 0){
            this.$message.warning('暂无行程！')
            this.trackFlag.flag = false
            return false;
          }
          this.searchResultDetail(result); //数据返回处理
          this.trackFlag.flag = false;
        })
        .catch(_ => {
          this.trackFlag.flag = false;
          this.$message.error("服务器错误");
        });
      //can数据接口
      this.$store.dispatch("queryVehicleCan", paramsCAN).then(data => {
         let result;
          this.unzip(data.data) && (result = JSON.parse(this.unzip(data.data)));          
          if(result){
              this.$store.dispatch("addCanData", result);
              this.allCanData = result;
          }else{
            console.log('can数据无')
            return false;
          }
      });
    },
    // 查询结果数据处理
    searchResultDetail(result) {
      this.$map["map"].clearOverlays();
      if (!this.$service.isEmptyObject(result)) {
        this.isReturnData = true;
        // json字符串---> json格式
        result.listST = JSON.parse(result.listST);
        result.listCounty = JSON.parse(result.listCounty);
        result.alarmMap = JSON.parse(result.alarmMap);
        result.listAll = JSON.parse(result.listAll);
        result.mileageTotal = JSON.parse(result.mileageTotal);
        /* 总里程 */
        this.$store.dispatch("setMileageTotal", result.mileageTotal);
        this.$store.dispatch("setAverageOil", result.averageOil);
        this.$store.dispatch("setAverageSpeed", result.averageSpeed);
        this.$store.dispatch("setOilTotal", result.oilTotal);
        /*. 行程列表 */
        this.listST = this.$service.isArray(result.listST) ? result.listST : [];
        this.$store.dispatch("setListST", this.listST);
        /*. 县城列表 */
        this.listCounty = this.$service.isArray(result.listCounty)
          ? result.listCounty
          : [];
        this.$store.dispatch("setListCounty", this.listCounty);
        /* 报警列表 */
        this.alarmMap = this.$service.isArray(result.alarmMap)
          ? result.alarmMap
          : [];
        this.$store.dispatch("setAlarmListMap", this.alarmMap);
        /*. 所有轨迹 */
        this.listAll = this.$service.isArray(result.listAll)
          ? result.listAll
          : [];
        this.showLines(result.listAll);
        this.$store.dispatch("addTrackLists", result.listAll);
        this.allGpsPoint = result.listAll;
        /*. 能力id*/
        this.$store.dispatch("addTrackAbillity", result.abillityIds);
        this.allAbillityIds = result.abillityIds;
      }
    },
    // 显示所有轨迹
    showLines(data) {
      let points = [];
      if (this.$service.isArray(data) && data.length > 0) {
        data.forEach(val => {
          points.push({ lng: val.mapLongitude, lat: val.mapLatitude });
        });
        this.bestViewPoint = points;
        this.allPoints=points;
        // this.allLineOne = this.$map["map"].mapAddline(points, {
        //   strokeWeight: 8,
        //   strokeColor: "#8b8b8a"
        // });
        this.allLineTwo = this.$map["map"].mapAddline(points, {
          strokeWeight: 3
        });
        this.$store.dispatch("historyTrackAllPoint", points);
        this.showStartEnd(data, points);
        this.$store.dispatch("isToggleHistoryTree", false); //树开关
        this.$store.dispatch("isToggleHistoryPanel", true); //面板开关
        this.$map['map'].getBestView(points);
      }
    },
    // 显示起始点和信息
    showStartEnd(data, points) {
      this.allData = data;
      this.$store.dispatch("addTrackPoints", points);
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
          : startMess.locationDesc}</div>`;
      this.startPoint = this.$map["map"].mapAddpoint(
        {
          longitude: Number(start.lng),
          latitude: Number(start.lat)
        },
        startIcon,
        { width: 36, height: 36 }
      );
      this.$map["map"].overlayClickOpenInfoWindow(
        this.startPoint,
        this.startPoint.point,
        startContext
      );
      this.$map["map"].addOverlay(this.startPoint);

      /* 结束点 */
      endContext = `
							<div class="mapcontent">结束位置: ${endMess.locationDesc == ""
                ? "未获取到位置信息"
                : endMess.locationDesc}</div>`;
      this.endPoint = this.$map["map"].mapAddpoint(
        {
          longitude: Number(end.lng),
          latitude: Number(end.lat)
        },
        endIcon,
        { width: 36, height: 36 }
      );
      this.$map["map"].overlayClickOpenInfoWindow(
        this.endPoint,
        this.endPoint.point,
        endContext
      );
      this.$map["map"].addOverlay(this.endPoint);
    },
    //树点击事件，存储点击的车辆id
    single(val) {
      this.selectVehicle = val;
      // this.$store.dispatch("isToggleHistoryTree", false);
    },
    //活动加载组件
    lifeProcess() {
      setTimeout(_ => {
        this.loadComponents.monitorTree = "monitorTree";
      }, 300);
      this.loadComponents.topBar = "topBar";
    },
    //地图渲染后执行
    mapReady() {
      this.lifeProcess();
    },
    //监控跳历史轨迹时自动查询
    cTof(val) {
      this.trackS(val);
    },
    //点击下部列表开关面板
    togglePanel() {
      if (this.isReturnData) {
        const flag = this.$store.getters.isToggleHistoryPanel;
        this.$store.dispatch("isToggleHistoryPanel", !flag);
        this.$store.dispatch("isToggleHistoryTree",false)
      }
    }
  },
  mounted() {
    this.$store.dispatch("isToggleHistoryTree", false);
    this.$store.dispatch("isToggleHistoryPanel", false);
    this.$store.dispatch("isTogglePanelList", true);
    setTimeout(_ => {
      this.fullPoster = document.querySelector("#contents");
    }, 500);
    if (this.$route.query) {
      this.selectVehicle.id = this.$route.query.id;
      this.selectVehicle.plateCode = this.$route.query.plateCode;
    }
  },

  // 清除所有当前高亮--轨迹，县城， 报警
  clearAllCurrent(type, current) {
    if (this.$refs[type]) {
      this.$refs[type].forEach(val => {
        this.$myJq.removeClass(val, current);
      });
    }
  },
  //清除轨迹播放时地图上显示的轨迹，县城，报警()
  clearOrAddToAllMarker(obj, data, current, clb) {
    let _self = this;
    if (_self.$refs[obj]) {
      _self.$refs[obj].forEach((val, index) => {
        if (_self.$myJq.hasClass(val, current)) {
          if (_self.playFalg) {
            if (obj == "alarm") {
              _self.alarmMarkerGroup.length > 0 &&
                _self.alarmMarkerGroup.forEach(val => {
                  _self.$map["map"].removeOverlay(val);
                });
            } else {
              _self.markerCurrent != null &&
                _self.$map["map"].removeOverlay(_self.markerCurrent);
            }
          } else {
            if (obj == "alarm") {
              _self.showAlarmPoint(index, data[index], true);
            } else {
              _self.lookTrack(index, obj, data[index]);
            }
          }
        }
      });
    }
  },
  beforeDestroy() {
    this.$store.dispatch("addTrackLists", []);
    this.$store.dispatch("addTrackPoints", []);
    this.$store.dispatch("addTrackAbillity", []);
    this.fullPoster = null;
  },
  watch: {
    //树与下部列表的共存关系
    "$store.getters.isTogglePanelList"(newVal) {
      !newVal && this.$store.dispatch("isToggleHistoryTree", false);
    },
    //树与面板的共存关系
    "$store.getters.isToggleHistoryTree"(newVal) {
      if (newVal) {
        this.$store.dispatch("isToggleHistoryPanel", false);
        // this.isReturnData = false;
        // this.$map["map"] && this.$map["map"].clearOverlays();
        // this.$store.dispatch("addTrackLists", []);
        // this.$store.dispatch("addTrackPoints", []);
        // this.$store.dispatch("addTrackAbillity", []);
      } else {
        if (this.isReturnData) {
          this.$store.dispatch("isToggleHistoryPanel", true);
        }
      }
    }
  }
};
</script>

<style lang="scss">
$width: 300px;
.historyTrack {
  @keyframes fadeTop {
    0% {
      top: -50px;
    }

    100% {
      top: 0;
    }
  }
  overflow: hidden !important;
  .fadeTop-enter-active {
    animation: fadeTop 0.4s;
  }
  .fadeTop-leave-active {
    animation: fadeTop 0.4s reverse;
  }
  .fullscreen {
    top: 0;
  }
  .multiMap {
    height: 100%;
    width: 100%;
  }
  .history-monitor-tree {
    position: absolute;
    z-index: 1;
    width: $width;
    top: 60px;
    bottom:50px;
    left: 10px;
    transition: all 0.4s ease-in-out;
  }
  .history-panel {
    position: absolute;
    z-index: 1;
    width: $width;
    background-color: #fff;
    top: 60px;
    left: 10px;
    bottom: 55px;
    transition: all 0.4s ease-in-out;
    overflow: hidden;
  }
  .toggle-panel {
    left: -500px;
    transition: all 0.5s ease-in-out;
  }
  .toggle-tree {
    top: -1000px;
    left: 10px;
    bottom:1000px;
    transition: all 0.5s ease-in-out;
  }
  .track-list {
    position: absolute;
    z-index: 160;
    bottom: 0;
    left: 0;
  }
}
</style>