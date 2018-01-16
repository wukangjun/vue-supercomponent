<template>
    <div>
        <div class="mapbase" :id="id" style="z-index:0;"></div>
        <change-map v-show="isMap"></change-map>
        <el-cascader   
            v-show="false"
            v-model="cityText"       
            :options="citys"
            :show-all-levels="false"
            :props="props"
            @change="changeLocation"
            style="position:absolute;right:20px;top:80px"
            ></el-cascader>
    </div>
</template>
<script>
import changeMap from "./changeMap.vue";
import MapApi from "./src/gaode.map";
import cityData from "./src/cityData";
export default {
  components: {
    changeMap
  },
  name: "gaodeMap",
  props: {
    isMap:{
      default:false
    },
    id: {
      default: "map"
    },
    // 传入的地图点信息
    point: {
      type: Object
    }
  },
  data() {
    return {
      // changeMapType: '2',
      map: null,
      mapApi: null,
      mapReady: true,
      citys: cityData,
      cityText: [],
      placeSearch: null,
      props: {
        value: "name",
        label: "name",
        children: "child"
      }
    };
  },
  methods: {
    getMapScript() {
      if (!global.AMap) {
        let ak = "edfc1f354a8b8203758949cf999b8b4b";
        global.AMap = {};
        global.AMap._preloader = new Promise((resolve, reject) => {
          global._initGaode = function() {
            resolve(global.AMap);
            global.document.body.removeChild($script);
            global.AMap._preloader = null;
            global._initGaode = null;
          };
          const $script = document.createElement("script");
          global.document.body.appendChild($script);
          $script.src = `http://webapi.amap.com/maps?v=1.4.2&key=${ak}&callback=_initGaode`;
        });
        return global.AMap._preloader;
      } else if (!global.AMap._preloader) {
        return Promise.resolve(global.AMap);
      } else {
        return global.AMap._preloader;
      }
    },
    mapInit() {
      this.map = new AMap.Map(this.id, {
        resizeEnable: true
      });
      // 服务的写法
      this.$map[this.id] = new MapApi(this.map);
      // 组件写法
      this.mapApi = new MapApi(this.map);

      setTimeout(() => {
        this.$emit("ready");
        this.loadControl();
      }, 200);
    },
    loadControl() {
      let control = this.$map.control,
        controlMethods = this.controlMethods();
      control.forEach(val => {
        if (!this.$service.isUndefined(val)) {
          controlMethods[val]();
        }
      });
    },
    controlMethods() {
      let { map } = this;
      return {
        // 比例尺
        ScaleControl() {
          map.plugin(["AMap.Scale"], function() {
            var scale = new AMap.Scale({
              offset: new AMap.Pixel(20, 60)
            });
            map.addControl(scale);
            scale.show();
          });
        },
        // 平移控件
        NavigationControl() {
          map.plugin(["AMap.ToolBar"], function() {
            //加载工具条
            var tool = new AMap.ToolBar({
              position: "RB",
              offset: new AMap.Pixel(20, 140)
            });
            map.addControl(tool);
          });
        },
        CityListControl() {},
        // 添加地图缩略图
        OverviewMapControl() {
          map.plugin(["AMap.OverView"], function() {
            var view = new AMap.OverView({
              isOpen: true
            });
            map.addControl(view);
          });
        }
      };
    },
    createScript(url) {
      if (!this.$service.isUndefined(url)) {
        var script = document.createElement("script");
        script.src = url;
        global.document.body.appendChild(script);
      }
    },
    changeLocation(val) {
      // 改变值定位坐标
      let { map } = this;
    },
    /**
         * 对单点操作
         * @params
         * 
        */
    _point(mess) {
      if (this.mapReady && this.mapApi) {
        let marker = this.mapApi.mapAddpoint(
          {
            longitude: Number(mess.mapLongitude),
            latitude: Number(mess.mapLatitude)
          },
          this.$filter.isOnline(mess),
          { width: 32, height: 32 }
        );
        marker.label = this.mapApi.addLabel(marker, mess.plateCode);
        this.mapApi.addOverlay(marker);
        this.mapApi.moveToCenter(marker.point);
      }
    }
  },
  watch: {
    point(newVal) {
      // 先清除
      this.mapApi.clearOverlays();
      if (!this.$service.isEmptyObject(newVal)) {
        this._point(newVal);
      }
    }

  },
  mounted() {
    const { getMapScript, mapInit } = this;
    getMapScript().then(mapInit);
  }
};
</script>

<style lang="scss">
.mapbase {
  width: 100%;
  height: 100%;
  min-height: 100px;
}
</style>


