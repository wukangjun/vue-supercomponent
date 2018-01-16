<template>
	<div class="one">
		<cv-header>
			<el-form-item label="起止日期:">
				<el-date-picker :editable="false" v-model="operation.time" type="datetimerange" placeholder="选择时间范围" :picker-options="pickerOption" size="small" style="width:330px">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="报警类型:">
				<cv-dropdown-tree style="display:inline-block" :isCheck="true" :interface="$COMMON.baseUrl+'/alarmInfo/frinAlarmTypeInfoList.do'" :show-checkbox="true" @checked="checked" @allAlarmType="allAlarmType"></cv-dropdown-tree>
			</el-form-item>
			<el-form-item style="float:right">
				<cv-tool style="margin:0;" :name="$route.name" :data="$store.getters.monitorMenu" class="cv-tool"  :is-remove="false" :is-add="false" :is-modify="false" @search="isSearch"  @export="down"></cv-tool>
			</el-form-item>		
		</cv-header>
		<cv-content>
			<cv-grid class="alarmGrid" :options="policeCarListGrid.options" @load="isSearch(false)">
				<el-table border stripe :data="policeCarListGrid.table" v-loading="policeCarListGrid.loading" :max-height="height">
					<el-table-column label="车牌号码" prop="plateCode" min-width="100px" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="车牌颜色" prop="plateColor" min-width="100px" :formatter="filterColor"></el-table-column>
					<el-table-column label="报警类型" prop="type" min-width="100px" :formatter="filterAlarmType" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="报警级别" prop="alarmLevel" min-width="100px" :formatter="filterAlarmLevel"></el-table-column>
					<el-table-column label="报警来源" prop="sources" min-width="100px"></el-table-column>
					<el-table-column label="车速(km/h)" prop="speed" min-width="120px"></el-table-column>
					<el-table-column label="GPS车速(km/h)" prop="gpsSpeed" min-width="160px"></el-table-column>
					<el-table-column label="获取位置" prop="locationName" min-width="120px" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="报警时间" prop="time" min-width="120px" :show-overflow-tooltip="true" :formatter="alarmTime"></el-table-column>
					<el-table-column label="操作" prop="operation" min-width="100px">
							<template scope="scope">
								<cv-span type="primary" @click.native="handleAlarm(scope.row)" v-if="bigTime(scope.row.time)">处理</cv-span>
								<cv-span type="danger"  v-if="!bigTime(scope.row.time)">处理超时</cv-span>
							</template>
						</el-table-column>
				</el-table>
			</cv-grid>
		</cv-content>
	</div>
</template>

