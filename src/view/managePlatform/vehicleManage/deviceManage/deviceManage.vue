<template>
	<div class="deviceManage">
		<cv-power-tool :data="power"></cv-power-tool>
		<cv-grid :options="grid.options" @load="load">
			<el-table border stripe :data="grid.table" v-loading="grid.loading">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column :label="$t('dm.company')" :show-overflow-tooltip="true" prop="enterpriseName"></el-table-column>
				<el-table-column :label="$t('dm.status')" :show-overflow-tooltip="true" prop="isLogout" :formatter="statusFilter"></el-table-column>
				<el-table-column :label="$t('dm.terminalType')" :show-overflow-tooltip="true" prop="equipmentMode"></el-table-column>
				<el-table-column :label="$t('dm.terminalTel')" :show-overflow-tooltip="true" prop="mobileCode"></el-table-column>
				<el-table-column :label="$t('dm.bindingCar')" :show-overflow-tooltip="true" prop="plateCode"></el-table-column>
				<el-table-column :label="$t('dm.operation')" :show-overflow-tooltip="true"></el-table-column>
			</el-table>
		</cv-grid>
	</div>
</template>

<script>
	
	export default{
		data(){
			return{
				grid: {
					options: {
						page: 1,
						pageSize: 10,
						total: 0
					},
					enterpriseName: "",
					mobileCode: "",
					plateCode: "",
					table: [],
					loading: false
				}
			}
		},
		methods: {
			// 查询列表
			queryEquipment(){
				let params = {
					page: this.grid.options.page,
					pageSize: this.grid.options.pageSize,
					enterpriseName: this.grid.enterpriseName,
					mobileCode: this.grid.mobileCode,
					plateCode: this.grid.plateCode
				};
				this.grid.loading = true;
				this.$store.dispatch('queryEquipment', params).then(data=>{
					this.grid.loading = false;
					this.grid.table = data.resultList;
					this.grid.options.total = data.totalCount;
				})
			},
			// 加载调用
			load(){
				this.queryEquipment()
			},
			// 注册状态过滤
			statusFilter(row){
				return ""
			}
		},
		computed: {
			power(){
				return this.$route.query.power
			}
		},
		mounted(){
			this.queryEquipment()
		}
	}
</script>