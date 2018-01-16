<template>
	<div class="vehicleG">
		<el-row>
			<el-col :span="22">
				<el-form :inline="true" label-width="80px">
					<el-form-item :label="$t('vgEscrow.company')">
						<el-input v-model.trim="grid.enterpriseName"></el-input>
					</el-form-item>
					<el-form-item :label="$t('vgEscrow.plateCode')">
						<el-input v-model.trim="grid.plateCode"></el-input>
					</el-form-item>
					<el-form-item :label="$t('vgEscrow.mobile')">
						<el-input v-model.trim="grid.mobileCode"></el-input>
					</el-form-item>
					<el-form-item :label="$t('vgEscrow.useStatus')">
						<el-select v-model="grid.useStatus" clearable class="select">
							<el-option :label="$t('vgEscrow.use')" value="0"></el-option>
							<el-option :label="$t('vgEscrow.stop')" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('vgEscrow.onlineStatus')">
						<el-select v-model="grid.onlineStatus" clearable class="select">
							<el-option :label="$t('vgEscrow.online')" value="1"></el-option>
							<el-option :label="$t('vgEscrow.offline')" value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('vgEscrow.isLogOut')">
						<el-select v-model="grid.isLogout" clearable class="select">
							<el-option :label="$t('vgEscrow.isLog')" value="0"></el-option>
							<el-option :label="$t('vgEscrow.isOut')" value="1"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="2">
				<el-button type="success" @click="queryList">{{$t('power.search')}}</el-button>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<cv-grid :options="grid.options" @load="queryList">
					<el-table border stripe max-height="300" :data="grid.table" @selection-change="handlerChange" v-loading="grid.loading" ref="addTable">
						<el-table-column type="selection" width="55px"></el-table-column>
						<el-table-column :label="$t('vgEscrow.company')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('vgEscrow.plateCode')" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('vgEscrow.terminalCode')" prop="mobileCode" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('vgEscrow.useStatus')" :formatter="isUse" prop="useStatus" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('vgEscrow.onlineStatus')" :formatter="isOnline" prop="onlineStatus" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('vgEscrow.isLogOut')" :formatter="isRegister" prop="isLogout" :show-overflow-tooltip="true"></el-table-column>
					</el-table>
				</cv-grid>
			</el-col>
		</el-row>
		<el-row class="dialog-footer" style="margin-top:20px">
			<el-col :span="24">
				<el-button type="primary" @click="confirm">{{this.$t('power.add')}}</el-button>
				<el-button @click="options.flag=false">{{this.$t('action.cancel')}}</el-button>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { service } from '@/utils'
export default {
	props: {
		options: {}
	},
	data() {
		return {
			grid: {
				options: {
					current: 1,
					size: 10,
					total: 0
				},
				loading: false,
				table: [],
				current: [],
				enterpriseName: "",
				plateCode: "",
				onlineStatus: "",
				useStatus: "",
				isLogout: "",
				mobileCode: ""
			}
		}
	},
	methods: {
		queryList() {
			let params = {
				current: this.grid.options.current,
				size: this.grid.options.size,
				fleetId: this.options.add.fleetId,
				enterpriseName: this.grid.enterpriseName,
				plateCode: this.grid.plateCode,
				useStatus: this.grid.useStatus,
				isLogout: this.grid.isLogout,
				mobileCode: this.grid.mobileCode
			}
			if(this.grid.onlineStatus !=''){
				params.onlineStatus = this.grid.onlineStatus
			}
			this.grid.loading = true;
			this.$store.dispatch('findFleetSureEscrowVehicleList', params).then(data => {
				if(data.flag && data.data.length !=0){
					this.grid.options.total = data.data.total;
					this.grid.table = data.data.records;
				}else{
					this.grid.options.total = 0;
					this.grid.table = [];
				}			
				this.grid.loading = false;
			})
		},
		// 表格单选事件
		handlerChange(val) {
			this.grid.current = [];
			val.forEach(item => {
				this.grid.current.push(item.id)
			})
		},
		// 确认事件
		confirm() {
			if (this.grid.current.length !== 0) {
				let params = {
					vehicleIds: this.grid.current.join(','),
					fleetId: this.options.add.fleetId,
					enterpriseId: this.options.add.enterpriseId
				}
				this.$store.dispatch('addFleetEscrowVehicle', params).then(data => {
					if (data.flag) {
						this.$message.success('新增成功!');
						this.options.flag = false;
						this.$emit('confirm');
					} else {
						this.$message.error('新增失败!')
					}
				})
			} else {
				this.$message.error('请选择一行数据')
			}
		},
		//使用状态过滤
		isUse(row, column, cellValue) {
			return this.$filter.isStuas(row.useStatus)
		},
		//在线状态
		isOnline(row) {
			return this.$filter.isOnlineState(row.onlineStatus)
		},
		//注册状态
		isRegister(row) {
			return this.$filter.isRegisterFilter(row.isLogout)
		}
	},
	watch: {
		'options.flag'(newVal) {
			if (!newVal) {
				this.options.name = '';
			}
		}
	},
	mounted() {
		this.queryList()
	}
}
</script>

<style lang="scss">
.vehicleG {
	.el-input,
	.select {
		width: 169px
	}
}
</style>