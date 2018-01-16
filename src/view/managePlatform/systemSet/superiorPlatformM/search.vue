<template>
   <div class="">
       <el-form>
           <el-form-item :label="$t('协议：')">
               <el-input v-model="options.searchData.protocolName" ></el-input>
           </el-form-item>
           <el-form-item :label="$t('平台：')">
               <el-input v-model="options.searchData.remark"></el-input>
           </el-form-item>
       </el-form>
       <el-col :span="24" class="dialog-footer" style="padding-top:20px;padding-bottom:10px;">
        <el-button @click="search"  type="primary">{{$t('power.search')}}</el-button>
        <el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
    </el-col>
   </div>
</template>
<script>
export default {
  props:{
      options:{}
  },
  components: {},
  mixins: [],
  data() {
    return {};
  },
  methods: {
      search(){
          this.options.flag = false;
          this.$emit('confirm')
      }
  },
  mounted(){
    //   console.log(this.options)
  }
};
</script>
<style scoped lang="scss">

</style>
