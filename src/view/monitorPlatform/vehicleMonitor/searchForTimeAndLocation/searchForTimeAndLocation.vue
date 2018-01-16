<template>
<div class="SFTL">
  <!-- 地图 -->
  <component v-loading="loadFlag" :element-loading-text="$t('role.type1')" :is="$store.getters.mapName" style="width: 100%;height: 100%;overflow: hidden;margin:0;" id="searchForTimeLocation"></component>
  <!-- 工具条 -->
  <map-tool class="tool" map-name="searchForTimeLocation" @isFull="isFull = !isFull">
    <span class="toolItem">
      <el-button plain size="mini" @click="Addrectangle">{{this.$t('searchForTimeAndLocation.searchV')}}</el-button>
    </span>
    <span class="toolItem">
      <el-button plain size="mini" @click="bestView">{{this.$t('searchForTimeAndLocation.bsv')}}</el-button>
    </span>
  </map-tool>  
  <!-- 信息面板 -->
  <vehicle-message style="top:0px;right:5px;" :data="vehicleData" :is-show="popover"></vehicle-message>
  <!-- 详情列表 -->
  <scrollbar-pagination class="track-list" :all="allData" @position="paginationClick" :current-id="currentId"></scrollbar-pagination>
</div>
</template>

<script>
import pointIcon from "@/assets/img/map/green1.png";
import mapTool from "@/view/monitorPlatform/vehicleMonitor/multiCar/map.tool.vue";
import scrollbarPagination from "@/components/scrollbar-pagination/scrollbar.pagination.vue";
import vehicleMessage from "@/components/vehicle-message/vehicle.message.vue";
import prot from "./";
export default {
  components: {
    scrollbarPagination,
    vehicleMessage,
    mapTool
  },
  mixins: [prot],
  data() {
    return {
      current: null,
      MarkerClusterer: null, //聚合点
      mapAllPoint: [], //划定区域内所有marker点
      loadFlag: false, //加载标识
      rectangle: null, //地图矩形覆盖物
      location: "", //快捷定位v-model
      vehicleIds: [], //划定区域内所有车辆id
      scrollPageData: [], //地图底部列表内容（详细数据）
      allData: [], //底部列表所有数据
      scurrent: 0,
      pointMarkers: {}, //地图所有marker对应相应车辆id
      vehicleData: {},
      currentId: null,
      popover: {
        flag: false
      },
      isFull: false
    };
  },
  methods: {
    //添加矩形
    Addrectangle() {
      //清空上一次数据
      this.$map["searchForTimeLocation"].clearOverlays();
      this.$map['searchForTimeLocation'].markerClustererClearAll();
      // this.MarkerClusterer != null && this.MarkerClusterer.clearMarkers();
      this.scurrent = 0;
      this.allData = [];
      this.vehicleIds = [];
      this.pointMarkers = {};
      this.mapAllPoint = [];
      this.vehicleData={};
      this.popover.flag=false;
      //开始画矩形
      this.$map["searchForTimeLocation"].onclickRectangle(options => {
        this.rectangle = options.overlay;
        let params = {
          minLongitude: parseInt(options.params.minLng * 1000000),
          minLatitude: parseInt(options.params.minLat * 1000000),
          maxLongitude: parseInt(options.params.maxLng * 1000000),
          maxLatitude: parseInt(options.params.maxLat * 1000000),
          mapType:this.$store.getters.mapType
        };
        this.loadFlag = true;
        //区域内所有点接口
        this.findAreaDelimitedQueryLocationListInfo(params).then(data => {
          if (data.flag && data.data.length != 0) {
            data.data.forEach(ele => {
              this.vehicleIds.push(ele.id);
            });
            let idStr = this.vehicleIds.join(",");
            //区域内所有点详细信息接口
            this.$store
              .dispatch("getMultiVehicleLastLocationList", {ids:idStr,mapType:this.$store.getters.mapType})
              .then(data => {
                if (!data.flag) {
                  this.$message.error({
                    message: this.$t("error." + data.errorCode)
                  });
                  this.loadFlag = false;
                  this.$map["searchForTimeLocation"].clearOverlays();
                  return false;
                }
                this.allData = data.data;
                data.data.forEach(item => {
                  let tempPoint = {};
                  tempPoint.latitude = item.mapLatitude;
                  tempPoint.longitude = item.mapLongitude;
                  //地图点
                  let point = this.$map["searchForTimeLocation"].point(
                    tempPoint
                  );
                  //地图marker
                  let mapPoint = this.$map["searchForTimeLocation"].mapAddpoint(
                    tempPoint,
                    this.$filter.isOnline(item)
                  );
                  //文字标注
                  setTimeout(_ => {
                    mapPoint.label = this.$map["searchForTimeLocation"].addLabel(
                    mapPoint,
                    item.plateCode
                  );
                  })
                  //marker点击事件
                  this.$map['searchForTimeLocation'].addEventListener(mapPoint, 'click', _ => {
                    this.popover.flag = true;
                    this.vehicleData = item;
                    mapPoint.label.setStyle({
                      backgroundColor: "black",
                      color: "#fff"
                    });
                    this.currentId = item.vehicleId;
                    mapPoint.setTop(true);
                    this.$map["searchForTimeLocation"].moveToCenter(point, 20);
                  })
                  //mapPoint.setRotation(item.direction);
                  this.mapAllPoint.push(mapPoint);
                  this.pointMarkers[item.vehicleId] = mapPoint;
                });
                //点聚合
                this.$map['searchForTimeLocation'].markerClustererAddMarkers(this.mapAllPoint);
                //获取最佳视野，清除矩形覆盖物
                this.$map["searchForTimeLocation"].getBestView(this.mapAllPoint);
                this.$map["searchForTimeLocation"].removeOverlay(
                  this.rectangle
                );
                this.loadFlag = false;
              });
          } else {
            this.$message.warning("暂无数据");
            this.$map["searchForTimeLocation"].removeOverlay(this.rectangle);
            this.loadFlag = false;
          }
        }).catch(_=>{
            this.$message.error("网络错误");
            this.$map["searchForTimeLocation"].removeOverlay(this.rectangle);
            this.loadFlag = false;
        });
      });
    },
    //区域搜索
    handleIconClickL() {
      this.$map["searchForTimeLocation"].Geocoder(this.location);
    },
    //列表点击
    paginationClick(val) {
      let point = this.$map["searchForTimeLocation"].point({
        lat: val.mapLatitude, 
        lng: val.mapLongitude
      });
      this.$map["searchForTimeLocation"].moveToCenter(point, 20);
      this.pointMarkers[val.vehicleId].label.setStyle({
        backgroundColor: "black",
        color: "#fff"
      });
      this.pointMarkers[val.vehicleId].setTop(true);
      this.vehicleData = val;
      this.currentId = val.vehicleId;
      this.popover.flag = true;
    },
    //获取最佳视野
    bestView() {
      if(this.mapAllPoint.length > 0){
        this.$map["searchForTimeLocation"].getBestView(this.mapAllPoint);
      }else{
        this.$map['searchForTimeLocation'].moveToCenter('上海市');
      }  
      this.popover.flag = false;
    }
  },
  watch: {
    currentId(newVal, oldVal) {
      if (oldVal) {
        this.pointMarkers[oldVal].label.setStyle({
          backgroundColor: "#f8f8f8",
          color: "#666"
        });
        this.pointMarkers[oldVal].setTop(false);
      }
    }
  }
};
</script>

<style lang="scss">
.SFTL {
  overflow: hidden !important;
  .tool {
    position: absolute;
    top: 13px;
    right: 70px;
  }
  .track-list {
    width: 100%;
    position: absolute;
    bottom: 0px;
  }
}
</style>
