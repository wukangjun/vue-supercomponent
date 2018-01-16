<template>
    <div class="main">
      <cv-header>
		    <!-- <el-form-item label="车牌号:">
                <el-input v-model="plateCode" placeholder="" size="small"></el-input>
            </el-form-item> -->
        <el-form-item label="起始时间:">
                <el-date-picker :editable="false" :clearable="true" v-model="receiveTime" size="small" type="datetimerange" placeholder="请选择时间" :picker-options="pickerOption" style="width:330px">
        </el-date-picker>
          </el-form-item>
        	<cv-tool style="margin:0;" :name="$route.name" :data="$store.getters.monitorMenu" class="cv-tool"  :is-remove="false" :is-add="false" :is-modify="false" :is-reset="true" @search="isSearchEvent"  @export="down" @reset="isResend"></cv-tool>	
    </cv-header>      
    <cv-content>
        <cv-grid :options="grid.options" @load="isSearchEvent(false)">
            <el-table border stripe :data="grid.table" v-loading="grid.loading"  ref="table">
          <el-table-column label="车牌号码" prop="plateCode" min-width="100px" :show-overflow-tooltip="true"></el-table-column>	
					<el-table-column label="所属公司" prop="etprsName" min-width="100px"  :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="车辆分组" prop="dpName" min-width="100px" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="制动起始速度(km/h)" prop="brakeSpeed" min-width="200px" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="制动时间(s)" prop="brakeTime" min-width="150px" :show-overflow-tooltip="true" ></el-table-column>
					<el-table-column label="停车时间" prop="stopTime" min-width="120px" :show-overflow-tooltip="true" ></el-table-column>
					<el-table-column label="停车位置" prop="address" min-width="100px" :show-overflow-tooltip="true">
					</el-table-column>	
					<el-table-column label="操作" prop="operation" min-width="100px">
							<template scope="scope">
								<cv-span type="primary" @click.native="handleInformation(scope.row)" >详细信息</cv-span>
							</template>
						</el-table-column>
            </el-table>
        </cv-grid>
    </cv-content>
	<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class='dialog.size'>
			<component :is='dialog.name' :options='dialog'></component>
	</el-dialog>
</div>
</template>
<script>
import port from "./index.js";
import doubtful from "./doubtful.vue";
export default {
  components: {
    doubtful
  },
  mixins: [port],
  data() {
    return {
      plateCode: "",
      reset: false,
      receiveTime: [
        this.$filter.timeStamp(
          this.$filter.format(
            new Date(new Date() - 24 * 60 * 60 * 1000),
            "yyyy-MM-dd start"
          )
        ),
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd end")
        )
      ],
      flag: false,
      vid: "",
      grid: {
        options: {
          current: 1,
          size: 10,
          total: 0
        },
        table: [],
        loading: false,
        flag: false
      },
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      //信息弹框数据
      dialog: {
        title: "--",
        flag: false,
        name: "",
        size: "dialog-small",
        form: {
          stopTime: "",
          plateCode: "",
          address: "",
          diverName: ""
        }
      }
    };
  },
  methods: {
    isSearchEvent(type) {
      if (type) {
        this.grid.options.flag = true;
        this.grid.options.current = 1;
      } else {
        this.grid.options.flag = false;
      }
      this.searchEvent();
    },
    async searchEvent() {
      this.grid.loading = true;
      let params;
      if (this.receiveTime != undefined) {
        params = {
          startTime: this.$filter.format(
            this.receiveTime[0],
            "yyyy-MM-dd HH:mm:ss"
          ),
          endTime: this.$filter.format(
            this.receiveTime[1],
            "yyyy-MM-dd HH:mm:ss"
          ),
          vehicleId: this.vid,
          mapType: this.$store.getters.mapType,
          current: this.grid.options.current,
          size: this.grid.options.size
        };
        if (params.startTime != undefined && params.endTime != undefined) {
          if (this.$filter.timeRange(params.startTime, params.endTime) <= 3) {
            const { flag, data } = await this.troubleRecord(params);
            this.grid.loading = false;
            if (flag && data.length != 0) {
              this.grid.table = data.records;
              this.grid.options.total = data.total;
            } else {
              this.grid.table = [];
              this.grid.options.total = 0;
            }
          } else {
            this.grid.loading = false;
            this.$message.error({ message: this.$t("时间范围为3天") });
          }
        } else {
          this.$message.error({ message: this.$t("请选择时间范围") });
          this.grid.loading = false;
        }
      } else {
        this.$message.error({ message: this.$t("请选择时间范围") });
        this.grid.loading = false;
      }
    },
    //重置
    isResend() {
      this.plateCode = "";
      this.receiveTime = "";
    },
    //点击查看详情
    handleInformation(row) {
      this.dialog.flag = true;
      this.dialog.title = "事故疑点明细-报表、位置";
      this.dialog.name = "doubtful";
      this.dialog.size = "dialog-large";
      this.dialog.id=row.id;
      //车牌号
      this.dialog.form.plateCode = row.plateCode;
      //司机名字
      this.dialog.form.diverName = row.diverName;
      this.dialog.form.address = row.address;
      this.dialog.form.stopTime = row.stopTime;
    },
    // subTime(row) {
    //   console.log(typeof row.brakeTime)
    //     return this.$filter.subTimeT(row.brakeTime);
		// },
    //导出
    down() {
      let downParams = {
        current: this.grid.options.current,
        size: this.grid.options.size,
        vehicleId: this.vid,
        mapType: this.$store.getters.mapType,
        startTime: this.$filter.format(
          this.receiveTime[0],
          "yyyy-MM-dd HH:mm:ss"
        ),
        endTime: this.$filter.format(this.receiveTime[1], "yyyy-MM-dd HH:mm:ss")
      };
      const getDriveMeterExcelA = this.$service.winParams(
        this.$COMMON.baseUrl + "/report/troubleRecordReport",
        downParams
      );
      window.location.href = getDriveMeterExcelA;
    }
  },
  watch: {
    "$store.getters.ptSingleCar"(newVal) {
      this.vid = newVal.id;
      this.plateCode = newVal.plateCode;
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  top: 0px;
  bottom: 0px;
}

.main .left {
  margin-right: 370px;
}

.main .right {
  position: absolute;
  right: 0;
  top: 14px;
  width: 360px;
}
</style>