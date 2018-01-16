<template>
	<div class="deviceType">
		<cv-tool :name="$route.name" :data="$store.getters.manageMenus" class="cv-tool" :is-export="false" :is-remove="false" :is-modify="false" :is-search="false" @add="add"></cv-tool>
		<!-- 表格 -->
		<cv-grid class="" :options="grid.options" @load="listShow">
			<el-table border stripe :data="grid.table" v-loading="grid.loading">
				<el-table-column :label="$t('deviceManage.manufacturerName')" prop="manufacturerName" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('deviceManage.deviceType')" prop="model" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('deviceManage.makerNum')" prop="manufacturerNumber" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('terminalProM.remark')" prop="remark" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('action.operation')">
					<template scope="scope">
						<cv-table-tool :name="$route.name" :data="$store.getters.manageMenus" @remove="remove(scope)" :is-modify="false" @modify="modify(scope)"></cv-table-tool>
					</template>
				</el-table-column>
			</el-table>
		</cv-grid>
		<!-- 新增弹框 -->
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="listShow"></component>
		</el-dialog>
	</div>
</template>

<script>
import common from '@/utils/mixins/common.js'
import ports from './index.js'
import addOrEdit from './addOrEdit.vue'
export default {
	//模块引用
	components: {
		addOrEdit
	},
	mixins: [ports, common],
	//数据
	data() {
		return {
			grid: {
				options: {
					current: 1,
					size: 10,
					total: 0
				},
				table: [],
				loading: false
			},
			dialog: {
				flag: false,
				name: 'addOrEdit',
				size: 'dialog-small',
				title: '--',
				isModify: false,
				rowInfo: []
			}
		}

	},
	methods: {
		//获取表格数据
		async listShow() {
			// console.log('come in ');
			let params = {
				current: this.grid.options.current,
				size: this.grid.options.size
			}
			this.grid.loading = true
			const {data,flag} = await this.findTerminalModelPage(params)
			if(flag){
				if(data.length !== 0){
					this.grid.options.total = data.total;
					this.grid.table = data.records;
				}else {
					this.grid.options.total = 0;
					this.grid.table = data;
				}
				this.grid.loading = false
			}else{
				this.grid.options.total = 0;
				this.grid.table = [];
				this.grid.loading = false
			}
			// this.findTerminalModelPage(params).then(data => {
			// 	if (data.flag) {
			// 		if (data.data.length !== 0) {
			// 			this.grid.options.total = data.data.total;
			// 			this.grid.table = data.data.records;
			// 		} else {
			// 			this.grid.options.total = 0;
			// 			this.grid.table = data.data;
			// 		}
			// 	} else {
			// 		this.grid.options.total = 0;
			// 		this.grid.table = [];
			// 	}
			// 	this.grid.loading = false
			// })
		},
		//新增
		add(val) {
			this.dialog.title = val.title
			this.dialog.size = "dialog-tiny"
			this.dialog.name = 'addOrEdit'
			this.dialog.flag = true
			this.dialog.isModify = false
			// this.dialog.tipSuccess = this.$t('action.addSuccess')
			// this.dialog.tipError = this.$t('action.addFail')
		},
		//修改
		modify(scope) {
			this.dialog.title = this.$t('power.modify')
			this.dialog.size = "dialog-tiny"
			this.dialog.name = 'addOrEdit'
			this.dialog.flag = true
			this.dialog.isModify = true
			this.dialog.rowInfo = scope.row
			// this.dialog.tipSuccess = this.$t('action.updateSuccess')
			// this.dialog.tipError = this.$t('action.updateError')
		},
		//删除
		remove(scope) {
			this.confirmPrompt().then(() => {
				this.grid.loading = true;
				let params = {
					id: parseInt(scope.row.id)
				}
				// const {flag,errorCode} = await this.deleteTerminalModelById(params)
				// if(flag){
				// 	this.$message.success(this.$t('action.removeSuccess'))
				// 	this.listShow()
				// }else {
				// 	this.$message.error(this.$t("error." + errorCode))
				// 	this.grid.loading = false;
				// }
				this.deleteTerminalModelById(params).then(data => {
					if (data.flag) {
						this.$message.success(this.$t('action.removeSuccess'))
						this.listShow()
					} else {
						this.$message.error(this.$t("error." + data.errorCode))
						this.grid.loading = false;
					}
				})
			})
		},
	},
	mounted() {
		this.listShow()
	}

}
</script>

<style scoped lang="scss">

</style>
