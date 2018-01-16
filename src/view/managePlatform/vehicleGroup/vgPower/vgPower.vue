<template>
	<div class="vehicle-group-power">
		<!-- 车组树 -->
		<div class="searchTree">
			<!-- <search-tree style="position:absolute;width:240px;bottom:0;top:45px;" :interface="$COMMON.baseUrl+'/fleet/getFleetTreeList'" :enterprise-id="enterpriseId" @label="searchFn" :is-default="true" :is-edit="true"></search-tree> -->
			<!-- 企业树 -->
			<cv-dropdown-tree style="float:left;width:240px;" :placeholder="$t('common.enterprise.enterpriseName')" :interface="$COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'" :readonly="false" v-model="company" :is-default="true" @label="label"></cv-dropdown-tree>
			<edit-tree
			style="{position:absolute;top: 50px;bottom: 0}"
			:interface="$COMMON.baseUrl+'/fleet/getFleetTreeList'"
			:enterprise-id="enterpriseId"
			@node-click="searchFn"></edit-tree>
		</div>
		<!-- tab页签 -->
		<el-tabs class="tabContent" v-model="tabs.activeName" @tab-click="tabClick">
			<!-- 车辆列表 -->
			<el-tab-pane :label="$t('vgPower.vehicleList')" name="vehicleList">
				<div class="operation">
					<el-input class="input" size="small" :placeholder="$t('vgPower.typePlateCode')" v-model="vehicleListGrid.plateCode" :maxlength='30'></el-input>
					<cv-tool :name="$route.name" :data="$store.getters.manageMenus" class="cv-tool" @search="load" @add="openDialog" :is-export="false" :is-remove="false" :is-modify="false"></cv-tool>
				</div>
				<div class="list">
					<!-- 表格 -->
					<cv-grid class="m10" :options="vehicleListGrid.options" @load="load(false)">
						<el-table border stripe :data="vehicleListGrid.table" v-loading="vehicleListGrid.loading" :max-height="height">
							<el-table-column :label="$t('vgPower.plateCode')" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column :label="$t('vgPower.plateColor')" :formatter="plateColor" prop="plateColor" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column :label="$t('vgPower.vehicleUseStatus')" :formatter="isUse" prop="useStatus" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column :label="$t('vgPower.terminalCode')" prop="terminalCode" :show-overflow-tooltip="true"></el-table-column>
						</el-table>
					</cv-grid>
				</div>
			</el-tab-pane>
			<!-- 授权列表 -->
			<el-tab-pane :label="$t('vgPower.empowerList')" name="empowerList">
				<div class="operation">
					<el-input class="input" size="small" :placeholder="$t('vgPower.typeAccount')" v-model="userListGrid.account" :maxlength='30'></el-input>
					<cv-tool :name="$route.name" :data="$store.getters.manageMenus" class="cv-tool" @search="load" @add="openDialog" :is-export="false" :is-remove="false" :is-modify="false"></cv-tool>
				</div>
				<div class="list">
					<!-- 表格 -->
					<cv-grid class="m10" :options="userListGrid.options" @load="load(false)">
						<el-table border stripe :data="userListGrid.table" v-loading="userListGrid.loading" :max-height="height">
							<el-table-column :label="$t('vgPower.account')" prop="account"></el-table-column>
							<el-table-column :label="$t('vgPower.userName')" prop="username"></el-table-column>
							<el-table-column :label="$t('vgPower.sexy')" prop="sex" :formatter="isSex"></el-table-column>
							<el-table-column :label="$t('vgPower.mobilePhone')" prop="mobilephone"></el-table-column>
							<el-table-column :label="$t('action.operation')">
								<template scope="scope">
									<cv-table-tool :name="$route.name" :data="$store.getters.manageMenus" :is-modify="false" @remove="remove(scope)"></cv-table-tool>
								</template>
							</el-table-column>
						</el-table>
					</cv-grid>
				</div>
			</el-tab-pane>
		</el-tabs>
		<!-- 新增弹框 -->
		<el-dialog :visible.sync="addDialog.flag" :title="addDialog.title" :custom-class="addDialog.size">
			<component :is="addDialog.name" :options="addDialog" @confirm="load"></component>
		</el-dialog>
	</div>
