<template>
	<div class="vehicleType">
		<cv-tool 
		:name="$route.name"
        :data="$store.getters.manageMenus"
		@add="add" 
		@search="search"></cv-tool>
		<cv-grid :options="grid.options" @load="load">
			<el-table border stripe :data="grid.table" v-loading="grid.loading">
				<el-table-column type="expand">
					<template scope="props">
						<el-form :inline="true" label-position="left">
							<el-form-item label="商品名称:">
								<cv-span>{{props.row.carMode}}</cv-span>
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column :label="$t('vt.vehicleType')" prop="carMode" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('vt.limitPeople')" prop="maxPassenger" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('vt.weight')" prop="maxWeight" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('vt.motorBrand')" prop="engineBrand" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('vt.vehicleBrand')" prop="carBrand" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('vt.carFactory')" prop="name" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('msg.operation')">
					<template scope="scope">
						<cv-table-tool 
						:name="$route.name"
          				:data="$store.getters.manageMenus"
						@modify="modify(scope)"></cv-table-tool>
					</template>
				</el-table-column>
			</el-table>
		</cv-grid>
		<!-- 一级弹框 -->
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="load"></component>	
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
	import addBrand from './addBrand.vue'
	import addCarFactory from './addCarFactory.vue'
	import port from './index.js'
	export default{
		components: {
			search,
			add,
			addBrand,
			addCarFactory
		},
		mixins: [port],
		data(){
			return{
				grid: {
					options: {
						page: 1,
						pageSize: 10,
						total: 0
					},
					table: [],
					loading: false
				},
				dialog: {
					title: '--',
					flag: false,
					name: 'search',
					size: 'dialog-small',
					search: {
						carBrand: "",
						carMode: ""
					},
					dialog1: {
						flag: false,
						name: 'addBrand',
						size: 'dialog-small',
						title: '--'
					}
				}
			}
		},
		methods: {
			queryList(){
				let params = {
					page: this.grid.options.page,
					pageSize: this.grid.options.pageSize,
					carBrand: this.dialog.search.carBrand,
					carMode: this.dialog.search.carMode
				}
				this.grid.loading = true;
				this.queryVehicleMsg(params).then(data => {
					console.log(data)
					this.grid.loading = false;
					this.grid.table = data.resultList;
					this.grid.options.total = data.totalCount;
				})
			},
			load(){
				this.queryList()
			},
			add(val){
				this.dialog.size = 'dialog-small';
				this.dialog.name = val.name;
				this.dialog.title = val.title;
				this.dialog.flag = true;
			},
			search(val){
				this.dialog.size = 'dialog-tiny';
				this.dialog.name = val.name;
				this.dialog.title = val.title;
				this.dialog.flag = true;
			},
			modify(scope){
				console.log(scope)
			}
		},
		mounted(){
			this.queryList()
		}
	}
</script>

<style lang="scss">
	label{
		font-size: 12px !important;
	}
</style>