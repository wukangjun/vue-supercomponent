<template>
  <div class="alarmbox">
    <el-tabs class="tab">
      <el-tab-pane v-for="elTabs in options.elTabPanes" :key="elTabs.name" :label="elTabs.name">
         <component :is="elTabs.component" :options="dialogClosed"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
 // import modifyPass from '@/components/modifypass/modifyPass.vue'
 import modifyPass from './modifyPass.vue'
export default{
    components: {modifyPass},
    props: {
      options: {
      }
    },
    data(){
      return{
        dialogClosed:{
          flag:true
        },
      }
    },
    watch:{
      "dialogClosed.flag"(newVal){
        this.options.flag = newVal
      }
    }
    
  }
</script>
<style lang='scss'>
.alarmbox{
    width:100%;
    .textcenter{
      text-align: center;
    }
}

</style>
