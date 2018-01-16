
<template>
  <div class="TLvideo">
    <div v-if="!$service.isIe()" style='height:200px;line-height:200px;text-align:center;font-size:24px;'>该视频播放只支持IE浏览器，请用IE浏览器打开!</div>
    <el-form v-if="$service.isIe()" class="cv-header" :inline="true">
      <div style="position:absolute; left:45%;top:30px;height:30px;line-height:30px;font-size=18px;">
        请在播放视频之前，下载视频控件！
        <a href="http://lib.cvtsp.com/video/TLMDVRAxSetup.exe" style="color:red;">点击这里下载视频控件</a>
         <!-- <a href="--" style="color:red;">若视频播放有问题，请更新视频控件！</a> -->
      </div>
    </el-form>
    <cv-content v-if="$service.isIe()">
      <!--  <div v-if="$service.isIe()&&!getDataFlag" style='height:200px;line-height:200px;text-align:center;font-size:24px;'>请先选择车辆!</div> -->
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="elTabs in elTabPanes" :name="elTabs.index" :key="elTabs.name" :label="elTabs.name">
          <component :is="elTabs.component"></component>
        </el-tab-pane>
      </el-tabs>
    </cv-content>
  </div>
</template>

<script type="text/javascript">
import onVideo from './onVideo.vue'
import videoReplay from './videoReplay.vue'
export default {
  components: { onVideo, videoReplay },
  data() {
    return {
      elTabPanes: [
        { name: '实时视频播放', component: 'onVideo', index: 'first' },
        { name: '视频回放', component: 'videoReplay', index: 'second' },
      ],
      activeName: 'first',
    }
  },
  methods: {
    getLoginData(newVal) {
      // http({
      //        url: COMMON.baseUrl +'/vehicle/queryVehicleDVRInfo',
      //        // params: { vehicleId: this.choseCar.id }
      //        params: { vehicleId: "5039768947647782" }
      //    }).then((data) => {
      //      console.log(data);
      //      // this.getDataFlag=true;
      //      if(data.flag){
      //        if(data.data.dvrType==13){
      //          this.loginTransData=data.data;
      //          
      //          // console.log(log);
      //        }
      //      }
      //  })

      // this.loginTransData={
      //  portId:'117.74.136.32',
      //  port:'10000',
      //  user:'admin',
      //  psd:'admin',
      //  deviceId:'20170901'
      // };
      // this.getDataFlag=true;
    }
  },

  watch: {

  },
  mounted() {
    // let loginData=JSON.parse(localStorage.getItem("loginData"));
  }
}
</script>
<style lang="scss">
.TLvideo {
  .cv-content {
    left: 10px;
  }
  .el-tabs {
    width: 1250px;
    margin: 0 auto;
  }
  
}

.cv-multimedia-manage {
  .contend {
    position: absolute;
    height: 200px;
    width: 100%;
  }

  .nav {
    width: 350px;
    float: left;
  }

  .btnStyle {
    padding: 0 10px;
    margin: 5px 0;
    button {
      width: 100%;
    }
  }

  .el-date-editor.el-input {
    width: 130px;
  }

  .showTime {
    height: 300px;
    border-top: 1px solid #000;
  }

  .playOperate {
    height: 120px;
    border-top: 1px solid #000;
  }

  .operateleft {
    width: 350px;
    float: left;
  }

  .videoFour {
    width: 800px;
    float: left;
    margin-left: 25px;
    .videoStyle {
      height: 280px;
      margin: 0 10px 10px 0;
    }
  }

  .promptText {
    text-align: center;
    color: red;
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    font-family: "Microsoft Yahei";
  }
}
</style>