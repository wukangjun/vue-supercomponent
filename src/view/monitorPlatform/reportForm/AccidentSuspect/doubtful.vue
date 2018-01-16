<template>
<div  class="mian" style="min-height:450px;" >
        <el-form :inline="true" style="padding-left:10px" :model="options.form">
         <el-form-item label="停车时间">
             <el-input  v-model="options.form.stopTime" size="small" style="width:200px" :disabled="true" ></el-input>
        </el-form-item>
         <el-form-item label="车牌号">
             <el-input  v-model="options.form.plateCode" placeholder="" size="small" :disabled="true"></el-input>
        </el-form-item>
         <el-form-item label="位置">
             <el-input  v-model="options.form.address" placeholder="" size="small" :disabled="true"></el-input>
        </el-form-item>
	 </el-form>
     <div class="content" >
        <el-tabs  v-model="activeName">
      	    	<!-- 疑点图表显示 -->
            <el-tab-pane label="疑点报表" name="DA" >
               <echart name='line' class="propChart" :data="dataItem"  style="width:100%;height:350px;" ></echart>
            </el-tab-pane> 
			<!-- 当前告警列表 -->
            <el-tab-pane label="疑点详情" name="DB">
                <cv-grid :options="gridT.options" @load="searchTable(false)" >
                    <el-table border stripe :data="gridT.table" v-loading="gridT.loading" ref="table" :max-height="height"  style="position:relative;z-index=999;" >
                        <el-table-column label="上报时间" prop="reptime" min-width="100px" :show-overflow-tooltip="true"  ></el-table-column>
                        <el-table-column label="车速(km/h)"  prop="speed" :show-overflow-tooltip="true"  min-width="130px">    
                        </el-table-column>
                        <el-table-column label="加速" :show-overflow-tooltip="true" prop="signal0" min-width="150px">    
                        </el-table-column>
                        <el-table-column label="避震" :show-overflow-tooltip="true" prop="signal1" min-width="150px">    
                        </el-table-column>
                        <el-table-column label="减速" :show-overflow-tooltip="true" prop="signal2" min-width="150px">    
                        </el-table-column>
                        <el-table-column label="近光" :show-overflow-tooltip="true" prop="signal3" min-width="150px">    
                        </el-table-column>
                        <el-table-column label="远光" :show-overflow-tooltip="true" prop="signal4" min-width="150px">    
                        </el-table-column>          
                    </el-table>
                </cv-grid>
            </el-tab-pane>
	
            <!-- 地图显示 -->
            <el-tab-pane label="疑点位置" name="DC" class="map">
                <component :is="$store.getters.mapName" style="width: 100%;height:400px;overflow: hidden;margin:0;" id="mapDb" @ready="allReady"></component>
            </el-tab-pane> 
            </el-tabs>
     </div>
		<div  style="text-algin:right;margin-top:20px">
			<el-button @click="options.flag=false" size="small">关闭</el-button>
		</div>
