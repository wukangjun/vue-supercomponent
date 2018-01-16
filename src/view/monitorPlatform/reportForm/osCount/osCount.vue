<template>
<div class="osCount">
  <cv-header>
    <el-form-item :label="$t('reportForm.osCount.SEtime')">
      <el-date-picker :clearable="false" :editable="false" v-model="SEtime" size="small" type="datetimerange" :placeholder="$t('reportForm.speedDetailSearch.timeRange')" :picker-options="pickerOption" style="width:330px">
      </el-date-picker>
    </el-form-item>
    <el-form-item v-if="false" :label="$t('reportForm.osCount.plateCode')">
      <el-input size="small" style="width:150px;" v-model="plateCode"></el-input>
    </el-form-item>
    <el-form-item :label="$t('reportForm.osCount.enterpriseName')">
      <cv-dropdown-tree style="float:left;width:240px;" :placeholder="$t('common.enterprise.enterpriseName')" :interface="$COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'" :readonly="false" v-model="company" @label="label"></cv-dropdown-tree>
    </el-form-item>
    <el-form-item v-if="(tabs.activeName=='countInfoSource' || tabs.activeName == 'detailInfo')?true:false" :label="$t('reportForm.osCount.alarmO')">
      <el-select style="width:80px" size="small" v-model="sourceVal">
        <el-option v-for="item in source" :key="item.id" :label="item.name" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="float:right;">
      <cv-tool style="margin:0;" :name="$route.name" :data="$store.getters.monitorMenu" class="cv-tool" :is-add="false" :is-modify="false" :is-remove="false" @search="search" @export="outPut"></cv-tool>
    </el-form-item>
  </cv-header>
  <cv-content :fill="true">
    <!-- tab页签 -->
    <el-tabs class="tabClass" v-model="tabs.activeName" @tab-click="tabClick">
      <!-- tab内容 -->
      <el-tab-pane :label="$t('reportForm.osCount.countInfo')" name="countInfo">
        <!-- 表格 -->
        <cv-grid class="" :options="countInfoGrid.options" @load="countInfoGridLoad(false)">
          <el-table border stripe :data="countInfoGrid.table" v-loading="countInfoGrid.loading" :max-height="$service.getAutoHeight(1,1)">
            <el-table-column :label="$t('reportForm.osCount.plateCode')" header-align="center" align="center" min-width="80" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.plateColor')" header-align="center" align="center" :formatter="plateColor" min-width="80" prop="plateColor" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.enterpriseName')" header-align="center" align="center" min-width="120" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.fleetName')" header-align="center" align="center" min-width="120" prop="fleetName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.osTimes')" header-align="center" align="center" min-width="60" prop="num" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
        </cv-grid>
      </el-tab-pane>
      <!-- tab内容 -->
      <el-tab-pane :label="$t('reportForm.osCount.alarmT')" name="countInfoSource">
        <!-- 表格 -->
        <cv-grid class="" :options="countInfoSGrid.options" @load="countInfoSGridLoad(false)">
          <el-table border stripe :data="countInfoSGrid.table" v-loading="countInfoSGrid.loading" :max-height="$service.getAutoHeight(1,1)">
            <el-table-column :label="$t('reportForm.osCount.plateCode')" header-align="center" align="center" min-width="80" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.plateColor')" header-align="center" align="center" :formatter="plateColor" min-width="80" prop="plateColor" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.enterpriseName')" header-align="center" align="center" min-width="120" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.fleetName')" header-align="center" align="center" min-width="120" prop="fleetName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.alarmO')" header-align="center" align="center" min-width="60" prop="sources" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.osTimes')" header-align="center" align="center" min-width="60" prop="num" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
        </cv-grid>
      </el-tab-pane>
      <!-- tab内容 -->
      <el-tab-pane :label="$t('reportForm.osCount.speedDetail')" name="detailInfo">
        <!-- 表格 -->
        <cv-grid class="" :options="detailInfoGrid.options" @load="detailInfoGridLoad(false)">
          <el-table border stripe :data="detailInfoGrid.table" v-loading="detailInfoGrid.loading" :max-height="$service.getAutoHeight(1,1)">
            <el-table-column :label="$t('reportForm.osCount.plateCode')" header-align="center" align="center" min-width="80" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.plateColor')" header-align="center" align="center" min-width="80" :formatter="plateColor" prop="plateColor" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.alarmO')" header-align="center" align="center" min-width="80" prop="sources" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.asTime')" header-align="center" align="center" min-width="180" prop="startTime" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.aeTime')" header-align="center" align="center" min-width="180" prop="endTime" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.asSpeed')" header-align="center" align="center" min-width="150" prop="startSpeed" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.aeSpeed')" header-align="center" align="center" min-width="150" prop="endSpeed" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.osp')" header-align="center" align="center" min-width="200" prop="locationName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.ost1')" header-align="center" align="center" min-width="100" prop="totalKeepTime" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.enterpriseName')" header-align="center" align="center" min-width="130" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('reportForm.osCount.fleetName')" header-align="center" align="center" min-width="100" prop="fleetName" :show-overflow-tooltip="true"></el-table-column>
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
      tabActiveObj:{},
      company: "",
      enterpriseId: 0,
      SEtime: [
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd start")
        ),
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd end")
        )
      ],
      tabs: {
        activeName: "countInfo"
      },
      source: [
        {
            name: "所有",
            value: "0"
          },
          {
            name: "终端",
            value: "1"
          },
          {
            name: "平台",
            value: "2"
          }
      ],
      sourceVal: "0",
      countInfoGrid: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        table: [],
        loading: false
      },
      countInfoSGrid: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        table: [],
        loading: true
      },
      detailInfoGrid: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        table: [],
        loading: true
      },
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  methods: {
    //表格加载问题
    tabSwitch(activeName){
      switch (activeName){
        case 'countInfo':
          this.countInfoGridLoad(true);
          this.tabActiveObj[activeName] = true;
        break;
        case 'countInfoSource':
          this.countInfoSGridLoad(true);
          this.tabActiveObj[activeName] = true;
        break;
        case 'detailInfo':
          this.detailInfoGridLoad(true);
          this.tabActiveObj[activeName] = true;
        break;
      } 
    },
    //企业树点击回调
    label({ id, enterpriseCode }) {
      id=="empty"?(this.enterpriseId = 0):(this.enterpriseId = id);
    },
    //统计信息表格
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
        startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
        enterpriseId: this.enterpriseId
      };
      this.countInfoGrid.loading = true;
      this.findSpeedInfoList(params)
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
    //按报警来源表格
    countInfoSGridLoad(flag) {
      if (flag) {
        this.countInfoSGrid.options.flag = true;
        this.countInfoSGrid.options.current = 1;
      } else {
        this.countInfoSGrid.options.flag = false;
      }
      let params = {
        current: this.countInfoSGrid.options.current,
        size: this.countInfoSGrid.options.size,
        startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
        enterpriseId: this.enterpriseId,
        sourcesType: this.sourceVal
      };
      this.countInfoSGrid.loading = true;
      this.findSpeedInfoList(params)
        .then(data => {
          if (data.flag) {
            this.countInfoSGrid.options.total = data.data.total;
            this.countInfoSGrid.table = data.data.records;
            this.countInfoSGrid.loading = false;
          } else {
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
            this.countInfoSGrid.loading = false;
          }
        })
        .catch(_ => {
          this.countInfoSGrid.loading = false;
          this.$message.error("网络异常");
        });
    },
    //详细表格
    detailInfoGridLoad(flag) {
      if (flag) {
        this.detailInfoGrid.options.flag = true;
        this.detailInfoGrid.options.current = 1;
      } else {
        this.detailInfoGrid.options.flag = false;
      }
      let params = {
        current: this.detailInfoGrid.options.current,
        size: this.detailInfoGrid.options.size,
        startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
        enterpriseId: this.enterpriseId,
        sourcesType: this.sourceVal
      };
      this.detailInfoGrid.loading = true;
      this.findSpeedDetailsListInfo(params)
        .then(data => {
          if (data.flag) {
            this.detailInfoGrid.options.total = data.data.total;
            this.detailInfoGrid.table = data.data.records;
            this.detailInfoGrid.loading = false;
          } else {
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
            this.detailInfoGrid.loading = false;
          }
        })
        .catch(_ => {
          this.detailInfoGrid.loading = false;
          this.$message.error("网络异常");
        });
    },
    //表格1
    search() {
      if (
        this.$filter.timeRange(
          this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
          this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss")
        ) > 3
      ) {
        this.$message.warning("查询时间不能超过3天");
        return false;
      }
      this.tabActiveObj = {};
      this.tabSwitch(this.tabs.activeName);
    },
    //车牌过滤
    plateColor(row, column, cellValue) {
      return this.$filter.plateCodeColor(row.plateColor);
    },
    //tab页签切换
    tabClick(tab, event) {
      if(this.tabActiveObj[this.tabs.activeName]){
        return false
      }else{
        this.tabSwitch(this.tabs.activeName)
      }
    },
    //导出
    outPut() {
      if (this.tabs.activeName == "countInfo") {
        const exportUrl = this.$service.winParams(
          this.$COMMON.baseUrl + "/alarmInfo/exportSpeedInfoList",
          {
            startTime: this.$filter.format(
              this.SEtime[0],
              "yyyy-MM-dd HH:mm:ss"
            ),
            endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
            enterpriseId:this.enterpriseId
          }
        );
        window.location.href = exportUrl;
      } else if (this.tabs.activeName == "countInfoSource") {
        const exportUrl1 = this.$service.winParams(
          this.$COMMON.baseUrl + "/alarmInfo/exportSpeedInfoList",
          {
            startTime: this.$filter.format(
              this.SEtime[0],
              "yyyy-MM-dd HH:mm:ss"
            ),
            endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
            sourcesType: this.sourceVal,
            enterpriseId:this.enterpriseId
          }
        );
        window.location.href = exportUrl1;
      }else{
        const exportUrl2 = this.$service.winParams(
          this.$COMMON.baseUrl + "/alarmInfo/exportSpeedDetailsListInfo",
          {
            startTime: this.$filter.format(
              this.SEtime[0],
              "yyyy-MM-dd HH:mm:ss"
            ),
            endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
            sourcesType: this.sourceVal,
            enterpriseId:this.enterpriseId
          }
        );
        window.location.href = exportUrl2;
      }
    }
  },
  mounted() {
    this.tabSwitch(this.tabs.activeName)
  }
};
</script>

<style lang="scss">
.osCount {
  .el-table .cell,
  .el-table th > div {
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