<script type="text/javascript">
import dropdownTree from '@/components/dropdown-tree/dropdown.tree.vue'
import { http, COMMON } from "@/utils";
import port from './index.js'
export default {
	components: { dropdownTree},
	mixins: [port],
	data() {
		return {
			// bigTime:true,
			reset:false,
			height: 500,
			value: '1',
			// 日期配置
			pickerOption: {
				disabledDate(time) {
					return time.getTime() > Date.now()
				}
			},
			// 操作栏
			operation: {
				time: [
					this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd start')),
					this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd end'))
				],
				startTime: null,
				endTime: null,
				alarm: '1',
				alarmTypes: [],
				vehicleIds: []
			},
			backTime:'',
			//报警车辆列表
			policeCarListGrid: {       
				options: {
					current: 1,
					size: 10,
					total: 0,
					flag: false
				},
				loading: false,
				table: [],
				// 所有报警类型
				allAlarm: [],
				fleetId: "",      //车队id
				enterpriseId: "", //公司id
				vehicleIds: ''     //用户账号
			},
		}
	},
	methods: {
		isSearch(type){
			if(type){
				this.policeCarListGrid.options.flag = true;
				this.policeCarListGrid.options.current = 1;
			}else{
				this.policeCarListGrid.options.flag = false;
			}
			this.search();
		},
		async search() {
			this.policeCarListGrid.loading = true;
			let ids = [], params;
			if (this.operation.vehicleIds.length > 0){
				this.operation.vehicleIds.forEach(val => {
					ids.push(val.id)
				})
			}
			if (this.operation.time != undefined){
				params = {
					vehicleIds: this.$service.isContext(ids.join(',')) ? null : ids.join(','),
					startTime: this.$filter.format(this.operation.time[0], 'yyyy-MM-dd HH:mm:ss'),
					endTime: this.$filter.format(this.operation.time[1], 'yyyy-MM-dd HH:mm:ss'),
					// alarmLevel: this.operation.alarm,
					alarmTypeStr: this.$service.isContext(this.operation.alarmTypes.join(',')) ? null : this.operation.alarmTypes.join(','),
					mapType: 1,
					current: this.policeCarListGrid.options.current,
					size: this.policeCarListGrid.options.size
				};
				if (params.startTime != undefined && params.endTime != undefined) {
					if (this.$filter.timeRange(params.startTime, params.endTime) <= 3) {
						const { flag, data } = await this.getAlarmSearch(params);
						this.policeCarListGrid.loading = false;
						if (flag && data.length != 0) {
							this.policeCarListGrid.table = data.records;
							this.policeCarListGrid.table.forEach((val)=>{					
							})
							this.policeCarListGrid.options.total = data.total;
						} else {
							this.policeCarListGrid.table = [];
							this.policeCarListGrid.options.total = 0;
						}
					} else {
						this.policeCarListGrid.loading = false;
						this.$message.error({ message: this.$t('时间范围为3天') });
					}
				} else {
					this.$message.error({ message: this.$t('请选择时间范围') });
					this.policeCarListGrid.loading = false;
				}
			} else {
				this.$message.error({ message: this.$t('请选择时间范围') });
				this.policeCarListGrid.loading = false;
			}
        },
        handleAlarm(row){
         let winParams = this.$service.winParams("/monitor/alHandle", {
			vehicleId:row.vehicleId,
			plateColor:row.plateColor,
			plateCode:row.plateCode,
			alarmTime:row.time
        });
        this.$service.winOpen(winParams);
        },
		// 选中的报警类型
		checked(alarms) {
			this.operation.alarmTypes = alarms;
		},
		// 所有报警类型
		allAlarmType(type) {
			this.allAlarm = type;
		},
		// 报警时间 
		alarmTime(row) {
		
			if (row.time != '') {
				return row.time
			} else {
				return ''
			}
        },
		bigTime(val){
			if(Date.now()-(new Date(val)).getTime()>86400000){
					return false
			}else{
					return true
			}	
			},
        down(){
			let ids = [];
			if (this.operation.vehicleIds.length > 0) {
				this.operation.vehicleIds.forEach(val => {
					ids.push(val.id)
				})
			}
          if(this.operation.time!=undefined){
            let downParams={
     	            vehicleIds: this.$service.isContext(ids.join(',')) ? null : ids.join(','),
					startTime: this.$filter.format(this.operation.time[0], 'yyyy-MM-dd HH:mm:ss'),
					endTime: this.$filter.format(this.operation.time[1], 'yyyy-MM-dd HH:mm:ss'),
					// alarmLevel: this.operation.alarm,
					mapType: 1,
					current: this.policeCarListGrid.options.current,
					size: this.policeCarListGrid.options.size
           }
           //报警处理报表导出
              const getDriveMeterExcelA=this.$service.winParams(this.$COMMON.baseUrl+ '/alarmInfo/exportAlarmInfoList',downParams);
              window.location.href=getDriveMeterExcelA;

          }else{
            this.$message.error({ message: this.$t('请选择时间') });
          }
        },
		// 过滤颜色
		filterColor(row) {
			return this.$filter.plateCodeColor(row.plateColor)
		},
		// 过滤报警级别
		filterAlarmLevel(row) {
			return this.$filter.alarmLevel(row.alarmLevel)
		},
		// 过滤报警类型
		filterAlarmType(row) {
			for (var i = 0; i < this.allAlarm.length; i++) {
				if (this.allAlarm[i].alarmId == row.alarmId) {
					return this.allAlarm[i].alarmName;
				}
			}
		},
		filterTag(row){

		}
	},
	watch:{
		'operation.time'(newVal){
			this.policeCarListGrid.options.current = 1;
			this.reset = true;
		},
		'operation.alarmTypes'(newVal){
			this.policeCarListGrid.options.current = 1;
			this.reset = true;
		},
		'operation.vehicleIds'(newVal){
			this.policeCarListGrid.options.current = 1;
			this.reset = true;
		},
		'$store.getters.ptMultiCar'(newVal){
			this.operation.vehicleIds = newVal;
		},
	},
	mounted() {	
		console.log(this.$store.getters.ptMultiCar)
		this.search();
		setTimeout(_ => {
			this.height = document.querySelector(".cv-content").offsetHeight - 60;
		}, 0)
	}
}
</script>

<style lang="scss" scoped>

</style>