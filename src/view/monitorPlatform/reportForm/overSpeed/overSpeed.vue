<template>
    <div class="overSpeed">
        <cv-header>
            <el-form-item :label="$t('reportForm.overSpeed.searchTime')">
                <el-date-picker :clearable="false" :editable="false" v-model="searchTime" size="small" type="date" :placeholder="$t('reportForm.overSpeed.selectTime')" :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('reportForm.overSpeed.minSpeed')">
                <el-input size="small" :maxlength='4' v-model="minSpeed" style="width:100px;"></el-input> (km/h)
            </el-form-item>
            <el-form-item style="float:right;">
                <cv-tool style="margin:0;" :name="$route.name" :data="$store.getters.monitorMenu" class="cv-tool" :is-export="false" :is-remove="false" :is-add="false" :is-modify="false" @search="search"></cv-tool>
            </el-form-item>
        </cv-header>
        <cv-content>
            <div class="left">
                <div class="leftTop">
                    <!-- 表格 -->
                    <cv-grid class="" :options="vehicleGrid.options" @load="vehicleGridLoad(null,false)">
                        <el-table border stripe :data="vehicleGrid.table" v-loading="vehicleGrid.loading" :max-height="getMaxHeight(1)" @row-click="vehicleRowClick">
                            <el-table-column header-align="center" align="center" :label="$t('reportForm.overSpeed.vehicleInfo')" :show-overflow-tooltip="true">
                                <el-table-column header-align="center" align="center" :label="$t('reportForm.overSpeed.plateCode')" prop="plateCode" :show-overflow-tooltip="true">
                                   <template scope="scope">
                                   <span class="listTitle">{{scope.row.plateCode}}</span>
                                 </template>
                                </el-table-column>
                                <el-table-column header-align="center" align="center" :label="$t('reportForm.overSpeed.deviceId')" prop="equipmentNumber" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>
                            <el-table-column header-align="center" align="center" :label="$t('reportForm.overSpeed.overTimes')" prop="speedingFrequency" :show-overflow-tooltip="true"></el-table-column>
                        </el-table>
                    </cv-grid>
                </div>
                <div class="leftBottom">
                    <i class="el-icon-upload downLoad" @click="outPut" title="导出"></i>
                    <!-- tab页签 -->
                    <el-tabs class="tabClass" v-model="tabActive">
                       <!-- tab内容 -->
                       <el-tab-pane :label="$t('reportForm.overSpeed.sCar')" name="sCar">
                           <!-- 表格 -->
                           <cv-grid class="" :options="overGrid.options" @load="overGridLoad(null,false)">
                             <el-table border stripe :data="overGrid.table" v-loading="overGrid.loading" :max-height="getMaxHeight(2)" @row-click="pointToTrack">
                               <el-table-column :label="$t('reportForm.overSpeed.plateCode')" header-align="center" align="center" min-width="85" :show-overflow-tooltip="true">
                                 <template scope="scope">
                                   <span class="listTitle">{{scope.row.plateCode}}</span>
                                 </template>
                               </el-table-column>
                               <el-table-column :label="$t('reportForm.overSpeed.sTime')" header-align="center" align="center" min-width="170" prop="startTime" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column :label="$t('reportForm.overSpeed.eTime')" header-align="center" align="center" min-width="170" prop="stopTime" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column :label="$t('reportForm.overSpeed.overTime')" header-align="center" align="center" min-width="100" prop="duration" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column :label="$t('reportForm.overSpeed.maxSpeed')" header-align="center" align="center" min-width="120" prop="maxSpeed" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column :label="$t('reportForm.overSpeed.minSpeed')" header-align="center" align="center" min-width="120" prop="minSpeed" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column :label="$t('reportForm.overSpeed.avgSpeed')" header-align="center" align="center" min-width="120" prop="avgSpeed" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column :label="$t('reportForm.overSpeed.rate')" header-align="center" align="center" min-width="60" prop="overSpeedPercent" :show-overflow-tooltip="true"></el-table-column>
                             </el-table>
                           </cv-grid>
                       </el-tab-pane>
                       <!-- tab内容 -->
                       <el-tab-pane :label="$t('reportForm.overSpeed.sTra')" name="sTra">
                           <!-- 表格 -->
                        <cv-grid class="" :options="detailGrid.options" @load="detailGridLoad(null,false)">
                            <el-table border stripe :data="detailGrid.table" v-loading="detailGrid.loading" :max-height="getMaxHeight(2)" @row-click="detailRowClick">
                                <el-table-column align="center" :label="$t('reportForm.overSpeed.plateCode')" min-width="80" prop="plateCode" :show-overflow-tooltip="true">
                                   <template scope="scope">
                                   <span class="listTitle">{{scope.row.plateCode}}</span>
                                 </template>
                                </el-table-column>
                                <el-table-column align="center" :label="$t('reportForm.overSpeed.SEtime')" min-width="120" prop="gpsTime" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column align="center" :label="$t('reportForm.overSpeed.speed1')" min-width="80" prop="speed" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column align="center" :label="$t('reportForm.overSpeed.location')" min-width="150" prop="locationDescribe" :show-overflow-tooltip="true"></el-table-column>
                            </el-table>
                        </cv-grid>
                       </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
            <div class="right">
                <component :is="$store.getters.mapName" style="width: 100%;height: 100%;overflow: hidden;margin:0;" id="overSpeed"></component>
            </div>
        </cv-content>
    </div>
