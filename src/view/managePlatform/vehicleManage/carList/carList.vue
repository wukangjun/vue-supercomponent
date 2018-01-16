<template>
	<div class="vehicleType">
		<cv-tool 
		:name="$route.name"
        :data="$store.getters.manageMenus"
		:is-remove="false" 
		:is-modify="false" 
		:is-import='true'
		@add="add" 
		@export="down"
		@search="search"
		@imports='upload'></cv-tool>
		<cv-grid :options="grid.options" @load="carList(false)">
			<el-table border stripe :data="grid.table" v-loading="grid.loading" >
				<el-table-column :label="$t('cE.carNumbers')" prop="plateCode" width='150'  :formatter='plateCodeAndColor' :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('dm.company')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('terminal.code1')" prop="terminalCode"></el-table-column>
				<el-table-column :label="$t('cE.endPhone')" prop="mobileCode" width='150' :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('cE.regStatus')" prop="isLogout" :formatter="filterLogStuas"></el-table-column>
				<el-table-column :label="$t('cE.useStatus')" prop="useStatus"  :formatter="filterStuas"></el-table-column>
				<el-table-column :label="$t('cE.onlineStatus')" prop="onlineStatus"  :formatter="filterLineStuas"></el-table-column>
				<el-table-column :label="$t('action.operation')" width='250'>
					<template scope="scope">
						<cv-table-tool 
						:name="$route.name"
        				:data="$store.getters.manageMenus"
						@modify="modify(scope)"
						@remove="remove(scope)"></cv-table-tool>
						<div class="cv-table-tool">
							<cv-span type='success' @click.native="updataVehicleStatus(scope)"  v-show='scope.row.onlineStatus==1 ? true : false'>车辆下线</cv-span>
							<cv-span type='success' @click.native="updataUserStatus(scope)">{{scope.row.useStatus =="0" ? $t('cE.disCar'):$t('cE.useCar')}}</cv-span>
						</div>
						<div class="cv-table-tool" >
							<cv-span type='success' @click.native="changeEqument(scope)"  v-show='(scope.row.isLogout !=null && scope.row.isLogout=="1")'>{{ $t('cE.changEq')}}</cv-span>
							<cv-span type='success' @click.native="changeEqument(scope)" v-show='!scope.row.isLogout' >{{$t('cE.bindEq')}}</cv-span>
							<cv-span type='success' @click.native="unbindEqument(scope)" v-show='(scope.row.isLogout !=null && scope.row.isLogout=="1") ? true : false'>{{$t('cE.unbindEq')}}</cv-span>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</cv-grid>
		<!-- 一级弹框 -->
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="carList(true)"></component>	
		</el-dialog>
		<!-- 二级弹框 -->
		<el-dialog :visible.sync="dialog.dialog1.flag" :title="dialog.dialog1.title" :custom-class="dialog.dialog1.size">
			<component :is="dialog.dialog1.name" :options="dialog.dialog1"></component>
		</el-dialog>	
	</div>
</template>

