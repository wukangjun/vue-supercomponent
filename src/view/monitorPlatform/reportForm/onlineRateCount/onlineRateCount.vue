<template>
    <div class="onlineRateCount">
        <cv-header>
            <el-form-item v-show="activeName == 'onlineRate'?true:false" :label="$t('reportForm.onlineRate.SEtime')">
                <el-date-picker v-model="SEtime" :editable="false" :clearable="false" size="small" type="datetimerange" :placeholder="$t('reportForm.onlineRate.selectRange')" :picker-options="pickerOption" style="width:330px">
                </el-date-picker>
            </el-form-item>
            <el-form-item v-show="activeName == 'onlineRate'?false:true" :label="$t('reportForm.onlineRate.searchTime')">
                <el-date-picker :clearable="false" :editable="false" v-model="searchTime" size="small" type="date" :placeholder="$t('reportForm.onlineRate.selectTime')">
                </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('reportForm.onlineRate.enterpriseName')">
                <cv-dropdown-tree style="float:left;width:240px;" :placeholder="$t('reportForm.onlineRate.enterpriseName')" :interface="$COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'" :readonly="false" v-model="company" @label="label"></cv-dropdown-tree>
            </el-form-item>
            <el-form-item v-show="(activeName == 'onlineRate' && tabs.activeName == 'groupOnline' ||activeName == 'onlineRate' && tabs.activeName == 'groupOnlineDetail')?true:false" :label="$t('reportForm.onlineRate.fleetName')">
                <cv-dropdown-tree style="float:left;width:240px;" :placeholder="$t('reportForm.onlineRate.fleetName')" :interface="$COMMON.baseUrl+'/fleet/findFleetInfoList'" :enterprise-id="enterpriseIdTemp" v-model="fleet" :readonly="false" @label="label1"></cv-dropdown-tree>
            </el-form-item>
            <el-form-item style="float:right;">
                <cv-tool style="margin:0;" :name="$route.name" :data="$store.getters.monitorMenu" class="cv-tool" :is-remove="false" :is-add="false" :is-modify="false" @search="search" @export="outPut"></cv-tool>
            </el-form-item>
        </cv-header>
        <cv-content :fill="true">
            <!-- tab页签 -->
            <el-tabs class="" v-model="activeName" @tab-click="three">
               <!-- tab内容 -->
               <el-tab-pane :label="$t('reportForm.onlineRate.onlineCount')" name="onlineRate">
                    <!-- tab页签 -->
                    <el-tabs class="" v-model="tabs.activeName" @tab-click="four">
                       <!-- tab内容 -->
                       <el-tab-pane :label="$t('reportForm.onlineRate.companyOnlineCount')" name="companyOnline">
                           <!-- 表格 -->
                           <cv-grid class="" :options="companyGrid.options" @load="companyGridLoad(false)">
                             <el-table border stripe :data="companyGrid.table" v-loading="companyGrid.loading" :max-height="$service.getAutoHeight(1,2)">
                               <el-table-column align="center" header-align="center" min-width="100" :label="$t('reportForm.onlineRate.enterpriseName')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column align="center" header-align="center" min-width="150" :label="$t('reportForm.onlineRate.sTime')" prop="startTime" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column align="center" header-align="center" min-width="150" :label="$t('reportForm.onlineRate.eTime')" prop="endTime" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column align="center" header-align="center" min-width="80" :label="$t('reportForm.onlineRate.oTimes')" prop="onlineCarCount" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column align="center" header-align="center" min-width="80" :label="$t('reportForm.onlineRate.offTimes')" prop="offLineCarCount" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column align="center" header-align="center" min-width="80" :label="$t('reportForm.onlineRate.onRate')" prop="onLineRate" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column align="center" header-align="center" min-width="" :label="$t('action.operation')">
                                  <template scope="scope">
                                    <el-button @click="linkToCompany(scope.row)" type="text">查看</el-button>
                                  </template>
                               </el-table-column>
                             </el-table>
                           </cv-grid>
                       </el-tab-pane>
                       <!-- tab内容 -->
                       <el-tab-pane :label="$t('reportForm.onlineRate.companyOnlineCountD')" name="companyOnlineDetail">
                            <!-- 表格 -->
                            <cv-grid class="" :options="companyDetailGrid.options" @load="companyDetailGridLoad(false)">
                              <el-table border stripe :data="companyDetailGrid.table" v-loading="companyDetailGrid.loading" :max-height="$service.getAutoHeight(1,2)">
                                <el-table-column min-width="100" align="center" header-align="center" :label="$t('reportForm.onlineRate.enterpriseName')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column min-width="150" align="center" header-align="center" :label="$t('reportForm.onlineRate.recordTime')" prop="queryTime" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column min-width="100" align="center" header-align="center" :label="$t('reportForm.onlineRate.allV')" prop="vehicleCount" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column min-width="100" align="center" header-align="center" :label="$t('reportForm.onlineRate.onV')" prop="onlineCarCount" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column min-width="100" align="center" header-align="center" :label="$t('reportForm.onlineRate.offV')" prop="offLineCarCount" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column min-width="100" align="center" header-align="center" :label="$t('reportForm.onlineRate.onRate')" prop="onLineRate" :show-overflow-tooltip="true"></el-table-column>
                              </el-table>
                            </cv-grid>
                       </el-tab-pane>
                       <!-- tab内容 -->
                       <el-tab-pane :label="$t('reportForm.onlineRate.fleetOnlineCount')" name="groupOnline">
                           <!-- 表格 -->
                           <cv-grid class="" :options="fleetGrid.options" @load="fleetGridLoad(false)">
                             <el-table border stripe :data="fleetGrid.table" v-loading="fleetGrid.loading" :max-height="$service.getAutoHeight(1,2)">
                               <el-table-column min-width="120" align="center" header-align="center" :label="$t('reportForm.onlineRate.enterpriseName')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column min-width="150" align="center" header-align="center" :label="$t('reportForm.onlineRate.fleetName')" prop="fleetName" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column min-width="180" align="center" header-align="center" :label="$t('reportForm.onlineRate.sTime')" prop="startTime" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column min-width="180" align="center" header-align="center" :label="$t('reportForm.onlineRate.eTime')" prop="endTime" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column min-width="100" align="center" header-align="center" :label="$t('reportForm.onlineRate.oTimes')" prop="onlineCarCount" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column min-width="100" align="center" header-align="center" :label="$t('reportForm.onlineRate.offTimes')" prop="offLineCarCount" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column min-width="120" align="center" header-align="center" :label="$t('reportForm.onlineRate.onRate')" prop="onLineRate" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column min-width="" align="center" header-align="center" :label="$t('action.operation')">
                                  <template scope="scope">
                                    <el-button @click="linkToFleet(scope.row)" type="text">查看</el-button>
                                  </template>
                               </el-table-column>
                             </el-table>
                           </cv-grid>
                       </el-tab-pane>
                       <!-- tab内容 -->
                       <el-tab-pane :label="$t('reportForm.onlineRate.fleetOnlineCountD')" name="groupOnlineDetail">
                            <!-- 表格 -->
                           <cv-grid class="" :options="fleetDetailGrid.options" @load="fleetDetailGridLoad(false)">
                             <el-table border stripe :data="fleetDetailGrid.table" v-loading="fleetDetailGrid.loading" :max-height="$service.getAutoHeight(1,2)">
                               <el-table-column min-width="100" align="center" header-align="center" :label="$t('reportForm.onlineRate.enterpriseName')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column min-width="150" align="center" header-align="center" :label="$t('reportForm.onlineRate.fleetName')" prop="fleetName" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column min-width="150" align="center" header-align="center" :label="$t('reportForm.onlineRate.recordTime')" prop="queryTime" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column min-width="100" align="center" header-align="center" :label="$t('reportForm.onlineRate.allV')" prop="vehicleCount" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column min-width="100" align="center" header-align="center" :label="$t('reportForm.onlineRate.onV')" prop="onlineCarCount" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column min-width="100" align="center" header-align="center" :label="$t('reportForm.onlineRate.offV')" prop="offLineCarCount" :show-overflow-tooltip="true"></el-table-column>
                               <el-table-column min-width="100" align="center" header-align="center" :label="$t('reportForm.onlineRate.onRate')" prop="onLineRate" :show-overflow-tooltip="true"></el-table-column>
                             </el-table>
                           </cv-grid>
                       </el-tab-pane>
                    </el-tabs>
               </el-tab-pane>
               <!-- tab内容 -->
               <el-tab-pane :label="$t('reportForm.onlineRate.onlineOffCount')" name="onOffCount">
                    <!-- 表格 -->
                    <cv-grid class="" :options="onOffCount.options" @load="onOffCountLoad(false)">
                      <el-table border stripe :data="onOffCount.table" v-loading="onOffCount.loading" :max-height="$service.getAutoHeight(1,1)">
                        <el-table-column align="center" header-align="center" :label="$t('reportForm.onlineRate.enterpriseName')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column align="center" header-align="center" :label="$t('reportForm.onlineRate.recordTime')" prop="queryTime" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column align="center" header-align="center" :label="$t('reportForm.onlineRate.onV')" prop="onLineCount" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column align="center" header-align="center" :label="$t('reportForm.onlineRate.offV1')" prop="offCount" :show-overflow-tooltip="true"></el-table-column>
                      </el-table>
                    </cv-grid>
               </el-tab-pane>
               <!-- tab内容 -->
               <el-tab-pane :label="$t('reportForm.onlineRate.offlineCount')" name="offlineCount">
                   <!-- 表格 -->
                    <cv-grid class="" :options="offlineCount.options" @load="offlineCountLoad(false)">
                      <el-table border stripe :data="offlineCount.table" v-loading="offlineCount.loading" :max-height="$service.getAutoHeight(1,1)">
                        <el-table-column align="center" header-align="center" :label="$t('reportForm.onlineRate.enterpriseName')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column align="center" header-align="center" :label="$t('reportForm.onlineRate.recordTime')" prop="recordTime" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column align="center" header-align="center" :label="$t('reportForm.onlineRate.offV')" prop="nolineCount" :show-overflow-tooltip="true"></el-table-column>
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
      enterpriseIdTemp:'',
      fleet: "",
      fleetId: 0,
      fleetListId:'',
      companyId:'',
      SEtime: [
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd start")
        ),
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd end")
        )
      ],
      searchTime: new Date(),
      activeName: "onlineRate",
      tabs: {
        activeName: "companyOnline"
      },
      companyGrid: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        loading: true,
        table: []
      },
      companyDetailGrid: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        loading: true,
        table: []
      },
      fleetGrid: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        loading: true,
        table: []
      },
      fleetDetailGrid: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        loading: true,
        table: []
      },
      onOffCount: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        loading: true,
        table: []
      },
      offlineCount: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        loading: true,
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
    //表格加载问题
    tabSwitch(activeName){
      if(activeName !="groupOnlineDetail"){
        this.companyId="";
        this.fleetListId="";
      }
      switch (activeName){
        case 'onlineRate':
          this.companyGridLoad();
          this.tabActiveObj[activeName] = true;
        break;
        case 'companyOnline':
          this.companyGridLoad();
          this.tabActiveObj[activeName] = true;
        break;
        case 'onOffCount':
          this.onOffCountLoad();
          this.tabActiveObj[activeName] = true;
        break;
        case 'offlineCount':
          this.offlineCountLoad();
          this.tabActiveObj[activeName] = true;
        break;
        case 'companyOnlineDetail':
          this.companyDetailGridLoad();
          this.tabActiveObj[activeName] = true;
        break;
        case 'groupOnline':
          this.fleetGridLoad();
          this.tabActiveObj[activeName] = true;
        break;
        case 'groupOnlineDetail':
          this.fleetDetailGridLoad();
          this.tabActiveObj[activeName] = true;
        break;
      } 
    },
    //threeTab切换
    three(tab){
      if(this.tabActiveObj[this.activeName]){
        return false
      }else{
        this.tabSwitch(this.activeName)
      }
    },
    //fourTab切换
    four(tab){
      if(this.tabActiveObj[this.tabs.activeName]){
        return false
      }else{
        this.tabSwitch(this.tabs.activeName)
      }
    },
    //企业树点击回调
    label({ id, enterpriseCode }) {
      this.fleet = "";
      id == 'empty'?(this.enterpriseId = 0,this.enterpriseIdTemp = id):(this.enterpriseId = id,this.enterpriseIdTemp = id)
    },
    label1({ id, enterpriseCode }) {
      id == 'empty'?(this.fleetId = 0):(this.fleetId = id)
    },
    //公司在线率
    companyGridLoad(flag) {
      if (flag) {
        this.companyGrid.options.flag = true;
        this.companyGrid.options.current = 1;
      } else {
        this.companyGrid.options.flag = false;
      }
      let params = {
        current: this.companyGrid.options.current,
        size: this.companyGrid.options.size,
        startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
        enterpriseId: this.enterpriseId || 0
      };
      this.companyGrid.loading = true;
      this.findEnterpriseOnLineRate(params)
        .then(data => {
          if (data.flag) {
            this.companyGrid.options.total = data.data.total;
            this.companyGrid.table = data.data.records;
            this.companyGrid.loading = false;
          } else {
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
            this.companyGrid.loading = false;
          }
        })
        .catch(_ => {
          this.companyGrid.loading = false;
          this.$message.error("网络异常");
        });
    },
    //公司在线率详细
    companyDetailGridLoad(flag, eid) {
      if (flag) {
        this.companyDetailGrid.options.flag = true;
        this.companyDetailGrid.options.current = 1;
      } else {
        this.companyDetailGrid.options.flag = false;
      }
      let params = {
        current: this.companyDetailGrid.options.current,
        size: this.companyDetailGrid.options.size,
        startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
        enterpriseId: this.enterpriseId || 0
      };
      eid && (params.enterpriseId = eid);
      this.companyDetailGrid.loading = true;
      this.findEnterpriseDetailsOnLineRate(params)
        .then(data => {
          if (data.flag) {
            this.companyDetailGrid.options.total = data.data.total;
            this.companyDetailGrid.table = data.data.records;
            this.companyDetailGrid.loading = false;
          } else {
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
            this.companyDetailGrid.loading = false;
          }
        })
        .catch(_ => {
          this.companyDetailGrid.loading = false;
          this.$message.error("网络异常");
        });
    },
    //分组在线率
    fleetGridLoad(flag) {
      if (flag) {
        this.fleetGrid.options.flag = true;
        this.fleetGrid.options.current = 1;
      } else {
        this.fleetGrid.options.flag = false;
      }
      let params = {
        current: this.fleetGrid.options.current,
        size: this.fleetGrid.options.size,
        startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
        enterpriseId: this.enterpriseId || 0,
        fleetId: this.fleetId
      };
      this.fleetGrid.loading = true;
      this.findFleetOnLineRate(params)
        .then(data => {
          if (data.flag) {
            this.fleetGrid.options.total = data.data.total;
            this.fleetGrid.table = data.data.records;
          } else {
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
          }
          this.fleetGrid.loading = false;
        })
        .catch(_ => {
          this.fleetGrid.loading = false;
          this.$message.error("网络异常");
        });
    },
    //分组在线率详细
    fleetDetailGridLoad(flag, fid) {
      if (flag) {
        this.fleetDetailGrid.options.flag = true;
        this.fleetDetailGrid.options.current = 1;
      } else {
        this.fleetDetailGrid.options.flag = false;
      }
      let params = {
        current: this.fleetDetailGrid.options.current,
        size: this.fleetDetailGrid.options.size,
        startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
        enterpriseId: (this.enterpriseId == 0 && this.companyId !="")?this.companyId:this.enterpriseId,
        fleetId:  (this.fleetId == 0 && this.fleetListId !="")?this.fleetListId:this.fleetId
      };
      fid && (params.fleetId = fid);
      this.fleetDetailGrid.loading = true;
      this.findFleetDetailsOnLineRate(params)
        .then(data => {
          if (data.flag) {
            this.fleetDetailGrid.options.total = data.data.total;
            this.fleetDetailGrid.table = data.data.records;
            this.fleetDetailGrid.loading = false;
          } else {
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
            this.fleetDetailGrid.loading = false;
          }
        })
        .catch(_ => {
          this.fleetDetailGrid.loading = false;
          this.$message.error("网络异常");
        });
    },
    //上下线
    onOffCountLoad(flag) {
      if (flag) {
        this.onOffCount.options.flag = true;
        this.onOffCount.options.current = 1;
      } else {
        this.onOffCount.options.flag = false;
      }
      let params = {
        current: this.onOffCount.options.current,
        size: this.onOffCount.options.size,
        queryTime: this.$filter.format(this.searchTime, "yyyy-MM-dd"),
        enterpriseId: this.enterpriseId || 0
      };
      this.onOffCount.loading = true;
      this.findVehicleOnOffRateInfoList(params)
        .then(data => {
          if (data.flag) {
            this.onOffCount.options.total = data.data.total;
            this.onOffCount.table = data.data.records;
            this.onOffCount.loading = false;
          } else {
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
            this.onOffCount.loading = false;
          }
        })
        .catch(_ => {
          this.onOffCount.loading = false;
          this.$message.error("网络异常");
        });
    },
    //车辆不在线
    offlineCountLoad(flag) {
      if (flag) {
        this.offlineCount.options.flag = true;
        this.offlineCount.options.current = 1;
      } else {
        this.offlineCount.options.flag = false;
      }
      let params = {
        current: this.offlineCount.options.current,
        size: this.offlineCount.options.size,
        recordTime: this.$filter.format(this.searchTime, "yyyy-MM-dd"),
        enterpriseId: this.enterpriseId || 0
      };
      this.offlineCount.loading = true;
      this.findVehicleNolineInfoList(params)
        .then(data => {
          if (data.flag) {
            this.offlineCount.options.total = data.data.total;
            this.offlineCount.table = data.data.records;
            this.offlineCount.loading = false;
          } else {
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
            this.offlineCount.loading = false;
          }
        })
        .catch(_ => {
          this.offlineCount.loading = false;
          this.$message.error("网络异常");
        });
    },
    search() {
      this.tabActiveObj = {};
      if(this.activeName == 'onlineRate'){
        this.tabSwitch(this.tabs.activeName)
      }else{
        this.tabSwitch(this.activeName)
      }
    },
    linkToCompany(val) {
      this.companyDetailGridLoad(true, val.enterpriseId);
      this.tabs.activeName = "companyOnlineDetail";
    },
    linkToFleet(val) {
      this.fleetListId=val.fleetId;
      this.companyId=val.enterpriseId;
      this.fleetDetailGridLoad(true, val.fleetId);
      this.tabs.activeName = "groupOnlineDetail";
    },
    outPut() {
      switch (this.activeName) {
        case "onlineRate":
          switch (this.tabs.activeName) {
            case "companyOnline":
              const exportUrl = this.$service.winParams(
                this.$COMMON.baseUrl + "/report/exportEnterpriseOnLineRate",
                {
                  startTime: this.$filter.format(
                    this.SEtime[0],
                    "yyyy-MM-dd HH:mm:ss"
                  ),
                  endTime: this.$filter.format(
                    this.SEtime[1],
                    "yyyy-MM-dd HH:mm:ss"
                  ),
                  enterpriseId: this.enterpriseId
                }
              );
              window.location.href = exportUrl;
              break;
            case "companyOnlineDetail":
              const exportUrl1 = this.$service.winParams(
                this.$COMMON.baseUrl +
                  "/report/exportEnterpriseDetailsOnLineRate",
                {
                  startTime: this.$filter.format(
                    this.SEtime[0],
                    "yyyy-MM-dd HH:mm:ss"
                  ),
                  endTime: this.$filter.format(
                    this.SEtime[1],
                    "yyyy-MM-dd HH:mm:ss"
                  ),
                  enterpriseId: this.enterpriseId
                }
              );
              window.location.href = exportUrl1;
              break;
            case "groupOnline":
              const exportUrl2 = this.$service.winParams(
                this.$COMMON.baseUrl + "/report/exportFleetOnLineRate",
                {
                  startTime: this.$filter.format(
                    this.SEtime[0],
                    "yyyy-MM-dd HH:mm:ss"
                  ),
                  endTime: this.$filter.format(
                    this.SEtime[1],
                    "yyyy-MM-dd HH:mm:ss"
                  ),
                  enterpriseId: this.enterpriseId,
                  fleetId: this.fleetId
                }
              );
              window.location.href = exportUrl2;
              break;
            case "groupOnlineDetail":
              const exportUrl3 = this.$service.winParams(
                this.$COMMON.baseUrl + "/report/exportFleetDetailsOnLineRate",
                {
                  startTime: this.$filter.format(
                    this.SEtime[0],
                    "yyyy-MM-dd HH:mm:ss"
                  ),
                  endTime: this.$filter.format(
                    this.SEtime[1],
                    "yyyy-MM-dd HH:mm:ss"
                  ),
                   enterpriseId: (this.enterpriseId == 0 && this.companyId !="")?this.companyId:this.enterpriseId,
                  fleetId:  (this.fleetId == 0 && this.fleetListId !="")?this.fleetListId:this.fleetId
                }
              );
              window.location.href = exportUrl3;
              break;
          }
          break;
        case "onOffCount":
          const exportUrl4 = this.$service.winParams(
            this.$COMMON.baseUrl + "/report/exportVehicleOnOffRateInfoList",
            {
              queryTime: this.$filter.format(this.searchTime, "yyyy-MM-dd")
            }
          );
          window.location.href = exportUrl4;
          break;
        case "offlineCount":
          const exportUrl5 = this.$service.winParams(
            this.$COMMON.baseUrl + "/report/exportVehicleNolineList",
            {
              recordTime: this.$filter.format(this.searchTime, "yyyy-MM-dd")
            }
          );
          window.location.href = exportUrl5;
          break;
      }
    }
  },
  mounted() {
    this.tabSwitch(this.tabs.activeName)
  }
};
</script>
<style lang="scss">
.onlineRateCount {
}
</style>
