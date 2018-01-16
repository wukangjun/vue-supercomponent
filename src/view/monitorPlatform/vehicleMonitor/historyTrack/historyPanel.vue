<template>
	<div class="history-track">
		
		    <el-tabs class="tabs" v-model="tabActive" @tab-click="tabClick">
				<el-tab-pane name="first" label="按行程">
					<cv-scrollbar class="messArea" :style="{'position':'absolute','top':'0px','left':'0','right':'0','bottom':alarmMap.length==0?'140px':'200px'}">
						<h2 v-show="listST.length==0" class="emptyData">数据为空</h2>
						<ul class="trackUl">
							<li class="trackItem" @click="lookTrack(index, 'track', st)" v-for="(st,index) in listST" ref="track" v-show="listST.length!==0" :key="st.id">
								<div class="track-title">
                  	<i class="el-icon-tsp-map-marker map-icon"></i>
                  <span style="margin-left:-5px;">行程{{index+1}}</span>
									<span class="timeword">
										{{st.startTime | format('yyyy/MM/dd HH:mm')}} ~
										{{st.endTime | format('yyyy/MM/dd HH:mm')}}
									</span>
								</div>
								<div class="track-num">
									<i class="el-icon-tsp-circle circle-icon green"></i>
									<span>平均 {{st.avgOilConsumption}}L/100km</span>
									<span class="rightword"> 油耗 {{st.oilConsumption}}L</span>
								</div>
								<div class="track-num">
									<i class="el-icon-tsp-circle circle-icon red"></i>
									<span>海拔 {{st.minHigh}}-{{st.maxHigh}} m</span>
									<span class="rightword"> 里程 {{st.mileage}}km</span>
								</div>
							</li>
						</ul>
					</cv-scrollbar>				
				</el-tab-pane>
				<el-tab-pane name="second" label="按足迹">
					<cv-scrollbar class="messArea" :style="{'position':'absolute','top':'0px','left':'0','right':'0','bottom':alarmMap.length==0?'140px':'200px'}">
						<h2 v-show="listCounty.length==0" class="emptyData">数据为空</h2>
						<ul class="trackUl">
							<li class="trackItem" @click="lookTrack(index, 'country', st)" v-for="(st,index) in listCounty" ref="country" v-show="listCounty.length!==0" :key="st.id">
								<div class="track-title">
                  <i class="el-icon-tsp-map-marker map-icon"></i>
                  <span style="margin-left:-5px;">行程{{index+1}}</span>
									<span class="timeword">
										{{st.startTime | format('yyyy/MM/dd HH:mm')}} ~
										{{st.endTime | format('yyyy/MM/dd HH:mm')}}
									</span>
								</div>
								<div class="track-num">
									<i class="el-icon-tsp-circle circle-icon green"></i>
									<span>平均 {{st.avgOilConsumption}}L/100km</span>
									<span class="rightword"> 油耗 {{st.oilConsumption}}L</span>
								</div>
								<div class="track-num">
									<i class="el-icon-tsp-circle circle-icon red"></i>
									<span>海拔 {{st.minHigh}}-{{st.maxHigh}} m</span>
									<span class="rightword"> 里程 {{st.mileage}}km</span>
								</div>
							</li>
						</ul>
					</cv-scrollbar>				
				</el-tab-pane>
			</el-tabs>
			<cv-scrollbar v-if="alarmMap.length==0?false:true" class="alarmPoints">
        <div>
            <li class="alarm-item" v-for="(alarm, index) in alarmMap" @click="showAlarmPoint(index, alarm)" ref="alarm" :key="alarm.id">
              <div class="alarm-name">{{alarm.alarmName}}({{alarm.alarmCount}})</div>
            </li>
        </div>
			</cv-scrollbar>
      <cv-scrollbar class="detailMess">
        <div class="container">
            <span v-if="isAllMess">共经过了{{selfPart}}个路段</span>
            <div v-if="isAllMess" class="row">
              <span>总里程: {{mileageTotal | isValue('km')}} </span>
              <span>总油耗: {{oilTotal | isValue('L')}} </span>
            </div>
            <div v-if="!isAllMess" class="row">
              <span>本段里程: {{selfMile | isValue('km')}}</span>
              <span>本段油耗: {{selfOil | isValue('L')}}</span>
            </div>
            <div v-if="isAllMess" class="row">
              <span>平均油耗: {{averageOil|toFixed(2) | isValue('L/100km') }}</span>
              <span>平均车速: {{averageSpeed |toFixed(2)| isValue('km/h') }}</span>
            </div>
            <div v-if="!isAllMess" class="row">
              <span>平均油耗: {{selfAvgOil | isValue('L/100km')}}</span>
              <span>平均车速: {{selfAvgSpeed | isValue('km/h')}}</span>
            </div>
        </div>
      </cv-scrollbar>
	</div>