</template>

<script>
import common from '@/utils/mixins/common.js'
import searchTree from '@/components/search-tree/search.tree.vue'
import add from './add.vue'
import addUser from './addUser.vue'
import prot from './index.js'
import editTree from '@/components/edit-ztree/edit.ztree.vue'
export default {
	components: {
		searchTree,
		add,
		addUser,
		editTree
	},
	mixins: [prot, common],
	data() {
		return {
			zTreeObj: null,
			setting: {},
			zNodes :[
				{
					name: "test1", open: true, children: [
						{ name: "test1_1" }, { name: "test1_2" }]
				},
				{
					name: "test2", open: true, children: [
						{ name: "test2_1" }, { name: "test2_2" }]
				}
			],
			height: 500,
			//公司名称
			company: "",
			//公司code
			enterpriseCode: "",
			//车队名称
			vgName: "",
			//公司id
			enterpriseId: "",
			//tab页签
			tabs: {
				activeName: 'vehicleList', //当前显示页
				tabIndex: 0  //tab页索引
			},
			//车辆列表
			vehicleListGrid: {
				options: {
					current: 1,
					size: 10,
					total: 0,
					flag:false
				},
				loading: false,
				table: [],
				fleetId: "",  //车队id
				enterpriseName: "",  //公司名称
				plateCode: "" //车牌号
			},
			//用户列表
			userListGrid: {
				options: {
					current: 1,
					size: 10,
					total: 0,
					flag:false
				},
				loading: false,
				table: [],
				fleetId: "",  //车队id
				enterpriseId: "", //公司id
				account: '' //用户账号
			},
			//弹框相关参数
			addDialog: {
				flag: false,
				title: "--",
				size: "dialog-middle",
				name: "add",
				fleetId: '',
				enterpriseId: '',
			}
		}
	},
	methods: {
		//根据车队ID查询车组权限
		vehicleList() {
			let params = {
				current: this.vehicleListGrid.options.current,
				size: this.vehicleListGrid.options.size,
				fleetId: this.vehicleListGrid.fleetId,
				plateCode: this.vehicleListGrid.plateCode
			};
			this.vehicleListGrid.loading = true;
			this.findVehicleByFleetIdforPage(params).then(data => {
				if (data.flag) {
					if (data.data.length !== 0) {
						this.vehicleListGrid.options.total = data.data.total;
						this.vehicleListGrid.table = data.data.records;
					} else {
						this.vehicleListGrid.options.total = 0;
						this.vehicleListGrid.table = data.data;
					}
				} else {
					this.vehicleListGrid.options.total = 0;
					this.vehicleListGrid.table = [];
				}
				this.vehicleListGrid.loading = false;
			});
		},
		//获取用户列表
		userList() {
			let params = {
				fleetId: this.userListGrid.fleetId,
				enterpriseId: this.enterpriseId,
				current: this.userListGrid.options.current,
				size: this.userListGrid.options.size,
				account: this.userListGrid.account
			};
			this.userListGrid.loading = true;
			this.getFleetUserList(params).then(data => {
				if (data.flag) {
					if (data.data.length !== 0) {
						this.userListGrid.options.total = data.data.total;
						this.userListGrid.table = data.data.records;
					} else {
						this.userListGrid.options.total = 0;
						this.userListGrid.table = data.data;
					}
				} else {
					this.userListGrid.options.total = 0;
					this.userListGrid.table = [];
				}
				this.userListGrid.loading = false;
			});
		},
		//企业树点击回调
		label({ id, enterpriseCode }) {
			this.enterpriseId = id;
			this.addDialog.enterpriseId = id;
			if(this.addDialog.vgName){
				this.addDialog.vgName="";
			}
		},
		//tab页签切换重置车牌号查询条件
		tabClick(tab, event) {
			this.tabs.tabIndex = tab.index;
			this.vehicleListGrid.plateCode = '';
			this.userListGrid.account = '';
			this.load()
		},
		// 点击车组树查询表格
		searchFn(val) {
			this.vehicleListGrid.fleetId = val.id;
			this.userListGrid.fleetId = val.id;
			this.addDialog.fleetId = val.id;
			this.addDialog.vgName = val.text;
			this.load();
		},
		//打开弹框
		openDialog() {
			if(this.addDialog.vgName==undefined || this.addDialog.vgName ==""){
				this.$message.warning('请先选择车组!');
				return false;
			}
			this.addDialog.enterpriseName = this.company;
			if (this.tabs.tabIndex == 0) {
				this.addDialog.flag = true;
				this.addDialog.title = this.$t('vgPower.bindingVehicle');
				this.addDialog.name = "add";
				this.addDialog.size = "dialog-large";
			} else {
				this.addDialog.flag = true;
				this.addDialog.title = this.$t('vgPower.userList');
				this.addDialog.name = "addUser";
				this.addDialog.size = "dialog-large";
			};
		},
		//表格重载
		load(flag) {
			if (this.tabs.tabIndex == 0) {
				if(flag){
					this.vehicleListGrid.options.flag = true;
					this.vehicleListGrid.options.current = 1;
				}else{
					this.vehicleListGrid.options.flag = false;
				}
				this.vehicleList();
			} else {
				if(flag){
					this.userListGrid.options.flag = true;
					this.userListGrid.options.current = 1;
				}else{
					this.userListGrid.options.flag = false;
				}
				this.userList();
			}
		},
		//用户授权表格数据删除
		remove(scope) {
			this.confirmPrompt().then(() => {
				let params = {
					fleetId: this.userListGrid.fleetId,
					userIds: scope.row.id
				}
				this.userListGrid.loading = true
				this.deleteFleetUserList(params).then(data => {
					if (data.flag) {
						this.$message.success(this.$t('action.removeSuccess'))
						this.userList();
					} else {
						this.$message.error(this.$t('action.removeFail'))
						this.userListGrid.loading = false
					}
				}).catch(_ => {
					this.userListGrid.loading = false;
				})
			})
		},
		//性别过滤
		isSex(row, column, cellValue) {
			if (row.sex == 0) {
				return this.$t("vgPower.female")
			} else {
				return this.$t("vgPower.male")
			}
		},
		//车牌过滤
		plateColor(row, column, cellValue) {
			return this.$filter.plateCodeColor(row.plateColor)
		},
		//使用状态过滤
		isUse(row, column, cellValue) {
			return this.$filter.isStuas(row.useStatus)
		}
	},
	mounted() {
		//设置表格高度
		setTimeout(_ => {
			this.height = document.querySelector(".tabContent").offsetHeight -
				document.querySelector(".el-tabs__header").offsetHeight -
				document.querySelector(".el-tab-pane .operation").offsetHeight -
				document.querySelector(".el-pagination").offsetHeight-50;
		}, 2000)
	}
}
</script>

<style lang="scss">
$inputHeight:28px;
.vehicle-group-power {
	.searchTree {
		width: 249px;
		border-right: 1px solid #ccc;
		float: left;
		position: absolute;
		bottom: 20px;
		top: 25px;
		.input {
			height: $inputHeight;
			input {
				border-radius: 0;
				border: none;
				border-bottom: 1px solid #ccc;
				height: $inputHeight
			}
		}
	}
	.tabContent {
		position: absolute;
		overflow: hidden;
		top: 20px;
		bottom: 20px;
		left: 270px;
		right: 20px;
		.el-tabs__header {
			margin-bottom: 0;
		}
		.el-tabs__content{
			position: relative;
		}
		.operation {
			float: right;
			.input {
				// margin:15px;
				margin-top: 15px;
				height: $inputHeight !important;
				width: 150px;
				.el-input__inner {
					height: $inputHeight !important;
				}
			}
		}
		.list {
			.m10 {
				margin: 0px 10px;
			}
		}
	}
}
</style>