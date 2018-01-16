<template>
   <div class="fatigueDriving">
      <cv-header>
           <el-form-item :label="$t('预警起止时间')">
               <el-date-picker :editable="false" v-model="SEtime" :clearable="false" size="small" type="datetimerange" :placeholder="$t('reportForm.onlineRate.selectRange')" :picker-options="pickerOption" style="width:330px">
                </el-date-picker>
           </el-form-item>
           <el-form-item :label="$t('车牌号码')">
               <el-input size="small" v-model="plateCode"></el-input>
           </el-form-item>
           <el-form-item style="float:right;">
               <cv-tool style="margin:0;" :name="$route.name" :data="$store.getters.monitorMenu" class="cv-tool" :is-remove="false" :is-add="false" :is-modify="false" @search="search" @export="outPut"></cv-tool>
           </el-form-item>
      </cv-header> 
      <cv-content :fill="true">
          <!-- tab页签 -->
          <el-tabs class="tabClass" v-model="tabs.activeName">
             <!-- tab内容 -->
             <el-tab-pane :label="$t('统计信息')" name="countInfo">
                 <!-- 表格 -->
                 <cv-grid class="" :options="countInfoGrid.options" @load="countInfoGridLoad(false)">
                   <el-table border stripe :data="countInfoGrid.table" v-loading="countInfoGrid.loading">
                     <el-table-column header-align="center" align="center" :label="$t('车牌号码')" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                     <el-table-column header-align="center" align="center" :label="$t('车牌颜色')" prop="plateColor" :show-overflow-tooltip="true"></el-table-column>
                     <el-table-column header-align="center" align="center" :label="$t('公司名称')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                     <el-table-column header-align="center" align="center" :label="$t('分组名称')" prop="fleetName" :show-overflow-tooltip="true"></el-table-column>
                     <el-table-column header-align="center" align="center" :label="$t('发生次数')" prop="fatigueCount" :show-overflow-tooltip="true"></el-table-column>
                   </el-table>
                 </cv-grid>
             </el-tab-pane>
             <!-- tab内容 -->
             <el-tab-pane :label="$t('明细信息')" name="detailInfo">
                 <!-- 表格 -->
                 <cv-grid class="" :options="detailGrid.options" @load="detailGridLoad(false)">
                   <el-table border stripe :data="detailGrid.table" v-loading="detailGrid.loading">
                     <el-table-column header-align="center" align="center" :label="$t('车牌号码')" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                     <el-table-column header-align="center" align="center" :label="$t('车牌颜色')" prop="plateColor" :show-overflow-tooltip="true"></el-table-column>
                     <el-table-column header-align="center" align="center" :label="$t('公司名称')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                     <el-table-column header-align="center" align="center" :label="$t('分组名称')" prop="fleetName" :show-overflow-tooltip="true"></el-table-column>
                     <el-table-column header-align="center" align="center" :label="$t('报警时间')" prop="happendTime" :show-overflow-tooltip="true"></el-table-column>
                   </el-table>
                 </cv-grid>
             </el-tab-pane>
          </el-tabs>
      </cv-content>
   </div>
</template>
<script>
import prot from "./index.js";
export default {
  components: {},
  mixins: [prot],
  data() {
    return {
      SEtime: [
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd start")
        ),
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd end")
        )
      ],
      plateCode: "",
      tabs: {
        activeName: "countInfo"
      },
      countInfoGrid: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        loading: false,
        table: []
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
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  methods: {
    countInfoGridLoad(flag) {
      if (flag) {
        this.countInfoGrid.options.flag = true;
        this.countInfoGrid.options.current = 1;
      } else {
        this.countInfoGrid.options.flag = false;
      }
      let params = {
        current: this.countInfoGrid.options.current,
        size: this.countInfoGrid.options.size,
        startDate: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
        endDate: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
        plateCode: this.plateCode,
        typeName: 1
      };
      this.countInfoGrid.loading = true;
      this.fatigueStatistics(params)
        .then(data => {
          if (data.flag) {
            this.countInfoGrid.options.total = data.data.total;
            this.countInfoGrid.table = data.data.records;
            this.countInfoGrid.loading = false;
          } else {
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
            this.countInfoGrid.loading = false;
          }
        })
        .catch(_ => {
          this.countInfoGrid.loading = false;
          this.$message.error("网络异常");
        });
    },
    detailGridLoad(flag) {
      if (flag) {
        this.detailGrid.options.flag = true;
        this.detailGrid.options.current = 1;
      } else {
        this.detailGrid.options.flag = false;
      }
      let params = {
        current: this.detailGrid.options.current,
        size: this.detailGrid.options.size,
        startDate: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
        endDate: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
        plateCode: this.plateCode,
        typeName: 0
      };
      this.detailGrid.loading = true;
      this.fatigueStatistics(params)
        .then(data => {
          if (data.flag) {
            this.detailGrid.options.total = data.data.total;
            this.detailGrid.table = data.data.records;
            this.detailGrid.loading = false;
          } else {
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
            this.detailGrid.loading = false;
          }
        })
        .catch(_ => {
          this.detailGrid.loading = false;
          this.$message.error("网络异常");
        });
    },
    search() {
      this.countInfoGridLoad(true);
      this.detailGridLoad(true);
    },
    outPut() {
      if (this.tabs.activeName == "countInfo") {
        const exportUrl1 = this.$service.winParams(
          this.$COMMON.baseUrl + "/report/exportFatigueStatistics",
          {
            current: this.countInfoGrid.options.current,
            size: this.countInfoGrid.options.size,
            startDate: this.$filter.format(
              this.SEtime[0],
              "yyyy-MM-dd HH:mm:ss"
            ),
            endDate: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
            plateCode: this.plateCode,
            typeName: 1
          }
        );
        window.location.href = exportUrl1;
      } else if (this.tabs.activeName == "detailInfo") {
        const exportUrl2 = this.$service.winParams(
          this.$COMMON.baseUrl + "/report/exportFatigueStatistics",
          {
            current: this.countInfoGrid.options.current,
            size: this.countInfoGrid.options.size,
            startDate: this.$filter.format(
              this.SEtime[0],
              "yyyy-MM-dd HH:mm:ss"
            ),
            endDate: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
            plateCode: this.plateCode,
            typeName: 0
          }
        );
        window.location.href = exportUrl2;
      }
    }
  },
  mounted() {
    this.countInfoGridLoad();
    this.detailGridLoad();
  }
};
</script>
<style lang="scss">

</style>
