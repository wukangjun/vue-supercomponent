<template>
	<div class="cv-multimedia-manage">
		<cv-header :inline="true" class="cv-header">
		  <el-form :rules="rules">
			<el-form-item label="类型:">
			    <el-select v-model="params.mediatype" style="width:80px" size="small">
					<el-option :label="$t('filter.all')" value=""></el-option>
					<el-option :label="$t('filter.picture')" value="0"></el-option>
					<el-option :label="$t('filter.music')" value="1"></el-option>
					<el-option :label="$t('filter.video')" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="格式:">
			    <el-select v-model="params.mediaencoding"  style="width:80px" size="small">
					<el-option :label="$t('filter.all')" value=""></el-option>
					<el-option :label="$t('filter.jpg')" value="0"></el-option>
					<el-option :label="$t('filter.tif')" value="1"></el-option>
					<el-option :label="$t('filter.mp3')" value="2"></el-option>
					<el-option :label="$t('filter.wav')" value="3"></el-option>
					<el-option :label="$t('filter.wmv')" value="4"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="">
			    {{$t('multimediaEvents.uploadStartTime')}}：
			    <el-date-picker
					v-model="params.startTimeStr"
					type="datetime"
					placeholder=""
					value-format="yyyy-MM-dd HH:mm:ss"
					align="right" @change="dateStartTimeChange">
				</el-date-picker>
				 {{$t('multimediaEvents.uploadEndTime')}}：
				<el-date-picker
					v-model="params.endTimeStr"
					type="datetime"
					placeholder=""
					value-format="yyyy-MM-dd HH:mm:ss"
					align="right" @change="dateEndTimeChange">
				</el-date-picker>
			</el-form-item>
			<el-form-item style="float:right">
				<cv-tool style="margin:0;" :name="$route.name" 
					:data="$store.getters.monitorMenu" 
					class="cv-tool" 
					:is-export="false" 
					:is-remove="false" 
					:is-add="false" 
					:is-modify="false"
					@search="search">
				 </cv-tool>
        	</el-form-item>
		  </el-form>
		</cv-header>
		<cv-content>
				<cv-grid :options="grid.options" @load="load(false)">
					<el-table border stripe :data="grid.table" v-loading="grid.loading" ref="table" >
									<el-table-column :label="$t('multimediaEvents.id')" prop="id" :show-overflow-tooltip="true"></el-table-column>
									<el-table-column :label="$t('multimediaEvents.channel')" prop="channel" :show-overflow-tooltip="true"></el-table-column>
									<el-table-column :label="$t('multimediaEvents.eventid')" prop="eventid" :show-overflow-tooltip="true"></el-table-column>
									<el-table-column :label="$t('multimediaEvents.mediatype')" prop="mediatype"  :show-overflow-tooltip="true" :formatter="mediaType"></el-table-column>
									<el-table-column :label="$t('multimediaEvents.mediaencoding')" prop="mediaencoding"  :show-overflow-tooltip="true" :formatter="format"></el-table-column>
									<el-table-column :label="$t('multimediaEvents.eventtype')" prop="eventtype"  :show-overflow-tooltip="true" :formatter="eventType"></el-table-column>
									<el-table-column :label="$t('multimediaEvents.eventtimeStr')" prop="eventtimeStr"  :show-overflow-tooltip="true"></el-table-column>
									<el-table-column :label="$t('multimediaEvents.uploadtimeStr')" prop="uploadtimeStr"   :show-overflow-tooltip="true"></el-table-column>
					</el-table>
				</cv-grid>
		</cv-content>
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
				<component :is="dialog.name" :options="dialog"></component>
		</el-dialog>
	</div>
</template>

<script type="text/javascript">
	import common from '@/utils/mixins/common'
	import port from './'
	export default{
		mixins:[common, port],
		data(){
			return{
				rules:{
					startTimeStr : [
						{ type: 'date', required: false, message: this.$t('filter.noempty'), trigger: 'change' }
					],
					endTimeStr : [
						{ type: 'date',required: false, message: this.$t('filter.noempty'), trigger: 'change' }
					],
				},
				params:{
					vehicleid:'',
					mediatype:'',
					mediaencoding:'',
					startTimeStr:'',
					endTimeStr:'',
					startTime:'',
					endTime:''
				},
				grid: {
					options:{
						current: 1,
						size: 10,
						total:0,
						flag:false
					},
					table: [],
					loading: false,
					selectedData: []
				},
				dialog: {
					flag: false,
					title: '--',
					size: 'dialog-small',
					name: 'search',
					selectVehicleObject:'',
				},
				multipleSelection: []
			}
		},
		methods: {
			dateStartTimeChange(){
				this.params.startTime=this.params.startTimeStr==null?"":this.$filter.format(this.params.startTimeStr,"yyyy-MM-dd HH:mm:ss");
			},
			dateEndTimeChange(){
				this.params.endTime=this.params.endTimeStr==null?"":this.$filter.format(this.params.endTimeStr,"yyyy-MM-dd HH:mm:ss");
			},
			pageDataList(vehicleId){
				let paramsTemp = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					vehicleid:vehicleId?vehicleId:this.params.vehicleid,
					mediatype:this.params.mediatype,
					mediaencoding:this.params.mediaencoding,
					startTime :this.params.startTime, 
					endTime :this.params.endTime, 
				};
				if(this.params.startTime&&this.params.endTime&&!this.$filter.CompareDate(this.params.startTime,this.params.endTime)){
					this.$message.error({ message: this.$t("multimediaEvents.timeInvalidAlert") });
					return ;
				}
				console.log(paramsTemp);
				this.grid.loading = true;
				this.getMediaEventsPage(paramsTemp).then(data =>{
					if(data.flag && data.data.length!=0){
						this.grid.table = data.data.records;
						this.grid.options.total = data.data.total;
					}else{
						this.grid.table =[];
						this.grid.options.total =0;
					}
					this.grid.loading = false;
					
				}).catch(error=>{
                     this.grid.loading = false;
                })		
			},
			load(flag) {
				if(flag){
					this.grid.options.flag = true;
					this.grid.options.current = 1;
				}else{
					this.grid.options.flag = false;
				}
				this.pageDataList()
			},
			search(){
				this.pageDataList(this.dialog.selectVehicleObject.id);
			},				
			//类型过滤
			mediaType(vall){
				return this.$filter.mediaType(vall.mediatype)
			},
			//格式过滤
			format(vall){
				return this.$filter.formatter(vall.mediaencoding)
			},
			//触发事件过滤
			eventType(vall){
				return this.$filter.eventType(vall.eventtype)
			}
		},
		watch: {
			'$store.getters.ptSingleCar'(newVal){
			    this.dialog.selectVehicleObject = newVal;
				console.log(this.dialog.selectVehicleObject.plateCode);
				this.params.vehicleid=this.dialog.selectVehicleObject.id;
				this.pageDataList(this.dialog.selectVehicleObject.id);
			 }
		},
		mounted(){
			this.pageDataList();
				
		}
	}
</script>

<style lang="scss">
	.table-expand{
		.el-form-item{
			margin-bottom: 0;
			.el-form-item__label{
				font-size: 12px;
				color: #99a9bf;
			}
			.el-form-item__content{
				vertical-align: initial
			}
		}
	}
</style>