<template>
	<div class="cv-predefined-info">
		<cv-header>
			<el-form-item style="float:right">
				<cv-tool
					style="margin: 0px"
					:name="$route.name"
					:data="$store.getters.monitorMenu"
					:is-add="false"
					:is-modify="false"
					:is-remove="false"
					:is-export="false"
					@search="search">
				</cv-tool>
			</el-form-item>
		</cv-header>
		<cv-content :fill="true">
		   <cv-grid :options="grid.options" @load="load(false)">
				<el-table border stripe :data="grid.table" v-loading="grid.loading" ref="table" >
				    <!--	<el-table-column type="selection" width="55"></el-table-column> -->
					<el-table-column :label="$t('vehicleInfo.plateCode')" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column :label="$t('vehicleInfo.plateColor')" prop="plateColor" :show-overflow-tooltip="true" :formatter="filterColor"></el-table-column>
					<el-table-column :label="$t('vehicleInfo.mobileCode')" prop="mobileCode" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column :label="$t('vehicleInfo.vehicleOwnerName')" prop="vehicleOwnerName" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column :label="$t('vehicleInfo.driverName')" prop="driverName" :show-overflow-tooltip="true" ></el-table-column>
					<el-table-column :label="$t('vehicleInfo.fleetName')" prop="fleetName" :show-overflow-tooltip="true"  ></el-table-column>
					<el-table-column :label="$t('vehicleInfo.terminalCode')" prop="terminalCode" :show-overflow-tooltip="true"  ></el-table-column>
					<el-table-column :label="$t('vehicleInfo.onlineStatus')" prop="onlineStatus" :show-overflow-tooltip="true" :formatter="filterOnlineStatus" ></el-table-column>
					<el-table-column label="操作" prop="operation" min-width="100px">
						<template scope="scope">
							<cv-span type="primary" @click.native="sendDown(scope)" >下发</cv-span>
						</template>
					</el-table-column>
				</el-table>
		   </cv-grid>
		</cv-content>
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="load(true)"></component>
		</el-dialog>
	</div>
</template>

<script>
	import search from './search.vue'
	import sendDown from './sendDown.vue'
	import common from '@/utils/mixins/common'
	import port from './'
	export default{
		components: {
			search,
			sendDown
		},
		mixins:[common, port],
		data(){
			return{
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
					search: {
						plateCode:'',
						mobileCode:'',
						driverName:'',
						enterpriseName:'',
						fleetName:'',
						onlineStatus:''
					},
					sendDown:{
					}
				},
				multipleSelection: []
			}
		},
		methods: {
			pageDataList(){
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					plateCode:this.dialog.search.plateCode,
					mobileCode:this.dialog.search.mobileCode,
					driverName:this.dialog.search.driverName,
					enterpriseName:this.dialog.search.enterpriseName,
					fleetName:this.dialog.search.fleetName,
					onlineStatus:this.dialog.search.onlineStatus
				};
				this.grid.loading = true;
				this.$store.dispatch('findAllVehiclePage',params).then(data =>{
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
			search(val){
				this.dialog.flag = true;
				this.dialog.title = val.title;
				this.dialog.name = val.name;
				this.dialog.size = 'dialog-tiny';
			},
			sendDown(scope){
                this.dialog.flag = true;
				this.dialog.title = this.$t('power.sendDown');
				this.dialog.name = 'sendDown';
				this.dialog.size = 'dialog-tiny';
				this.dialog.sendDown = scope.row;
			},
			filterColor(row){
			   switch(row.plateColor){
				    case "1":
				      return this.$t('filter.colorBlue');
				      break;
				    case "2":
				      return  this.$t('filter.colorYellow');
				      break;
				    case "3":
				      return  this.$t('filter.colorBlack');
				      break;
				    case "4":
				      return  this.$t('filter.colorWhite');
				      break;
				    case "5":
				      return  this.$t('filter.colorGreen');
				      break;
					default:
					  return this.$t('filter.color');
					  break;
			  }
			},
			filterOnlineStatus(row){
			   switch(row.onlineStatus){
				    case "0":
				      return this.$t('filter.offline');
				      break;
				    case "1":
				      return  this.$t('filter.online');
				      break;
					default:
					  return this.$t('filter.unknown');
					  break;
			  }
			}
		},
		mounted(){
			this.pageDataList()
			
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