</template>

<script>
import unknow from "@/assets/img/map/red1.png";
export default {
  props: {
    data: {},
    allPointArry:{},
    allAbillity: {},
    allCanDatas: {},
    bestViewPoint: {}
  },
  mixins: [],
  data() {
    return {
      bestViewPoints: null,
      allGpsPoint: null,
      allPoints:null,
      allAbillityIds: null,
      allCanData: null,
      lastItem: null,
      delIndex: null,
      isAllMess: true,
      tabActive: "first",
      mileageTotal: "",
      averageOil: "",
      averageSpeed: "",
      oilTotal: "",
      selfPart: "--",
      selfMile: "--",
      selfOil: "--",
      selfAvgOil: "--",
      selfAvgSpeed: "--",
      listST: [],
      listCounty: [],
      alarmMap: [],
      markerCurrent: {},
      allData: null,
      num: 0,
      curIndex: 0, //轨迹下标
      trackSpeed: null,
      addPoint: null,
      playFalg: false,
      trackChage: false,
      allLinePoint: [], //所有的线路点
      alarmInfoPoint: null, //报警弹框主体
      alarmMarkerGroup: [], // 报警点的marker集合
      alarmPoints: [] // 报警点的point集合
    };
  },
  watch: {
    data(newVal) {
      this.listST = [];
      this.listCounty = [];
      this.alarmMap = [];
      this.allGpsPoint = newVal;
    },
    allAbillity(newVal) {
      this.allAbillityIds = newVal;
    },
    allPointArry(newVal){
      this.allPoints=newVal;
    },
    allCanDatas(newVal) {
      this.allCanData = newVal;
    },
    bestViewPoint(newVal) {
      this.bestViewPoints = newVal;
    },
    "$store.getters.mileageTotal"(newVal) {
      this.mileageTotal = newVal;
    },
    "$store.getters.averageOil"(newVal) {
      this.averageOil = newVal;
    },
    "$store.getters.averageSpeed"(newVal) {
      this.averageSpeed = newVal;
    },
    "$store.getters.oilTotal"(newVal) {
      this.oilTotal = newVal;
    },
    "$store.getters.listST"(newVal) {
      this.listST = newVal;
      this.selfPart = newVal.length;
    },
    "$store.getters.listCounty"(newVal) {
      this.listCounty = newVal;
    },
    "$store.getters.alarmListMap"(newVal) {
      this.alarmMap = newVal;
    },
    lastItem(newVal, oldVal) {
      this.delIndex = oldVal;
    }
  },
  methods: {
    //tab切换
    tabClick(tab, event) {
      switch (tab.index) {
        case "0":
          this.selfPart = this.listST.length;
          break;
        case "1":
          this.selfPart = this.listCounty.length;
          break;
      }
      for (let k in this.markerCurrent) {
        this.$map["map"].removeOverlay(this.markerCurrent[k]);
        this.markerCurrent[k] = null;
      }
      this.isAllMess = true;
      this.$store.dispatch("addTrackLists", this.allGpsPoint);
      this.$store.dispatch("addTrackPoints", this.allPoints);
      this.$store.dispatch("addTrackAbillity", this.allAbillityIds);
      this.$store.dispatch("addCanData", this.allCanData);
      this.$refs["track"] &&
        this.$refs["track"].forEach(val => {
          this.$myJq.removeClass(val, "trackCurrent");
        });
      this.$refs["country"] &&
        this.$refs["country"].forEach(val => {
          this.$myJq.removeClass(val, "trackCurrent");
        });
      this.$map["map"].getBestView(this.bestViewPoints);
    },
    // 查看单条信息的轨迹
    lookTrack(index, name, line) {
      this.lastItem = index;
      this.selfMile = line.mileage;
      this.selfOil = line.oilConsumption;
      this.selfAvgOil = line.avgOilConsumption;
      this.selfAvgSpeed = line.avgSpeed;
      let points = [],
        track = JSON.parse(line.locationTrackJson),
        self = this.$refs[name][index],
        bestViewPoints = null,
        bPoints=[];
      this.$refs["track"] &&
        this.$refs["track"].forEach(val => {
          this.$myJq.removeClass(val, "trackCurrent");
        });
      this.$refs["country"] &&
        this.$refs["country"].forEach(val => {
          this.$myJq.removeClass(val, "trackCurrent");
        });
      if (this.$service.isArray(track) && track.length > 0) {
        // console.log(1)
        // console.log(points)
        track.forEach(val => {
          points.push({ lng: val.mapLongitude, lat: val.mapLatitude });
        });
        if (this.playFalg) {
        // console.log(2)
        // console.log(points)
          this.trackChage = true;
          this.$store.dispatch("setTrakchanges", this.trackChage);
        }
        if (this.markerCurrent[index]) {
          // console.log(3)          
          this.$myJq.removeClass(self, "trackCurrent");
          this.$map["map"].removeOverlay(this.markerCurrent[index]);
          this.markerCurrent[index] = null;
          this.isAllMess = true;
          this.$store.dispatch("addTrackLists", this.allGpsPoint);
          this.$store.dispatch("addTrackPoints", this.allPoints);
          this.$store.dispatch("addTrackAbillity", this.allAbillityIds);
          this.$store.dispatch("addCanData", this.allCanData);
          bestViewPoints = this.$store.getters.trackLists;
          bestViewPoints.forEach(ele=>{
            bPoints.push({ lng: ele.mapLongitude, lat: ele.mapLatitude });
          })
          this.$map['map'].getBestView(bPoints);
          // console.log(bPoints)
        } else {
          // console.log(4)
          for (let i in this.markerCurrent) {
            i != index &&
              (this.$map["map"].removeOverlay(this.markerCurrent[i]),
              (this.markerCurrent[i] = null));
          }
          this.$myJq.addClass(self, "trackCurrent");
          this.$map['map'].getBestView(points);
          this.markerCurrent[index] = this.$map["map"].mapAddline(points, {
            strokeWeight: 6,
            strokeColor: "#35ca89"
          });
          this.$store.dispatch("addCanData", track);
          this.$store.dispatch("addTrackLists", track);
          this.$store.dispatch("addTrackPoints", points);
          this.isAllMess = false;
          // console.log(points)
          
        }
      }
      // console.log('final')
      // console.log(bPoints);
      // this.$map['map'].getBestView(bPoints);
    },
    // 查看单条报警信息点
    showAlarmPoint(index, alarm, flag) {
      let self = this.$refs["alarm"][index];
      this.alarmPoints = [];
      // 高亮当前报警
      this.alarmInfoPoint != null &&
        this.$map["map"].closeInfoWindow(this.alarmInfoPoint);
      if (this.alarmMarkerGroup.length > 0) {
        this.alarmMarkerGroup.forEach(marker => {
          this.$map["map"].removeOverlay(marker);
        });
        this.alarmMarkerGroup = [];
      }
      if (!this.$myJq.hasClass(self, "alarmCurrent") || flag) {
        this.$refs["alarm"].forEach(val => {
          this.$myJq.removeClass(val, "alarmCurrent");
        });
        this.$myJq.addClass(self, "alarmCurrent");
        if (
          this.$service.isArray(alarm.locationList) &&
          alarm.locationList.length > 0
        ) {
          alarm.locationList.forEach(val => {
            this.makePoint({
              lng: val.longitude,
              lat: val.latitude,
              location: val.locationName,
              name: alarm.alarmName
            });
          });
          if (this.playFalg) {
            this.trackChage = true;
            this.$store.dispatch("setTrakchanges", this.trackChage);
          }
          this.alarmPoints.length > 0 &&
            this.$map["map"].getBestView(this.alarmPoints);
        }
      } else {
        this.$myJq.removeClass(self, "alarmCurrent");
      }
    },
    getPointInfo(cbk) {
      this.alarmInfoPoint = cbk;
    },
    makePoint({ lng, lat, location, name }) {
      let marker = this.$map["map"].mapAddpoint(
          {
            longitude: Number(lng),
            latitude: Number(lat)
          },
          unknow,
          { width: 36, height: 36 }
        ),
        context = `<div class="maptitle">报警信息</div>
							<div class="mapcontent">报警名称:${name} </div>
							<div class="mapcontent">位置:${location == ""
                ? "未获取到报警位置信息"
                : location} </div>`;
      this.alarmMarkerGroup.push(marker);
      this.alarmPoints.push(marker.point);
      this.$map["map"].overlayClickOpenInfoWindow(
        marker,
        marker.point,
        context,
        this.getPointInfo
      );
      this.$map["map"].addOverlay(marker);
    }
  },
  destroyed() {
    // 监控关闭
    clearInterval(this.trackSpeed);
    this.curIndex = 0;
    this.allData = null;
    this.allLinePoint = [];
    this.$store.dispatch("setTrackIndex", 0);
  }
};
</script>

