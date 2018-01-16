<template>
	<div class="carFactory">
		<cv-tool 
		:name="$route.name"
        :data="$store.getters.manageMenus" 
        :is-remove="false" 
        :is-modify="false" 
        :is-export = "false"
        @add="addUser" 
        @search="searchClick"></cv-tool>
		<el-form :inline="true" style="float:right;margin-top: 9px;">
			<el-form-item :label="$t('role.company')">
				<cv-dropdown-tree v-model="companyText" @label="selectValue" :interface="$COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'" :placeholder="$t('role.company')" :is-default="true"></cv-dropdown-tree>
			</el-form-item>
			<el-form-item :label="$t('UserManage.account')">
				<el-input size="small" v-model="account" :placeholder="$t('placeholder.inputValue')"></el-input>
			</el-form-item>
		</el-form>
		<cv-grid :options="grid.options" @load="loadGrid(false)">
			<el-table border stripe :data="grid.table" v-loading="grid.loading" ref="table">
				<el-table-column :label="$t('UserManage.account')" prop="account" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('UserManage.username')" prop="username" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('UserManage.roleNames')" prop="roleNames" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('UserManage.wellmadestarm')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('UserManage.accountType')" prop="accountType" :formatter="rowRender" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('UserManage.operation')">
					<template scope="scope">
						<cv-table-tool :name="$route.name" :data="$store.getters.manageMenus" @modify="modifyUser(scope)" :is-remove="(scope.row.accountType == 1|| scope.row.accountType == 2)" @remove="removeUser(scope)"></cv-table-tool>
					</template>
				</el-table-column>
			</el-table>
		</cv-grid>
		<el-dialog :close-on-click-modal="false" :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="loadGrid"></component>
		</el-dialog>
	</div>
</template>

<script>
import add from "./addUser.vue"
import common from '@/utils/mixins/common'
export default {
	components: { add },
	mixins: [common],
	data() {
		return {
			companyText:'',
			companyID: this.$store.getters.user.enterpriseId,
			account: '',
			treeData: [],
			Content: '',
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
				flag: false,
				title: '--',
				size: 'dialog-small',
				name: 'add',
				childTreeData:[],
				UserId:'',
				isModify:false,
				modifyData:{},
				gridOptions:{
					size:10
				},
				isShow:false,
			}
		}
	},
	methods: {
		//搜索条件的公司选择
		selectValue(data) {
			data.id == 'empty'?(this.companyID = ''):(this.companyID = data.id)
		},
		//表格加载
		loadGrid(flag,id) {
			if(flag){
				this.grid.options.flag = true;
				this.grid.options.current = 1;
			}else{
				this.grid.options.flag = false;
			}
			if(id==undefined){
				id=this.companyID;
				let params={ current: this.grid.options.current, size: this.grid.options.size, enterpriseId: id};
				this.getuserInfoList(params);
			}else{
				this.getuserInfoList();
			}
		},
		//加载机构树
		loadTree() {
			this.$store.dispatch("queryCompanyInfoList").then((data) => {
				if (!data.flag && !!data.errorCode){
					this.$message.error({ message: this.$t("error."+data.errorCode) });
				}
				else{
					this.treeData = data.data;
					this.dialog.childTreeData=this.treeData;
				}
					
			});
		},
		//默认根据公司得到用户数据
		getUsrCompany(){
			// this.companyText = this.$store.getters.user.enterpriseName
			// var aa = this.$store.getters.user.enterpriseId
			let params ={current: this.grid.options.current, size: this.grid.options.size, enterpriseId: this.companyID, account: this.account}
			this.$store.dispatch("queryUserInfoList", params).then((data) => {
				if (!data.flag && !!data.errorCode)
					this.$message.error({message: this.$t("error."+data.errorCode)});
				else {
					// console.log(data);
					this.grid.table = data.data.records;
					this.grid.options.total = data.data.total;
				}
			});
		},
		//搜索
		searchClick(flag) {
			if(flag){
				this.grid.options.flag = true;
				this.grid.options.current = 1;
			}else{
				this.grid.options.flag = false;
			}
			// if(this.companyID==""){
			// 	this.$message.error({message: this.$t('role.changeCompany')});
			// }else{
				let params = { current: this.grid.options.current, size: this.grid.options.size, enterpriseId: this.companyID,account:this.account};
				this.getuserInfoList(params);
			// }
		},
		//打开添加用户弹窗
		addUser(val) {
			this.dialog.size = 'dialog-large';
			this.dialog.name = val.name;
			this.dialog.title = val.title;
			this.dialog.flag = true;
			this.dialog.isModify = false;
		},
		//用户类型转义
		rowRender(row, column) {
			switch(row.accountType)
			{
				case 1:
				 	return this.$t('common.userType.1');
				 case 2:
				 	return this.$t('common.userType.2');
				 case 3:
				 	return this.$t('common.userType.3');
				 case 4:
				 	return this.$t('common.userType.4');
				 case 5:
				 	return this.$t('common.userType.5');
				 default:
				 	break;
			}

		},
		//获取用户列表
		getuserInfoList() {
			let params={ current: this.grid.options.current, size: this.grid.options.size, enterpriseId: this.companyID,account:this.account};
			this.$store.dispatch("queryUserInfoList", params).then((data) => {
				if (!data.flag && !!data.errorCode)
					this.$message.error({message: this.$t("error."+data.errorCode)});
				else {
					// console.log(data);
					this.grid.table = data.data.records;
					this.grid.options.total = data.data.total;
				}
			});
		},
		//修改用户弹窗
		modifyUser(val){
			// console.log(val.row);
			this.dialog.size = 'dialog-large';
			this.dialog.name = "add";
			this.dialog.title = this.$t('power.modify');
			this.dialog.flag = true;
			this.dialog.isModify = true;
			this.dialog.modifyData = val.row;
		},
		removeUser(val){
			 this.confirmPrompt().then(() => {
					this.$http({
						url: this.$COMMON.baseUrl + '/user/deleteUserById',
						params: {id:val.row.id}
					}).then((data)=>{
					if(data.flag){
						let params={ enterpriseId: this.companyID,current:1,size:this.grid.options.size };
						this.getuserInfoList(params);
						this.$message.success(this.$t('UserManage.actionSuccess'));
					}
					else
						this.$message.error(this.$t('UserManage.actionError'));
					});
				}).catch(() => {
					this.$message.info(this.$t('UserManage.cancelRemove'));   
					       
				});
		}
	},
	mounted() {
		this.loadTree();
		this.getUsrCompany()
	}
}
</script>

<style lang="scss">
.table-expand {
	.el-form-item {
		margin-bottom: 0;
		.el-form-item__label {
			font-size: 12px;
			color: #99a9bf;
		}
		.el-form-item__content {
			vertical-align: initial
		}
	}
}
</style>