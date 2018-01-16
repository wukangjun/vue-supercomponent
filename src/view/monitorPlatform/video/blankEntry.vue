<template>
  <div class="cv-multimedia-manage">
    <el-form class="cv-header">
    </el-form>
    <cv-content>
      <div v-if="!$service.isIe()" style='height:200px;line-height:200px;text-align:center;font-size:24px;margin-top:200px;'>该视频播放只支持IE浏览器，请用IE浏览器打开!</div>
       <div v-if="$service.isIe()&&!getDataFlag" style='height:200px;line-height:200px;text-align:center;font-size:24px;'>请先选择车辆!</div>
    </cv-content>
  </div>
</template>

<script type="text/javascript">
export default {
    data(){
      return{
        getDataFlag:false,
        loginTransData:'',
      }
    },
    methods:{
      //得到登陆数据
      getLoginData(newVal){
          this.$store.dispatch('getVideoLogin', newVal.id);
      }
    },

    watch: {
    '$store.getters.ptSingleCar'(newVal){
       this.choseCar = newVal;
       this.getLoginData(newVal);
     }
    },
    mounted() {
     
    }
}
</script>
<style lang="scss">
</style>