<style lang="scss">
$gray: #d1dbe5;
$selectH: 28px;
$messH: 32px;
.mapcontent {
  margin-top: 6px;
}
.history-track {
  .picker {
    width: 94%;
    margin: 10px 3% 0 3%;
  }
  .tabs {
    width: 100%;
    position: absolute;
    top: 0px;
    bottom: 0px;
    .el-tabs__item {
      font-size: 12px;
    }
    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__content {
      width: 100%;
      position: absolute;
      top: 45px;
      bottom: 0px;
    }
    .emptyData {
      text-align: center;
      color: #ccc;
      margin-top: 100px;
    }
    .trackUl {
      .trackCurrent {
        background: #b3dbf9;
      }
      .trackItem {
        cursor: pointer;
        &:hover {
          background: #b3dbf9;
        }
        .track-title {
          height: $messH;
          line-height: $messH;
          background: $gray;
          .time-icon {
            font-size: 16px;
            line-height: 32px;
            padding: 0 3px 0 6px;
            color: #35be36;
          }
          .map-icon {
            font-size: 18px;
            color: #20a0ff;
            vertical-align: top;
            margin-top:6px;
          }
          .timeword {
            vertical-align: top;
            float:right;
            margin-right:10px;
          }
        }
        .track-num {
          position: relative;
          height: $messH;
          line-height: $messH;
          .circle-icon {
            font-size: 16px;
            color: #20a0ff;
            vertical-align: text-bottom;
            padding-left: 15px;
          }
          .green {
            color: #35be36;
          }
          .red {
            color: red;
          }
          .rightword {
            position: absolute;
            right: 0;
            padding-right: 10px;
          }
        }
      }
    }
  }
  .alarmPoints {
    width: 100%;
    position: absolute;
    height: 60px;
    bottom: 86px;
    border-top: 1px solid $gray;
    border-bottom: 1px solid $gray;
    .alarmCurrent {
      background: #b3dbf9;
    }
    .alarm-item {
      cursor: pointer;
      height: 32px;
      line-height: 32px;
      border-bottom: 1px solid $gray;
      .alarm-name {
        display: inline-block;
        padding-left: 20px;
      }
    }
  }
  .detailMess {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 86px;
    .container {
      padding: 10px 5px;
      .row {
        margin: 5px 0;
        span {
          width: 49.5%;
        }
        span:nth-child(2) {
          float: right;
        }
      }
    }
  }
}

</style>