<template>
	<div class="carFactory">
		<cv-tool 
		:name="$route.name"
        :data="$store.getters.manageMenus" 
        :is-modify="false" 
        :is-remove="false"  
        :is-export = "false"
        @add="addRole" 
        @search="searchClickLoadGrid"></cv-tool>
		<el-form :inline="true" style="float:right;margin-top: 9px;">
			<el-form-item :label="$t('role.company')">
				<cv-dropdown-tree v-model="companyText" @label="selectValue"  :interface="$COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'" :placeholder="$t('role.company')" :is-default="true"></cv-dropdown-tree>
			</el-form-item>
		</el-form>
		<cv-grid :options="grid.options" @load="getRoleList(false)">
			<el-table border stripe :data="grid.table" v-loading="grid.loading" ref="table">
				<el-table-column :label="$t('role.roleName')" prop="roleName"></el-table-column>
				<el-table-column :label="$t('role.remark')" prop="remark" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('UserManage.wellmadestarm')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('role.createTime')" prop="createTime" :formatter="timeFormat" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('role.operation')">
					<template scope="scope">
						<cv-table-tool v-show="(scope.row.roleType == 2 || scope.row.roleType == 3)" :name="$route.name" :data="$store.getters.manageMenus" @modify="updateRole(scope)" @remove="removeRole(scope)"></cv-table-tool>
					</template>
				</el-table-column>
			</el-table>
		</cv-grid>
		<el-dialog :close-on-click-modal="false" :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="searchClickLoadGrid"></component>
		</el-dialog>
	</div>
</template>

<script>
import add from "./addRole.vue"
import allCheck from './allCheck.vue'
import common from '@/utils/mixins/common'
export default {
	components: { add, allCheck },
	mixins: [common],
	data() {
		return {
			companyText:'',
			companyID: this.$store.getters.user.enterpriseId,
			treeData: [],
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
				roleOptions:{
					roleID:'',
					companyID:'',
				}
			}
		}
	},
	methods: {
		timeFormat(row){
			return this.$filter.format(row.createTime,'yyyy-MM-dd HH:mm:ss');
			
		},
		selectValue(data) {
			if (data.id !='empty') {
				this.companyID = data.id;
			}else{
				this.companyID = '';
			}
		},
		loadTree() {
			this.$store.dispatch("queryCompanyInfoList").then((data) => {
  			 	if (!data.flag && !!data.errorCode)
					this.$message.error({message: this.$t("error."+data.errorCode)});
				else 
					this.treeData = data.data;
					this.dialog.childTreeData=data.data;
			});
		},
		searchClickLoadGrid() {
			this.getRoleList();
		},
		//默认根据公司获取到角色信息
		getUserCompany(){
			// this.companyText = this.$store.getters.user.enterpriseName
			// var aa = this.$store.getters.user.enterpriseId
			let params = {enterpriseId: this.companyID ,current:this.grid.options.current,size:this.grid.options.size}
			// console.log(aa)
			this.$store.dispatch("queryRoleInfoList",params).then((data)=>{
					if (!data.flag && !!data.errorCode){
						this.$message.error({message: this.$t("error."+data.errorCode)});
					}
					else {
						this.grid.table = data.data.records;
						this.grid.options.total=data.data.total;
					}
			});
		},
		getRoleList(flag){
			if(flag){
				this.grid.options.flag = true;
				this.grid.options.current = 1;
			}else{
				this.grid.options.flag = false;
			}
			let params={ enterpriseId: this.companyID,current:this.grid.options.current,size:this.grid.options.size };
			this.$store.dispatch("queryRoleInfoList",params).then((data)=>{
					if (!data.flag && !!data.errorCode){
						this.$message.error({message: this.$t("error."+data.errorCode)});
					}
					else {
						this.grid.table = data.data.records;
						this.grid.options.total=data.data.total;
					}
			});
		},
		addRole(val) {
			this.dialog.size = 'dialog-large';
			this.dialog.name = val.name;
			this.dialog.title = val.title;
			this.dialog.flag = true;
			this.dialog.isModify = false;
		},
		updateRole(val){
			this.dialog.size = 'dialog-large';
			this.dialog.name = "add";
			this.dialog.title = this.$t('role.modifyRole');
			this.dialog.flag = true;
			this.dialog.roleOptions.companyID=val.row.enterpriseId;
			this.dialog.roleOptions.roleID=val.row.id;
			this.dialog.isModify = true;
		},
		removeRole(val){
			 this.confirmPrompt().then(() => {
					this.$http({
						url: this.$COMMON.baseUrl + '/role/deleteRoleById',
						params: {id:val.row.id}
					}).then((data)=>{
						if(data.flag){
							let params={ enterpriseId: this.companyID,current:1,size:this.grid.options.size };
							this.getRoleList(params);
							this.$message.success({message: this.$t('role.actionSuccess')});
						}
						else
							this.$message.error({message: this.$t("error."+data.errorCode)});
			});
				}).catch(() => {
					this.$message.info({message: this.$t('role.cancelRemove')});          
				});
		}
	},
	mounted() {
		this.loadTree();
		this.getUserCompany()
	},watch:{
		 'options.flag'(newval) {
			if (!newval) {
				this.dialog.name="";
				this.dialog.roleOptions.roleID="";
				this.dialog.roleOptions.companyID=""; 
			}
		 }
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