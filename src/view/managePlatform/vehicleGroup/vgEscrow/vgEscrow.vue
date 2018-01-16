<template>
	<div class="vehicle-group-escrow">
		<div class="searchTree">
			<cv-dropdown-tree 
				style="width:240px"
				:placeholder="$t('common.enterprise.enterpriseName')"
				:interface="interface"
				:is-default="true"
				v-model="company"
				@label="label"></cv-dropdown-tree>
			<!-- <search-tree 
			style="position:absolute;width:240px;bottom:0;top:50px"
			:interface="vehicleGroup"
			:enterprise-id="enterpriseId"
			:is-default="true"
			@label="searchFn"
			></search-tree> -->
			<edit-tree
			style="{position:absolute;top: 50px;bottom: 0}"
			:interface="$COMMON.baseUrl+'/fleet/getFleetTreeList'"
			:enterprise-id="enterpriseId"
			:isEdit="false"
			@node-click="searchFn"></edit-tree>
		</div>
		<el-row class="right">
			<el-col :span="24" class="top">
				<div class="operation">
					<cv-tool
					class="cv-tool" 
					:name="$route.name"
          			:data="$store.getters.manageMenus" 
					@search="search"
					:is-remove="false"
					:is-modify="false"
					:is-export="false"
					@add="add"></cv-tool>
				</div>
			</el-col>
			<el-col :span="24" class="top">
				<cv-grid :options="grid.options" @load="queryList(false)">
					<el-table border stripe :data="grid.table" v-loading="grid.loading">
						<el-table-column :label="$t('vgEscrow.company')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('vgEscrow.plateCode')" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('vgEscrow.terminalCode')" prop="mobileCode" :show-overflow-tooltip="true" min-width="110px"></el-table-column>
						<el-table-column :label="$t('vgEscrow.useStatus')" :formatter="isUse" prop="useStatus" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('vgEscrow.onlineStatus')" :formatter="isOnline" prop="onlineStatus" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('vgEscrow.isLogOut')" :formatter="isRegister" prop="isLogout"></el-table-column>
						<el-table-column :label="$t('vgEscrow.operation')">
							<template scope="scope">
								<cv-table-tool
								:name="$route.name"
        						:data="$store.getters.manageMenus"
								:is-modify='false'
								@remove="remove(scope)"></cv-table-tool>
							</template>
						</el-table-column>
					</el-table>
				</cv-grid>
			</el-col>	
		</el-row>
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="queryList(true)"></component>
		</el-dialog>
	</div>	
</template>

<script>
	import {COMMON} from '@/utils'
	import common from '@/utils/mixins/common.js'
	import add from './add.vue'
	import search from './search.vue'
	import searchTree from '@/components/search-tree/search.tree.vue'
	import editTree from '@/components/edit-ztree/edit.ztree.vue'
	export default{
		components: {
			add,
			search,
			searchTree,
			editTree
		},
		mixins: [common],
		data(){
			return{
				interface: COMMON.baseUrl + '/enterprise/getEnterpriseTreeList',
				vehicleGroup: COMMON.baseUrl + '/fleet/getFleetTreeList',
				company: "",
				enterpriseId: "",	
				grid: {
					options: {
						current: 1,
						size: 10,
						total: 0,
						flag:false
					},
					table: [],
					loading: false,
					fleetId: ""	
				},
				dialog: {
					flag: false,
					title: '--',
					size: 'dialog-large',
					name: 'search',
					search: {
						enterpriseName: "",
						plateCode: ""				
					},
					add: {
						fleetId: "",
						enterpriseId: ""
					}
				}				
			}
		},
		methods: {
			//公司下拉树点击回调
			label({id}){
				this.enterpriseId = id;	
				this.dialog.add.enterpriseId = id;	
			},
			//点击车组树查询表格
			searchFn(val){
				this.grid.fleetId = val.id;
				this.dialog.add.fleetId = val.id;
				this.queryList();
			},
			load(){
				this.queryList();
			},
			//根据车队ID获取车组代管车辆
			async queryList(flags){
				if(flags){
					this.grid.options.flag = true;
					this.grid.options.current = 1;
				}else{
					this.grid.options.flag = false;
				}
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					fleetId: this.grid.fleetId,
					enterpriseName: this.dialog.search.enterpriseName,
					plateCode: this.dialog.search.plateCode
				}
				this.grid.loading = true;
				const {data, flag} = await this.$store.dispatch('findFleetEscrowVehicleList', params);
				if(flag && data.length !=0 ){
					this.grid.table = data.records;
					this.grid.options.total = data.total;
				}else{
					this.grid.table =[];
					this.grid.options.total =0;
				}
				this.grid.loading = false;
			},
			// 搜索表格事件
			search(val){
				this.dialog.flag = true;
				this.dialog.title = this.$t('power.search');
				this.dialog.name = 'search';
				this.dialog.size = 'dialog-tiny';
			},
			// 新增打开弹框
			add(val){
				this.dialog.flag = true;
				this.dialog.title = this.$t('vgEscrow.chooseCar');
				this.dialog.name = 'add';
				this.dialog.size = 'dialog-large';
			},
			//表格数据删除
			remove(scope){
				this.confirmPrompt().then(() => {
					let params = {
						fleetId: this.grid.fleetId,
						vehicleIds: scope.row.id
					}
					this.$store.dispatch('deleteFleetEscrowVehicle', params).then(data => {
						if(data.flag){
							this.$message.success(this.$t('action.removeSuccess'));
							this.queryList();
						}else{
							this.$message.error(this.$t('action.removeFail'));
						}
					})
				})
			},
			//使用状态
			isUse(row,column,cellValue){
				return this.$filter.isStuas(row.useStatus)
			},
			//在线状态
			isOnline(row){
				return this.$filter.isOnlineState(row.onlineStatus)
			},
			//注册状态
			isRegister(row){
				return this.$filter.isRegisterFilter(row.isLogout)
			}
		}
	}
</script>

<style lang="scss">
	$inputHeight: 45px;
	.vehicle-group-escrow{
		.searchTree{
			width: 250px;
			border-right: 1px solid #dfe6ec;
			float: left;
			position: absolute;
			bottom: 20px;
			top: 82px;
			.input{
				height: $inputHeight;
				input{
					border-radius: 0;
					border: none;
					border-bottom: 1px solid #ccc;
					height: $inputHeight
				}
			}
		}
		.right{			
			margin-left: 270px;
			.top{
				margin-top: 15px
			}
			.operation{
				float: right;
				.cv-tool{
					margin: 0
				}
				.input{
					width: 150px;
					margin-right: 10px
				}
			}
		}
	}
</style>