</div>
</template>
<script>
import echart from "@/components/echart/echart.vue";
import pointIcon from "@/assets/img/map/green2.png";
import zip from "@/utils/mixins/zip";
import port from "./index";
export default {
  components: { echart },
  props: {
    options: {}
  },

  mixins: [zip, port],
  data() {
    return {
      content: "",
      height: 300,
      activeName: "DA",
      //表格显示相关的
      gridT: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        table: [],
        loading: false
      },
      //图表相关
      loading: false,
      echartSpeed: {},
      single1: {},
      single2: {},
      single3: {},
      single4: {},
      single5: {},
      single6: {},
      single7: {},
      single8: {},
      dataItem: [],
      //地图相关的
      isPoints: [],
      markerAll: []
    };
  },
  methods: {
    //表格相关的数据请求
    searchTable(flag) {
      this.gridT.loading = true;
      let params = {
        gbId: this.options.id,
        size: this.gridT.options.size,
        current: this.gridT.options.current
      };
      this.troubleRecoirdInfo(params).then(data => {
        if (data.flag && data.length != 0) {
          this.gridT.table = data.data.records;
          this.gridT.options.total = data.data.total;
        } else {
          this.gridT.table = [];
          this.gridT.options.total = 0;
        }
        this.gridT.loading = false;
      });
    },
    //图表相关的
    func1(tar) {
      return "速度(" + tar.value +'km/h'+ ")  " + "<br>" + "时间" + tar.name;
    },
    Chart() {
      let params = {
        gbId: this.options.id
      };
      let _this = this;
      this.queryDoubtFlash(params).then(data => {
        if (data.flag && data.length != 0) {
          _this.echartSpeed.x = data.data.reptime;
          _this.echartSpeed.y = data.data.speed;
          _this.single1.x = data.data.reptime;
          _this.single1.y = data.data.single1;
          _this.single2.x = data.data.reptime;
          _this.single2.y = data.data.single2;
          _this.single3.x = data.data.reptime;
          _this.single3.y = data.data.single3;
          _this.single4.x = data.data.reptime;
          _this.single5.y = data.data.single4;
          _this.single5.x = data.data.reptime;
          _this.single5.y = data.data.single5;
          _this.single6.x = data.data.reptime;
          _this.single6.y = data.data.single6;
          _this.getCarCount(_this.echartSpeed);
        }
      });
    },
    getCarCount(data) {
      let _this = this;
      let option = {
        tooltip: {
          formatter(params) {
            var tar = params;
            var txt = _this.func1(tar);
            return txt;
          }
        },
        grid: {  
        left: '10%',  
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: _this.getArry(data.x),
        },
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: name,
            type: "line",
            itemStyle: {
              normal: {
                color: "rgb(64, 203,55)"
              }
            },
            symbolSize: 8,
            lineStyle: { normal: { width: 3 } },
            data: data.y
          }
        ]
      };
      this.dataItem = option;
    },
    getArry(ary) {
      var _ary = [];
      for (var i = 0; i < ary.length; i++) {
        _ary.push(ary[i]);
      }
      return _ary;
    },
    //地图画点
    allReady() {
      this.LoadgridT();
    },
    //地图相关显示
    LoadgridT() {
      let params = {
        gbId: this.options.id,
        mapType: this.$store.getters.mapType
      };
      //   this.gridT.loading = true;
      this.$http({
        url: this.$COMMON.baseUrl + "/driverRecord/queryDoubtAddr",
        params: params
      }).then(data => {
        if (!data.flag && !!data.errorCode)
          this.$message.error({ message: this.$t("error." + data.errorCode) });
        else {
          this.isPoints = data.data;
          let that = this;
          let callbackInfoWindow = function(infoWindow) {
            that.infoWindow = infoWindow;
          };
          if (this.isPoints.speed == null) {
            this.isPoints.speed = "--";
          }
          let content = this.tContent(this.isPoints);
          let point = this.$map["mapDb"].point({
            lat: this.isPoints.lat,
            lng: this.isPoints.lng
          });
          let mapPoint = this.$map["mapDb"].mapAddpoint(
            { latitude: this.isPoints.lat, longitude: this.isPoints.lng },
            pointIcon,
            { width: 32, height: 32 }
          );
          this.$map["mapDb"].addOverlay(mapPoint);
          this.$map["mapDb"].moveToCenter(point, 17);
          this.$map["mapDb"].openInfoWindow(
            content,
            { offset: new BMap.Size(-7, -3) },
            point
          );
          this.$map["mapDb"].overlayClickOpenInfoWindow(
            mapPoint,
            point,
            content,
            callbackInfoWindow,
            {}
          );
        }
      });
    },

    //地图弹窗
    tContent(data) {
      let content =
        `<div>
                              <span>车速: ` +
        data.speed +
        `</span>
                              <br>
                              <span>位置描述: ` +
        data.address +
        `</span>
                            </div>`;
      return content;
    }
  },
  mounted() {
   
  },
  watch: {
    "options.flag"(newVal) {
       this.searchTable();
    this.Chart();
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  .content {
    position: relative;
  }
}
</style>