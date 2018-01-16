<template>
	<div>
		<el-row>
			<cv-tool :name="$route.name" :data="$store.getters.manageMenus" :is-search="false" :is-modify="isSelf" :is-export="false" :is-remove="isSelf" @add="addCompany" @remove="removeCompany" @modify="modifyCompany"></cv-tool>
		</el-row>
		<el-row class="companyManage">
			<div style="width:100%;">
				<div style="float:left;margin-top:5px;width:250px">
					<el-input :placeholder="$t('companyManage.ph')" v-model="filterText" size="small">
					</el-input>
					<search-tree 
					heightStyle="companyHeight"
					ref="companyTree"
					:data="companyTree" 
					@node-click="handleCheckChange"></search-tree>
					<!-- <cv-scrollbar width="auto" style="height:410px" v-loading="treeFlag">
						<el-tree class="filter-tree" empty-text="" :render-content="renderContent" :current-node-key="treeId" highlight-current :expand-on-click-node="false" @node-click="handleCheckChange" node-key="id" :data="companyTree" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="companyTree">
						</el-tree>
					</cv-scrollbar> -->
				</div>
				<div style="overflow:hidden;padding-left:20px;max-width:800px;">
					<el-row>
						<el-tabs>
							<el-tab-pane :label="$t('companyManage.baseInfo')">
								<el-form ref="companyForm" :model="companyForm" label-width="125px" :inline="true">
									<el-form-item :label="$t('companyManage.ename')" prop="enterpriseName">
										<el-tooltip class="item" effect="dark" :disabled="companyForm.enterpriseName == ''?true:false" :content="companyForm.enterpriseName" :enterable="false" placement="right">
											<el-input v-model="companyForm.enterpriseName" readonly></el-input>
										</el-tooltip>
									</el-form-item>
									<el-form-item :label="$t('companyManage.gmaccount')" prop="userName">
										<el-input v-model="companyForm.userName" readonly></el-input>
									</el-form-item>
									<el-form-item :label="$t('companyManage.ecode')" prop="enterpriseCode">
										<el-input v-model="companyForm.enterpriseCode" readonly></el-input>
									</el-form-item>
									<el-form-item :label="$t('companyManage.eshortName')" prop="simpleName">
										<el-input v-model="companyForm.simpleName" readonly></el-input>
									</el-form-item>
									<el-form-item :label="$t('companyManage.orgCode')" prop="orgCode">
										<el-input v-model="companyForm.orgCode" readonly></el-input>
									</el-form-item>
									<el-form-item :label="$t('companyManage.fid')" prop="identcode">
										<el-input v-model="companyForm.identcode" readonly></el-input>
									</el-form-item>
									<el-form-item :label="$t('companyManage.fname')" prop="legal">
										<el-input v-model="companyForm.legal" readonly></el-input>
									</el-form-item>
									<el-form-item :label="$t('companyManage.efox')" prop="enterFox">
										<el-input v-model="companyForm.enterFox" readonly></el-input>
									</el-form-item>
									<el-form-item :label="$t('companyManage.ephone')" prop="enterTel">
										<el-input v-model="companyForm.enterTel" readonly></el-input>
									</el-form-item>
									<el-form-item :label="$t('companyManage.email')" prop="enterZipcode">
										<el-input v-model="companyForm.enterZipcode" readonly></el-input>
									</el-form-item>
									<el-form-item :label="$t('companyManage.eaddress')" prop="address">
										<el-tooltip :disabled="companyForm.address == ''?true:false" class="item" effect="dark" :content="companyForm.address" :enterable="false" placement="right">
											<el-input v-model="companyForm.address" readonly></el-input>
										</el-tooltip>
									</el-form-item>
									<el-form-item :label="$t('companyManage.ecarType')" prop="enterpriseType">
										<el-input v-model="companyForm.enterpriseType" readonly></el-input>
									</el-form-item>
									<el-form-item :label="$t('companyManage.mapType')" prop="mapType">
										<el-input v-model="companyForm.mapType" readonly></el-input>
									</el-form-item>
									<el-form-item :label="$t('车辆上级平台')" prop="">
										<el-input v-model="companyForm.superiorPlatform" readonly></el-input>
									</el-form-item>
									<el-form-item :label="$t('业户码')" prop="">
										<el-input v-model="companyForm.consumerId" readonly></el-input>
									</el-form-item>
								</el-form>
							</el-tab-pane>
							<el-tab-pane :label="$t('companyManage.emenu')">
								<cv-scrollbar :style="(menuData.length == 0)?'height:410px;':'height:410px;border:1px solid #d1dbe5;'">
									<el-tree :style="(menuData.length == 0)?'':'border:none;'" ref="menuData" :data="menuData" :expand-on-click-node="true" :default-expand-all="true" :props="defaultProps" node-key="id">
									</el-tree>
								</cv-scrollbar>
							</el-tab-pane>
						</el-tabs>
					</el-row>
				</div>
			</div>
		</el-row>
		<el-dialog :close-on-click-modal="false" :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="loadTree"></component>
		</el-dialog>
		<el-dialog :close-on-click-modal="false" :visible.sync="dialog.childDialog.flag" :title="dialog.childDialog.title" :custom-class="dialog.childDialog.size">
			<component :is="dialog.childDialog.name" :options="dialog.childDialog" @confirm="loadTree"></component>
		</el-dialog>
	</div>