</template>
<script>
import pointIcon from "@/assets/img/map/green2.png";
import port from "./index.js";
export default {
  components: {},
  mixins: [port],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      searchTime: new Date(),
      minSpeed: 60,
      vehicleIds: "",
      vehicleId: "",
      detailTimes: [],
      vehicleGrid: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        loading: false,
        table: []
      },
      overGrid: {
        options: {
          current: 1,
          total: 0,
          size: 10,
          flag: false
        },
        table: [],
        loading: false
      },
      detailGrid: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        loading: false,
        table: []
      },
      infoWindow: null,
      tabActive: "sCar"
    };
  },
  methods: {
    //设置表格最大高度
    getMaxHeight(type) {
      switch (type) {
        case 1:
          return $(".leftTop").height() - 65;
        case 2:
          return $(".leftBottom").height() - 105;
      }
    },
    //车辆信息表格行点击
    vehicleRowClick(row) {
      this.vehicleId = row.id;
      this.tabActive = "sCar";
      this.$map["overSpeed"].clearOverlays();
      this.overGridLoad(this.vehicleId, true);
      this.detailGrid.table = [];
    },
    //tab页跳转
    pointToTrack(row) {
      this.tabActive = "sTra";
      this.detailTimes = [];
      this.detailTimes.push(row.startTime);
      this.detailTimes.push(row.stopTime);
      this.detailGridLoad(this.vehicleId, true);
    },
    //时间过滤
    sFilter(val) {
      return this.$filter.format(val.startTime);
    },
    eFilter(val) {
      return this.$filter.format(val.stopTime);
    },
    //超速详细表格行点击
    detailRowClick(row) {
      this.$map["overSpeed"].clearOverlays();
      let that = this;
      let callbackInfoWindow = function(infoWindow) {
        that.infoWindow = infoWindow;
      };
      let content = this.tContent(row);
      let point = this.$map["overSpeed"].point({
        lat: row.latitude,
        lng: row.longitude
      });
      let mapPoint = this.$map["overSpeed"].mapAddpoint(
        { latitude: row.latitude, longitude: row.longitude },
        pointIcon,
        { width: 32, height: 32 }
      );
      this.$map["overSpeed"].addOverlay(mapPoint);
      this.$map["overSpeed"].moveToCenter(point, 17);
      this.$map["overSpeed"].openInfoWindow(
        content,
        { offset: new BMap.Size(-7, -3) },
        point
      );
      this.$map["overSpeed"].overlayClickOpenInfoWindow(
        mapPoint,
        point,
        content,
        callbackInfoWindow,
        {}
      );
    },
    //地图弹窗
    tContent(data) {
      let content =
        `<div>
                            <span>车牌号码: ` +
        data.plateCode +
        `</span>
                            <br>
                            <span>速度: ` +
        data.speed +
        ` km/h (速度底线: ` +
        this.minSpeed +
        ` km/h)</span>
                            <br>
                            <span>起始时间: ` +
        data.gpsTime +
        `</span>
                            <br>
                            <span>位置描述: ` +
        data.locationDescribe +
        `</span>
                          </div>`;
      return content;
    },
    //车辆信息表格
    vehicleGridLoad(vehicleIds, flag) {
      if (flag) {
        this.vehicleGrid.options.flag = true;
        this.vehicleGrid.options.current = 1;
      } else {
        this.vehicleGrid.options.flag = false;
      }
      let params = {
        current: this.vehicleGrid.options.current,
        size: this.vehicleGrid.options.size,
        vehicleStr: vehicleIds || this.vehicleIds,
        queryTime: this.$filter.format(this.searchTime, "yyyy-MM-dd"),
        minimumSpeed: this.minSpeed,
        isCompress: false
      };
      this.vehicleGrid.loading = true;
      this.findSpeedingPointsCountInfo(params)
        .then(data => {
          data.flag
            ? ((this.vehicleGrid.table = data.data),
              (this.vehicleGrid.loading = false))
            : ((this.vehicleGrid.loading = false),
              this.$message.error({
                message: this.$t("error." + data.errorCode)
              }));
          this.overGridLoad(this.vehicleId, true);
        })
        .catch(_ => {
          this.$message.error("网络异常");
          this.vehicleGrid.loading = false;
        });
    },
    //超速详细表格
    overGridLoad(vehicleIds, flag) {
      if (flag) {
        this.overGrid.options.flag = true;
        this.overGrid.options.current = 1;
      } else {
        this.overGrid.options.flag = false;
      }
      let params = {
        current: this.overGrid.options.current,
        size: this.overGrid.options.size,
        vehicleStr: vehicleIds || this.vehicleId,
        queryTime: this.$filter.format(this.searchTime, "yyyy-MM-dd"),
        minimumSpeed: this.minSpeed,
        isCompress: false
      };
      this.overGrid.loading = true;
      this.findSpeedingPointsListInfo(params)
        .then(data => {
          data.flag
            ? ((this.overGrid.table = data.data.records),
              (this.overGrid.options.total = data.data.total),
              (this.overGrid.loading = false))
            : ((this.overGrid.loading = false),
              this.$message.error({
                message: this.$t("error." + data.errorCode)
              }));
        })
        .catch(_ => {
          this.$message.error("网络异常");
          this.overGrid.loading = false;
        });
    },
    //轨迹详细表格
    detailGridLoad(vehicleIds, flag, times) {
      if (flag) {
        this.detailGrid.options.flag = true;
        this.detailGrid.options.current = 1;
      } else {
        this.detailGrid.options.flag = false;
      }
      let params = {
        current: this.detailGrid.options.current,
        size: this.detailGrid.options.size,
        id: vehicleIds || this.vehicleId,
        startTime: this.detailTimes[0],
        endTime: this.detailTimes[1],
        minimumSpeed: this.minSpeed,
        mapType:this.$store.getters.mapType
      };
      this.detailGrid.loading = true;
      this.findVehicleSpeedDetailListInfo(params)
        .then(data => {
          data.flag
            ? ((this.detailGrid.table = data.data.records),
              (this.detailGrid.options.total = data.data.total),
              (this.detailGrid.loading = false))
            : ((this.detailGrid.loading = false),
              this.$message.error({
                message: this.$t("error." + data.errorCode)
              }));
        })
        .catch(_ => {
          this.$message.error("网络异常");
          this.detailGrid.loading = false;
        });
    },
    //点击搜索
    search() {
      if (this.vehicleIds == "") {
        this.$message.warning("请选择车辆");
        return false;
      }
      if (!/^[0-9]*$/.test(this.minSpeed)) {
        this.$message.error("请输入正确的速度底线");
        return false;
      }
      this.tabActive = "sCar";
      this.$map["overSpeed"].clearOverlays();
      this.vehicleGridLoad(null, true);
      this.detailGrid.table = [];
      //   this.detailGridLoad(this.vehicleId, true);
    },
    //导出
    outPut() {
      if (this.vehicleGrid.table.length == 0) {
        this.$message.warning("数据为空");
        return false;
      }
      if (this.tabActive == "sCar") {
        const exportUrl = this.$service.winParams(
          this.$COMMON.baseUrl + "/report/exportSpeedingPointsListInfo",
          {
            vehicleStr: this.vehicleId,
            queryTime: this.$filter.format(this.searchTime, "yyyy-MM-dd"),
            minimumSpeed: this.minSpeed,
            isCompress: false
          }
        );
        window.location.href = exportUrl;
      } else {
        const exportUrl1 = this.$service.winParams(
          this.$COMMON.baseUrl + "/report/exportVehicleSpeedDetailListInfo",
          {
            id: this.vehicleId,
            startTime: this.detailTimes[0],
            endTime: this.detailTimes[1],
            minimumSpeed: this.minSpeed
          }
        );
        window.location.href = exportUrl1;
      }

      //   console.log(this.tabActive);
    }
  },
  watch: {
    //车辆树点击存储车辆id
    "$store.getters.ptMultiCar"(newVal) {
      let vids = [];
      newVal.forEach(ele => {
        vids.push(ele.id);
      });
      this.vehicleIds = vids.join(",");
      this.vehicleId = newVal[0].id;
    }
  }
};
</script>
<style lang="scss">
.overSpeed {
  .left,
  .right {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 40%;
    .leftTop,
    .leftBottom {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 50%;
      padding: 5px;
    }
    .leftBottom {
      top: 40%;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  .right {
    left: 60%;
    right: 0;
  }
  .el-table .cell,
  .el-table th > div {
    padding-left: 5px;
    padding-right: 5px;
  }
  .listTitle {
    color: #20a0ff;
  }
  .listTitle:hover {
    cursor: pointer;
  }
  .downLoad {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 2;
    font-size: 20px;
  }
  .downLoad:hover {
    cursor: pointer;
  }
}
</style>
