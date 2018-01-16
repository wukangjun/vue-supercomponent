<template>
	<div class="brand">		 
		<cv-tool 
		:data="$store.state['index'].power[$route.name]"
		@add="add"></cv-tool>
		<cv-grid :options="grid.options">
			<el-table border stripe :data="grid.table" v-loading="grid.loading">
				<el-table-column :label="$t('brand.brandName')" prop="carBrand"></el-table-column>
				<el-table-column :label="$t('brand.carname')" prop="name"></el-table-column>
				<el-table-column :label="$t('brand.remark')" prop="brandRemark"></el-table-column>
				<el-table-column :label="$t('msg.operation')">
					<template scope="scope">
						<cv-table-tool
						:data="$store.state['index'].power[$route.name]"></cv-table-tool>
					</template>
				</el-table-column>
			</el-table>
		</cv-grid>
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog"></component>
		</el-dialog>
	</div>
</template>

<script>
	import add from './add.vue'
	let citys = ['上海','北京','安庆','大连'];
	export default{
		components: {add},
		data(){
			return{
				grid: {
					options: {
						page: 1,     
						pageSize: 10,
						total: 0		
					},
					loading: false,
					table: []
				},
				dialog:{
					flag: false,
					title: '--',		
					size: 'dialog-tiny',
					name: 'add'   
				}
			}
		},
		methods: {
			queryList(){
				let params = {
					page: this.grid.options.page,
					pageSize: this.grid.options.pageSize,
					name: "",
					carBrand: "",
					enterpriseCode: ""					
				}
				this.grid.loading = true;
				this.$store.dispatch('queryVehicleBrandInfoList', params).then(data => {
					this.grid.table = data.resultList;
					this.grid.options.total = data.totalCount;
					this.grid.loading = false;
				})
			},
			add(val){
				this.dialog.flag = true;
				this.dialog.title = val.title;
				this.dialog.size = 'dialog-small'
			}
		},
		mounted(){
			this.queryList()
		}
	}
</script>

<style lang="scss">
	.brand{

	}
</style>