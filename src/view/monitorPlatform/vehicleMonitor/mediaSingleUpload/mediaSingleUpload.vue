<template>
<div class="mediaSingleUpload">
	<cv-header>
		<el-form ref="uploadForm">
			<!-- <el-form-item label='车辆选择:'> -->
				<!-- <el-input size="small" style="position:relative;" readonly @click.native="toggleTree" v-model="vehicle"></el-input> -->
				<!-- 车辆树 -->
				<!-- <component :is="loadComponents.monitorTree" ref="mediaTree" class="media-tree" :class="[!treeFlag?'toggle-tree':'']" :is-check="false" :show-checkbox="false" size="big" :is-show-track="false" :default-show="false" @single="single"></component> -->
			<!-- </el-form-item> -->
			<el-form-item style="float:right">
				<cv-tool style="margin: 0px" :name="$route.name" :data="$store.getters.monitorMenu" :is-add="false" :is-modify="false" :is-remove="false" :is-export="false" :is-search="false" :is-upload="true" @upload="upload"></cv-tool>
			</el-form-item>
		</el-form>
	</cv-header>
	<cv-content>
		<div class="contentL">
		<el-alert :title="'已上传信息'+vehicle" type="info" style="border-radius:0;background-color:#909399;" :closable="false"></el-alert>
		<!-- 表格 -->
		<cv-grid class="" :options="gridL.options" @load="gridLLoad">
			<el-table border stripe :data="gridL.table" v-loading="gridL.loading" :max-height="$service.getAutoHeight(1,1)">
				<el-table-column :label="$t('类型')" width="80" prop="mediaType" :formatter="mediaType" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('通道')" width="80" prop="channel" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('GPS时间')" prop="gpsDate" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('上传时间')" prop="orderTime" :show-overflow-tooltip="true"></el-table-column>
			</el-table>
		</cv-grid>
	</div>
	<div class="contentR">
		<el-alert :title="'选择需要上传的媒体数据'+vehicle" style="border-radius:0;background-color:#909399;" type="info" :closable="false"></el-alert>
		<!-- 表格 -->
		<cv-grid class="" :options="gridR.options" @load="gridRLoad">
			<el-table @selection-change='selectIDs' border stripe :data="gridR.table" v-loading="gridR.loading" :max-height="$service.getAutoHeight(1,1)">
				<el-table-column type="selection" width="45"></el-table-column>
				<el-table-column :label="$t('类型')" width="80" prop="mediaType" :formatter="mediaType" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('通道')" width="80" prop="channel" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('GPS时间')" prop="gpsDate" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('action.operation')">
					<template scope="scope">
						<el-button type="text" @click.native="upload(scope.row.id)">上传</el-button>
					</template>
				</el-table-column>
		  	</el-table>
		</cv-grid>
	</div>
	</cv-content>
	<!-- 新增弹框 -->
	<el-dialog :close-on-click-modal="false" :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
		<component :is="dialog.name" :options="dialog" @confirm="confirm"></component>
	</el-dialog>
</div>
</template>