</template>
<script>
import { COMMON, http } from "@/utils"
import companyAction from "./companyAction.vue"
import menuAction from "./menuAction.vue"
import moduleAction from "./moduleAction.vue"
import sPlatform from "./superiorPlatform.vue"
import searchTree from '@/components/search-ztree/search.ztree.vue'
export default {
	components: { menuAction, moduleAction, companyAction, searchTree,sPlatform},
	data() {
		return {
			treeId: '',
			isSelf: true,
			treeFlag: true,
			companyTree: [],
			filterText: '',
			menuData: [],
			dialog: {
				flag: false,
				title: this.$t('companyManage.eManage'),
				size: 'dialog-large',
				name: 'companyAction',
				actionType: '',
				childTreeData: [],
				pid: '',
				pname: '',
				childDialog: {
					flag: false,
					title: '--',
					size: 'dialog-small',
					name: 'moduleAction',
					selectMenuID: [],
					menuUseEnterPriseId: '',
					enterpriseId: '',
					action: {
						store: '',
						node: '',
						data: '',
						type: '',
					},
					num: 0,
					superiorPlatformId:'',
					superiorPlatform:''
				},
				enterpriseId: '',
				pid: '',
				pname: ''
			},
			companyForm: {
				//上级公司ID
				pid: '',
				penterprisesName: '',
				//组织机构代码证
				orgCode: '',
				//帐号
				userName: '',
				//简称
				simpleName: '',
				//备注
				remark: '',
				//身份证
				identcode: '',
				//法人姓名
				legal: '',
				//公司名
				enterpriseName: '',
				id: '',
				//公司编码
				enterpriseCode: '',
				//邮编
				enterZipcode: '',
				//电话
				enterTel: '',
				//传真
				enterFox: '',
				//省
				areaP: '',
				//市
				areaC: '',
				//区
				areaA: '',
				//地址
				address: '',
				//上级平台
				superiorPlatform:'',
				consumerId:''
			},
			defaultProps: {
				children: 'children',
				label: 'text'
			}
		}
	},
	methods: {
		//树渲染内容
		renderContent(h, { node, data, store }) {
			return (
				<span>
					<span style="font-size:14px;">{data.text}</span>
				</span>);
		},
		//公司树点击回调
		handleCheckChange(data) {
			this.$store.getters.user.enterpriseId == data.id ? this.isSelf = false : this.isSelf = true
			this.companyForm.id = data.id;
			this.$store.dispatch("getEnterpriseByID", { id: data.id }).then((data) => {
				if (!data.flag && !!data.errorCode) {
					this.$message.error({ message: this.$t("error." + data.errorCode) });
				}
				else {
					if (!data.flag && !!data.errorCode) {
						this.$message.error({ message: this.$t("error." + data.errorCode) });
					} else if (data.flag && data.errorCode) {
						this.$message.error({ message: this.$t("error." + data.errorCode) })
					}
					else {
						this.menuData = [];
						this.menuData = data.data.entMenu;
						data.data.entInfo.mapType = this.$filter.mapType(data.data.entInfo.mapType)
						data.data.entInfo.enterpriseType != null && (data.data.entInfo.enterpriseType = this.$filter.enterpriseType(data.data.entInfo.enterpriseType))
						this.$service.extend(this.companyForm, data.data.entInfo);
						// console.log(this.companyForm)
					}
				}
			}).catch(_ => {

			});
		},
		//选中选择公司
		choseCompany(id) {
			// debugger
			if (id != '') {
				this.$store.dispatch("getEnterpriseByID", { id: id }).then((data) => {
					// debugger
					// console.log(data)
					if (!data.flag && !!data.errorCode) {
						this.$message.error({ message: this.$t("error." + data.errorCode) });
					}
					else {
						if (!data.flag && !!data.errorCode) {
							this.$message.error({ message: this.$t("error." + data.errorCode) });
						} else if (data.flag && data.errorCode) {
							this.$message.error({ message: this.$t("error." + data.errorCode) })
						}
						else {
							this.menuData = [];
							this.menuData = data.data.entMenu;
							this.$service.extend(this.companyForm, data.data.entInfo);
						}
					}
				}).catch(_ => {

				});
			}
		},
		//公司树节点过滤
		filterNode(value, data) {
			if (!value) return true;
			return data.text.indexOf(value) !== -1;
		},
		//添加公司
		addCompany() {
			this.dialog.flag = true;
			this.dialog.name = "companyAction";
			this.dialog.title = this.$t('companyManage.addC')
			this.dialog.actionType = "add";
			this.dialog.pname = this.companyForm.penterprisesName;
			this.dialog.pid = this.companyForm.pid;
			this.dialog.nowName = this.companyForm.enterpriseName
			this.dialog.nowId = this.companyForm.id
			this.dialog.childDialog.menuUseEnterPriseId = this.companyForm.id;
			this.dialog.isModify = false;
		},
		//修改公司
		modifyCompany(val) {
			// console.log(val)
			if (this.companyForm.id) {
				if (this.companyForm.id == this.$store.getters.user.id)
					this.$message.error({ message: this.$t("companyManage.tip") });
				else {
					this.dialog.flag = true;
					this.dialog.title = this.$t('companyManage.editC');
					this.dialog.name = "companyAction";
					this.dialog.actionType = "modify";
					this.dialog.enterpriseId = this.companyForm.id;
					this.dialog.pid = this.companyForm.pid;
					this.dialog.pname = this.companyForm.penterprisesName;
					this.dialog.childDialog.enterpriseId = this.companyForm.id;
					this.dialog.childDialog.menuUseEnterPriseId = this.companyForm.pid;
					this.dialog.cn = this.companyForm.enterpriseName;
					this.dialog.rn = this.companyForm.userName;
					this.dialog.isModify = true;
				}
			} else {
				this.$message.error({ message: this.$t("companyManage.tip1") });
			}
		},

		//删除公司
		removeCompany() {
			if (this.companyForm.id == "")
				this.$message.error({ message: this.$t("companyManage.tip1") });
			else {
				this.$confirm(this.$t('companyManage.tip2'), this.$t('companyManage.tip3'), {
					confirmButtonText: this.$t('companyManage.cf'),
					cancelButtonText: this.$t('companyManage.cc'),
					type: 'warning'
				}).then(() => {
					this.$http({
						url: this.$COMMON.baseUrl + "/enterprise/deleteEnterprise",
						params: { id: this.companyForm.id }
					}).then((data) => {
						if (!data.flag && !!data.errorCode) {
							this.$message.error({ message: this.$t("error." + data.errorCode) });
						}
						else {
							this.companyForm.id = ''
							this.loadTree();
							this.$refs["companyForm"].resetFields();
							this.menuData = [];
							this.$message.success({ message: this.$t('删除成功') });
						}
					});
				});
			}
		},
		// 加载公司树
		loadTree() {
			// console.log(this.filterText)
			// debugger
			this.filterText = ''
			// debugger
			if (this.dialog.addId != undefined) {
				this.treeId = this.dialog.addId
				// console.log(this.companyForm.id)
				this.$store.dispatch("getEnterpriseByID", { id: this.dialog.addId }).then((data) => {
					// console.log(data)
					if (!data.flag && !!data.errorCode) {
						this.$message.error({ message: this.$t("error." + data.errorCode) });
					}
					else {
						if (!data.flag && !!data.errorCode) {
							this.$message.error({ message: this.$t("error." + data.errorCode) });
						} else if (data.flag && data.errorCode) {
							this.$message.error({ message: this.$t("error." + data.errorCode) })
						}
						else {
							this.menuData = [];
							this.menuData = data.data.entMenu;
							data.data.entInfo.mapType = this.$filter.mapType(data.data.entInfo.mapType)
							data.data.entInfo.enterpriseType != null && (data.data.entInfo.enterpriseType = this.$filter.enterpriseType(data.data.entInfo.enterpriseType))
							this.$service.extend(this.companyForm, data.data.entInfo);
							this.dialog.addId = undefined;
						}
					}
				}).catch(_ => {

				});
			} else if (this.companyForm.id != '') {
				this.treeId = this.companyForm.id
				// console.log(this.companyForm.id)
				this.$store.dispatch("getEnterpriseByID", { id: this.companyForm.id }).then((data) => {
					// console.log(data)
					if (!data.flag && !!data.errorCode) {
						this.$message.error({ message: this.$t("error." + data.errorCode) });
					}
					else {
						if (!data.flag && !!data.errorCode) {
							this.$message.error({ message: this.$t("error." + data.errorCode) });
						} else if (data.flag && data.errorCode) {
							this.$message.error({ message: this.$t("error." + data.errorCode) })
						}
						else {
							this.menuData = [];
							this.menuData = data.data.entMenu;
							data.data.entInfo.mapType = this.$filter.mapType(data.data.entInfo.mapType)
							data.data.entInfo.enterpriseType && (data.data.entInfo.enterpriseType = this.$filter.enterpriseType(data.data.entInfo.enterpriseType))
							this.$service.extend(this.companyForm, data.data.entInfo);
						}
					}
				}).catch(_ => {

				});
			}
			this.$refs["companyForm"].resetFields();
			this.$store.dispatch("queryCompanyInfoList").then((data) => {
				if (!data.flag && !!data.errorCode)
					this.$message.error({ message: this.$t("error." + data.errorCode) });
				else {
					this.companyTree = data.data;
					this.dialog.childTreeData = data.data;
					this.treeFlag = false
				}
			});
		}
	}, watch: {
		'dialog.flag'(newval) {
			if (!newval) {
				this.dialog.childDialog.selectMenuID = [];
			}
		},
		filterText(val) {
			this.$refs.companyTree.filter(val);
		}
	},
	mounted() {
		this.loadTree();
	}
}
</script>

<style lang="scss">
.companyManage {
	.companyHeight{
		max-height: 400px;
	}
	.hide {
		display: none
	}
	.show {
		display: block
	}
	.el-tree{
		border: 0;
	}
	.el-tree-node>.el-tree-node__children {
		overflow: inherit;
	}
}
</style>

