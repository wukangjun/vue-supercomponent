<template>
<div class="">
  <!-- 表格 -->
  <cv-grid class="" :options="grid.options" @load="load">
    <el-table border stripe :data="grid.table" v-loading="grid.loading" height=400>
      <el-table-column :label="$t('企业ID')" prop="enterpriseId" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column :label="$t('查岗内容')" prop="inspectQuestion" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column :label="$t('应答时间')" prop="answerTime" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column :label="$t('应答内容')" prop="answer" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column :label="$t('创建时间')" prop="createTime" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column :label="$t('查岗类型')" prop="inspectType" :show-overflow-tooltip="true" :formatter="TypeS"></el-table-column>
      <el-table-column :label="$t('操作')">
        <template scope="scope">
            <span v-show="!!scope.row.answer">已回复</span>
            <el-button v-show="!scope.row.answer" type="text" @click="answer(scope.row)">回复</el-button>
        </template>
      </el-table-column>
        </el-table>
     </cv-grid>
   </div>
</template>
<script>
export default {
  props: {
    options: {}
  },
  components: {},
  mixins: [""],
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
      };
      this.grid.loading = true;
      this.$http({
          url: this.$COMMON.baseUrl + '/inspectTheSentry/queryInspectSentryInfo',
          params: params
        })
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
    },
    answer(pars) {
      this.options.dialog1.flag = true;
      this.options.dialog1.name = 'answer'
      this.options.dialog1.params = pars;
      this.options.dialog1.refresh1 = false;
      this.options.dialog1.refresh2 = false;
    },
    TypeS(row) {
      switch (row.inspectType) {
        case 1:
          return "查询平台";
          break;
        case 2:
          return "查询业户";
          break;
        case 3:
          return "查询业户和平台";
          break;
      }
    }
  },
  watch: {
    "options.dialog1.flag" (newVal) {
      if (!newVal) {
        setTimeout(_=>{
          (this.options.dialog1.refresh2 || this.options.dialog1.refresh1 ) && this.load(true);
        },500)
        this.options.dialog1.name = ''
        this.options.dialog1.refresh1 = false;
        this.options.dialog1.refresh2 = false;
      }
    }
  },
  mounted() {
    this.load(true);
  }
};
</script>
<style lang="scss">

</style>