<script>
	
	import search from './search.vue'
	import add from './add.vue'
	import modify from './modify.vue'
	import addMation from './addMation.vue'
	import addTerminal from './addTerminal.vue'
	import change from './changEqument.vue'
	import common from '@/utils/mixins/common'
	import importFile from './importFile.vue'
	import addMaster from './addMaster.vue'
	import addSuperior from './addSuperior.vue'
	import { COMMON } from '@/utils'
	export default{
		components: {
			addTerminal,
			search,
			add,
			addMation,
			modify,
			change,
			importFile,
			addMaster,
			addSuperior
		},
		mixins: [common],
		data(){
			return{
				grid: {
					options: {
						current: 1,
						size: 10,
						total: 0,
						flag:false
					},
					table: [],
					loading: false
				},
				dialog: {
					title: '--',
					flag: false,
					name: 'add',
					size: 'dialog-full',
					id:"",
					entId:"",
					search: {
						enterpriseName: "",
						id: '',
						plateCode: "",
						mobileCode: "",
						terminalCode: "",
						isLogout: '',
						useStatus: '',
						onlineStatus: ''
					},
					dialog1: {
						flag: false,
						insterTerminal:false,
						insertVehicleMaster:false,
						insterMation:false,
						name: 'addMaster',
						size: 'dialog-small',
						title: '--',
						superiorPlatformIds:'',
						superiorPlatformNames:'',
					}
				}
			}
		},
		methods: {
			carList(flag){
				if(flag){
					this.grid.options.flag = true;
					this.grid.options.current = 1;
				}else{
					this.grid.options.flag = false;
				}
				let params = {
					current: this.grid.options.current,
					page: this.grid.options.page,
					size: this.grid.options.size,
					//搜索框的条件
					enterpriseId: this.dialog.search.id,
					plateCode:this.dialog.search.plateCode,
					mobileCode:this.dialog.search.mobileCode,
					terminalCode:this.dialog.search.terminalCode,
					isLogout:this.dialog.search.isLogout,
					useStatus:this.dialog.search.useStatus,
					onlineStatus:this.dialog.search.onlineStatus
				};
				this.grid.loading = true;
				this.$store.dispatch('findVehiclePage', params).then(data => {
					if(data.flag){
						if(data.data.length!=0){
							this.grid.table = data.data.records;
							this.grid.options.total = data.data.total;
						}else{
							this.grid.table =[];
							this.grid.options.total =0;
						}
					}else{
						this.grid.table =[];
						this.grid.options.total =0;
					}
					this.grid.loading = false;
				}).catch(_=>{
					this.grid.loading = false;
				});
			},
			upload(val){
				this.dialog.flag = true;
				this.dialog.size = 'dialog-small';
				this.dialog.name = 'importFile';
				this.dialog.title = val.title;
			},
			plateCodeAndColor(row){
				return row.plateCode+"("+this.$filter.plateCodeColor(row.plateColor)+")";
			},
			filterStuas(row){
				return	this.$filter.isStuas(row.useStatus);
			},
			filterLineStuas(row){
				return	this.$filter.isOnlineState(row.onlineStatus);
			},
			filterLogStuas(row){
				return	this.$filter.isRegisterFilter(row.isLogout);
			},
			add(val) {
				this.dialog.flag = true;
				this.dialog.size = 'dialog-small';
				this.dialog.name = val.name;
				this.dialog.title = val.title;
			},
			search(val){
				this.dialog.flag = true;
				this.dialog.size = 'dialog-small';
				this.dialog.name = val.name;
				this.dialog.title = val.title;
			},
			modify(scope){
				this.dialog.flag = true;
				this.dialog.id=scope.row.id;
				this.dialog.title = this.$t('power.modify');
				this.dialog.name = 'modify';
				this.dialog.size = 'dialog-small';
			},
			remove(scope){
				this.confirmPrompt().then(() => {
					this.$store.dispatch('deleteVehicle', scope.row.id).then(data => {
						if (data.flag){
							this.$message.success(this.$t('action.removeSuccess'));
							this.carList();
						}else{
							this.$message.error(this.$t('action. removeFail'));
						}
					});
				});
			},
			down(){
				const uploadUrl = this.$service.winParams(this.$COMMON.baseUrl + '/vehicle/exportCarExcel', {
					enterpriseId: this.dialog.search.id,
					plateCode: this.dialog.search.plateCode,
					mobileCode: this.dialog.search.mobileCode,
					terminalCode: this.dialog.search.terminalCode,
					isLogout: this.dialog.search.isLogout,
					useStatus: this.dialog.search.useStatus,
					onlineStatus: this.dialog.search.onlineStatus
				});
				window.location.href = uploadUrl;
			},
			changeEqument(scope){
				this.dialog.flag = true;
				this.dialog.id=scope.row.id;
				this.dialog.entId=scope.row.enterpriseId;
				scope.row.isLogout !=null ? (this.dialog.title = this.$t('cE.changEq')) :(this.dialog.title = this.$t('cE.bindEq'));
				this.dialog.name = 'change';
				this.dialog.size = 'dialog-large';
			},
			unbindEqument(scope){
				this.$store.dispatch('unBindTerminal',{"vehicleId":scope.row.id}).then(data=>{
					if(data.flag ){
						this.$message.success(this.$t('cE.unbindSus') )
						this.carList();
					}else{
						this.$message.error(this.$t('cE.unbindErr'));
					}
				});
			},
			updataUserStatus(scope){
				this.$store.dispatch('updateVehicleUserStatus',{"useStatus":(scope.row.useStatus=="0" ? "1" : "0"),"id":scope.row.id}).then(data=>{
					if(data.flag){
						if(scope.row.useStatus=="0" ){
							this.$message.success(this.$t('cE.upUserSus') );
							this.carList();
						}else{
							this.$message.success(this.$t('cE.upStatusSus'));
							this.carList();
						}
					}else{
						if(scope.row.useStatus=="0" ){
							this.$message.error(this.$t('cE.upUserErr') );
						}else{
							this.$message.error(this.$t('cE.upStatusErr'));
						}
					}
				});	
			},
			updataVehicleStatus(scope){
				this.$store.dispatch('logoutVehicle',scope.row.id).then(data=>{
					if(data.flag){
						console.log(data)
						// this.$message.success();
						this.carList();
					}else{
						this.$message.error(this.$t("error."+data.errorCode));
					}
				});	
			}

		},
		mounted(){
			this.carList()
		}
	}
</script>

<style lang="scss">
	label{
		font-size: 14px !important;
		
	}
	
</style>