<script>
import monitorTree from "@/components/monitor-tree/monitor.tree.vue";
import upload from "./upload.vue";
import prot from "./index.js"
export default {
	components: {
		monitorTree,
		upload,
	},
	mixins: [prot],
	data() {
		return {
			loadComponents: {
				monitorTree: 'monitorTree'
			},
			treeFlag: false,
			vehicle: '',
			vehicleId:'',
			SId: null,
			SIds: null,
			gridL: {
				options: {
					current: 1,
					size: 10,
					total: 0,
					flag: false
				},
				table: [],
				loading: false,
			},
			gridR: {
				options: {
					current: 1,
					size: 10,
					total: 0,
					flag: false
				},
				table: [],
				loading: false,
			},
			dialog: {
				flag: false,
				title: '上传',
				size: 'dialog-tiny',
				name: 'upload',
				radio: 1,
			},
			formData: {
				eventid: '',
				delflag: 0
			},
			multipleSelection: []
		}
	},
	methods: {
		single(val) {
			this.vehicle = val.plateCode;
			this.vehicleId = val.id;
			this.toggleTree()
			this.gridLLoad();
			this.gridRLoad();
		},
		// search() {
			
		// },
		toggleTree() {
			this.treeFlag = !this.treeFlag;
		},
		gridLLoad(type) {
			if (type) {
				this.gridL.options.flag = true;
				this.gridL.options.current = 1;
			} else {
				this.gridL.options.flag = false;
			}
			let params = {
				vehicleId: this.vehicleId,
				uploadFlag: 1,
				current:this.gridL.options.current,
				size:this.gridL.options.size
			};
			this.gridL.loading = true;
			this.findMediaSelectBackList(params).then(data => {
					if (data.flag) {
						if (data.data.length != 0) {
							this.gridL.table = data.data.records;
							this.gridL.options.total = data.data.total;
						} else {
							this.gridL.table = [];
							this.gridL.options.total = 0;
						}
					} else {
						this.gridL.table = [];
						this.gridL.options.total = 0;
					}
					this.gridL.loading = false;
				})
				.catch(_ => {

				})
		},
		gridRLoad(type) {
			if (type) {
				this.gridR.options.flag = true;
				this.gridR.options.current = 1;
			} else {
				this.gridR.options.flag = false;
			}
			let params = {
				vehicleId: this.vehicleId,
				uploadFlag: 0,
				current:this.gridR.options.current,
				size:this.gridR.options.size
			};
			this.gridR.loading = true;
			this.findMediaSelectBackList(params).then(data => {
					if (data.flag) {
						if (data.data.length != 0) {
							this.gridR.table = data.data.records;
							this.gridR.options.total = data.data.total;
						} else {
							this.gridR.table = [];
							this.gridR.options.total = 0;
						}
					} else {
						this.gridR.table = [];
						this.gridR.options.total = 0;
					}
					this.gridR.loading = false;
				})
				.catch(_ => {

				})
		},
		selectIDs(val){
			let tempArr = [];
			val.forEach(element => {
				tempArr.push(element.id)
			});
			if(tempArr.length == 1){
				this.SId = tempArr[0];
			}else{
				this.SIds = tempArr.join(',')
			}
		},
		// 上传
		upload(val) {
			val && (this.SId = val);
			if(this.SIds || this.SId){
				this.dialog.flag = true;
				this.dialog.name = 'upload';
				this.dialog.selectId = this.SIds || this.SId;
				this.dialog.vehicleId = this.vehicleId;
			}else{
				this.$message.warning({message:this.$t('请至少选择一条数据!')});
				return false;
			}
		},
		//类型过滤
		mediaType(vall) {
			return this.$filter.mediaType(vall.mediaType)
		},
		confirm() {
			this.gridLLoad();
			this.gridRLoad()
		}
	},
	watch: {
		'dialog.flag'(newVal){
			if(newVal){
				this.SId = null;
				this.SIds = null;
			}
		},
		'$store.getters.ptSingleCar'(newVal){
			// console.log(newVal)
			this.vehicle = '--'+newVal.plateCode;
			this.vehicleId = newVal.id;
			this.gridLLoad();
			this.gridRLoad();
		}
	},
	// mounted() {

	// },
	beforeDestroy() {
		this.$instruction({}).close();
	}
}
</script>

<style lang="scss">
.mediaSingleUpload {
	overflow: hidden;
	.media-tree {
		position: absolute;
		z-index: 1;
		width: 300px;
		top: 45px;
		left: 0px;
		transition: all 0.4s ease-in-out;
	}
	.toggle-tree {
		top: -1000px;
		left: 0px;
		transition: all 0.5s ease-in-out;
	}
	.contentL,
	.contentR {
		position: absolute;
		top: 10px;
		bottom: 10px;
		left: 10px;
		right: 50.5%;
		z-index: 0;
		background-color: rgba(255, 255, 255, 0.98);
	}
	.contentR {
		left: 50.5%;
		right: 10px;
	}
	.cv-treelist .monitorPagination {
		bottom: -10px;
	}
	.cv-treeFollow .el-pagination{
		bottom:-10px;
	}
}
</style>

