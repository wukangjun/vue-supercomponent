<template>
    <div class="mouthStatistics">
        <cv-header>
          <el-form-item label="日期">
              <el-date-picker :editable="false" v-model="searchTime" size="small" type="month" :picker-options="pickerOptions2" :clearable='true' placeholder="请选择时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="车牌号">
                <el-input v-model.trim="plateCode" size="small" style="width:150px;"></el-input>
            </el-form-item>
            <el-form-item label="所属公司">
             		<cv-dropdown-tree  :placeholder="$t('common.enterprise.enterpriseName')" :interface="$COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'" :readonly="false" v-model="company" :is-default="false" @label="label"></cv-dropdown-tree>
            </el-form-item>
            <el-form-item label="所属车队">
               <cv-dropdown-tree v-model="fleetName" :is-fleet="true" :interface="$COMMON.baseUrl + '/fleet/findFleetInfoList'" :is-default="false"  :enterprise-id="enterpriseId" @label="vehicleIdCall" ></cv-dropdown-tree>
            </el-form-item>
            <el-form-item style='float:right;'>
                	<cv-tool
                    style='margin:0px;'
		            :name="$route.name"
                    :data="$store.getters.monitorMenu"
                    :is-add="false"
                    :is-modify="false"
                    :is-remove="false"
                    @export="down"
                     @search="searchMileage"></cv-tool>
            </el-form-item>
        </cv-header>
        <cv-content :fill="true">  
          <!-- 表格 -->
          <cv-grid class="" :options="mouthGrid.options" @load="onMouthloadGrid(false)">
              <el-table border stripe :data="mouthGrid.table" :max-height="$service.getAutoHeight(1,1)"  v-loading="mouthGrid.loading">
                  <el-table-column :label="$t('cE.carNumber')" header-align="center" min-width="100" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column :label="$t('cE.carColor')" header-align="center" min-width="100" prop="plateColor" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column label="所属车队" header-align="center" min-width="100" prop="groupName" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column label="所属公司" header-align="center" min-width="120" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column label="行驶总里程(KM)" header-align="center" min-width="120" prop="driveMileage" :formatter="isFix" :show-overflow-tooltip="true"></el-table-column>   
                  <el-table-column label="行驶日期" header-align="center" min-width="120" prop="selectDate" :show-overflow-tooltip="true"></el-table-column>
              </el-table>
          </cv-grid>    
        </cv-content>
    </div>
</template>
<script>
import prot from "./";
export default {
  components: {},
  mixins: [prot],
  data() {
    return {
      plateCode: "",
      enterpriseId: "",
      fleetName: "",
      fleetId: "",
      company: "",
      sTime: "",
      etime: "",
      searchTime:this.$filter.format(new Date() - 1000 * 60 * 60 * 24, "yyyy-MM"),
      mouthGrid: {
        options: {
          current: 1,
          total: 0,
          size: 10,
          flag: false
        },
        table: [],
        loading: true
      },
      // 日期配置
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 1000 * 60 * 60 * 24;
        }
      }
    };
  },
  methods: {
    //企业树点击回调
    label({ id, enterpriseCode }) {
      this.enterpriseId = id;
    },
    //月行驶里程统计报表
    onMouthloadGrid(type) {
      if (type) {
        this.mouthGrid.options.flag = true;
        this.mouthGrid.options.current = 1;
      } else {
        this.mouthGrid.options.flag = false;
      }
      let params = {
        selectDate: typeof this.searchTime ==='string'?this.searchTime:this.$filter.format(this.searchTime,'yyyy-MM'),
        current: this.mouthGrid.options.current,
        size: this.mouthGrid.options.size,
        plateCode: this.plateCode == "" ? "" : this.plateCode,
        enterpriseId:this.enterpriseId,
        fleetId: this.fleetId
      };
      this.mouthGrid.loading = true;
      this.onMouthByDate(params)
        .then(data => {
          if (data.flag) {
            if (data.data.length != 0) {
              this.mouthGrid.table = data.data.records;
              this.mouthGrid.options.total = data.data.total;
              this.mouthGrid.loading = false;
            } else {
              this.mouthGrid.table = [];
              this.mouthGrid.options.total = 0;
            }
          } else {
            this.mouthGrid.table = [];
            this.mouthGrid.options.total = 0;
          }
        })
        .catch(_ => {
          this.$message.error("网络异常");
          this.mouthGrid.loading = false;
        });
    },
    //月行驶里程的搜索
    searchMileage() {
      //搜索前报表置空
      // this.mouthGrid.table = [];
      //搜索两个表都刷新
        this.mouthGrid.loading = true;
       this.onMouthloadGrid(true);
      // if (this.searchTime != undefined) {
      //   let selectDate = this.$filter.format(this.searchTime, "yyyy-MM");
      //   this.onMouthloadGrid(true);
      // } else {
      //   this.$message.error({ message: this.$t("请选择时间") });
      // }
      // this.onMouthloadGrid
    },
    isFix(row) {
      return this.$filter.toFixed(row.driveMileage, 2);
    },
    down() {
      if (this.searchTime != undefined) {
        let downParams = {
          selectDate: typeof this.searchTime ==='string'?this.searchTime:this.$filter.format(this.searchTime,'yyyy-MM'),
          current: this.mouthGrid.options.current,
          size: this.mouthGrid.options.size,
          plateCode: this.plateCode == "" ? "" : this.plateCode,
          enterpriseId:this.enterpriseId,
          fleetId: this.fleetId
        };
        //月里程统计报表导出
        const getDriveMeterExcelA = this.$service.winParams(
          this.$COMMON.baseUrl + "/report/exportMileageReport",
          downParams
        );
        window.location.href = getDriveMeterExcelA;
      } else {
        this.$message.error({ message: this.$t("请选择时间") });
      }
    },
    vehicleIdCall(val){
      this.fleetId = val.id;
    }
  },
  mounted() {
    // console.log(this.enterpriseId)
    this.onMouthloadGrid();
  },
  watch: {
      "company"(newVal){
        this.fleetName="";
      }
  }
};
</script>
<style lang="scss">
.mouthStatistics {
  .el-table .el-tooltip.cell {
    text-align: center;
  }
}
</style>
