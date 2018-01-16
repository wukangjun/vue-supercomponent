<template>
   <div class="">
       <!-- 表格 -->
       <cv-grid class="" :options="grid.options" @load="load">
          <el-table border stripe :data="grid.table" v-loading="grid.loading" height=400>
              <el-table-column :label="$t('事件类型')" prop="typeText" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column :label="$t('事件发生时间')" prop="recordTime" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
       </cv-grid>
   </div>
</template>
<script>
import port from "./index.js";
export default {
  props: {
    options: {}
  },
  components: {},
  mixins: [port],
  data() {
    return {
      grid: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        table: [],
        loading: false
      }
    };
  },
  watch: {
    "options.flag"(newVal) {
      if (!newVal) {
        this.options.name = "";
      }
    }
  },
  methods: {
    load(flag) {
      if (flag) {
        this.grid.options.flag = true;
        this.grid.options.current = 1;
      } else {
        this.grid.options.flag = false;
      }
      let params = {
        current: this.grid.options.current,
        size: this.grid.options.size,
        orderId: this.options.orderId
      };
      this.grid.loading = true;
      this.collectGBExternalPower(params)
        .then(data => {
          if (data.flag && data.data.length != 0) {
            this.grid.table = data.data.records;
            this.grid.options.total = data.data.total;
            this.grid.options.current = data.data.current;
          } else {
            this.grid.table = [];
            this.grid.options.total = 0;
          }
          this.grid.loading = false;
        })
        .catch(_ => {
          this.grid.loading = false;
        });
    }
  },
  mounted() {
    this.load(true);
  }
};
</script>
<style lang="scss">

</style>
