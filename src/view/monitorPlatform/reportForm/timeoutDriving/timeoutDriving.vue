<template>
    <div class="main">
      <cv-header>
		     <el-form-item label="车牌号:">
                <el-input v-model="plateCode" placeholder="" size="small"></el-input>
            </el-form-item>
        <el-form-item label="起始时间:">
                <el-date-picker :editable="false" :clearable="true" v-model="receiveTime" size="small" type="datetimerange" placeholder="请选择时间" :picker-options="pickerOption" style="width:330px">
        </el-date-picker>
          </el-form-item>
        	<cv-tool style="margin:0;" :name="$route.name" :data="$store.getters.monitorMenu" class="cv-tool"  :is-remove="false" :is-add="false" :is-modify="false" :is-reset="true" @search="isTimeEvent" @export="downOut"  @reset="isResend"></cv-tool>	
    </cv-header>      
    <cv-content>
        <cv-grid :options="grid.options" @load="isTimeEvent(false)">
            <el-table border stripe :data="grid.table" v-loading="grid.loading"  ref="table">
              	<el-table-column label="车牌号码" prop="plateCode" min-width="100px" :show-overflow-tooltip="true"></el-table-column>		
					<el-table-column label="所属公司" prop="etprsName" min-width="100px"  :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="车辆分组" prop="dpName" min-width="100px" :show-overflow-tooltip="true"></el-table-column>
					<!-- <el-table-column label="驾驶员证件号" prop="sources" min-width="120px"></el-table-column> -->
					<el-table-column label="超时起始时间" prop="overStartTime" min-width="120px" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="超时终止时间" prop="overEndTime" min-width="160px" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="超时起始位置" prop="overStartAddr" min-width="120px" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
        </cv-grid>
    </cv-content>
  </div>
</template>
<script>
import port from "./index.js";
import { http, COMMON, service } from "@/utils";
export default {
  components: {
    service,
    COMMON,
    http
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
      }
    };
  },
  methods: {
   	isTimeEvent(type){
			if(type){
				this.grid.options.flag = true;
				this.grid.options.current = 1;
			}else{
				this.grid.options.flag = false;
			}
			this.timeEvent();
		},
		async timeEvent() {
			this.grid.loading = true;
			let  params;
			if (this.receiveTime != undefined){
				params = {
					overStartTime: this.$filter.format(this.receiveTime[0], 'yyyy-MM-dd HH:mm:ss'),
          overEndTime: this.$filter.format(this.receiveTime[1], 'yyyy-MM-dd HH:mm:ss'),
           vehicleId: this.vid,
					// alarmLevel: this.operation.alarm,
					mapType: this.$store.getters.mapType,
					current: this.grid.options.current,
					size: this.grid.options.size
				};
				if (params.overStartTime != undefined && params.overEndTime != undefined) {
					if (this.$filter.timeRange(params.overStartTime, params.overEndTime) <= 3) {
						const { flag, data } = await this.queryOverTimeDrive(params);
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
						this.$message.error({ message: this.$t('时间范围为3天') });
					}
				} else {
					this.$message.error({ message: this.$t('请选择时间范围') });
					this.grid.loading = false;
				}
			} else {
				this.$message.error({ message: this.$t('请选择时间范围') });
				this.grid.loading = false;
			}
        },
    isResend() {
      this.plateCode = "";
      this.receiveTime = "";
    },
    downOut(){
      let downParams = {
        	  current: this.grid.options.current,
            size: this.grid.options.size,
            vehicleId: this.vid,
            mapType: this.$store.getters.mapType,
            overStartTime:this.$filter.format(
              this.receiveTime[0],
              "yyyy-MM-dd HH:mm:ss"
            ),
            overEndTime:this.$filter.format(
              this.receiveTime[1],
              "yyyy-MM-dd HH:mm:ss"
            )
      };
      //报警处理报表导出
      const getDriveMeterExcelA = this.$service.winParams(
        this.$COMMON.baseUrl + "/report/queryOverTimeDriveReport",
        downParams
      );
      window.location.href = getDriveMeterExcelA;
    }
  },
  watch: {
    "$store.getters.ptSingleCar"(newVal) {
      this.vid = newVal.id;
      // this.eventLoad();
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