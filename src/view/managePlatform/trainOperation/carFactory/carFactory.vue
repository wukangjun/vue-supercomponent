<template>
	<div class="carFactory">
		<cv-tool
		:data="$store.state['index'].power[$route.name]"
		:is-modify="false"
		:is-remove="false"
		@add="add"
		@search="search"></cv-tool>
		<cv-grid :options="grid.options" @load="load">
			<el-table 
			border stripe 
			:data="grid.table" 
			v-loading="grid.loading" 
			ref="table">
				<el-table-column type="expand">
					<template scope="props">
						<el-form :inline="true" class="table-expand">
							<el-form-item :label="$t('msg.company1')">
								<cv-span>{{props.row.enterpriseName}}</cv-span>
							</el-form-item>
							<el-form-item :label="$t('carFactory.carname1')">
								<cv-span>{{props.row.name}}</cv-span>
							</el-form-item>
							<el-form-item :label="$t('carFactory.createTime1')">
								<cv-span>{{props.row.time}}</cv-span>
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column :label="$t('msg.company')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('carFactory.carname')" prop="name"></el-table-column>
				<el-table-column :label="$t('carFactory.createTime')" prop="createTime" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('msg.operation')">
					<template scope="scope">
						<cv-table-tool 
						:data="$store.state['index'].power[$route.name]"
						@remove="remove(scope)"
						@modify="modify(scope)"></cv-table-tool>
					</template>
				</el-table-column>
			</el-table>
		</cv-grid>
		<!-- 一级弹框 -->
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="load"></component>
		</el-dialog>
	</div>
</template>

<script>
	import add from './add.vue'
	import search from './search.vue'
	import modify from './modify.vue'
	import common from '@/utils/mixins/common'
	export default{
		components: {
			add,
			search,
			modify
		},
		mixins: [common],
		data(){
			return{
				grid: {
					options:{
						current: 1,
						size: 10,
						total: 0
					},
					table: [],
					loading: false,
					selectedData: []
				},
				dialog: {
					flag: false,
					title: '--',
					size: 'dialog-small',
					name: '',
					search: {
						name: "",
						enterpriseId: ""
					},
					modify: {}
				}
			}
		},
		methods: {
			queryList(){
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					name: this.dialog.search.name,
					enterpriseId: this.dialog.search.enterpriseId
				}
				this.grid.loading = true;
				this.$store.dispatch('findSysManufacturerPage', params).then(data =>{
					this.grid.loading = false;
					this.grid.options.total = data.data.total;
					this.grid.table = data.data.records;
					
				})
			},
			load(){
				this.queryList()
			},
			//打开添加弹框
			add(val){
				this.dialog.flag = true;
				this.dialog.title = val.title;
				this.dialog.name = val.name;
				this.dialog.size = 'dialog-tiny';
			},
			//打开搜索
			search(val){
				this.dialog.flag = true;
				this.dialog.title = val.title;
				this.dialog.name = val.name;
				this.dialog.size = 'dialog-tiny';
			},
			//删除单条数据
			remove(scope){
				this.confirmPrompt().then(() => {
					this.$store.dispatch('deleteManufacturersInfo', scope.row.id).then(data => {
						if(data.flag){
							this.$notify.success(this.$t('msg.removeSuccess'));
							this.load()
						}else{
							this.$notify.error(this.$t('msg.removeFail'));
						}
					})
				})
			},
			//打开修改弹框
			modify(scope){
				this.dialog.flag = true;
				this.dialog.title = this.$t('msg.modify');
				this.dialog.name = 'modify';
				this.dialog.size = 'dialog-tiny';
				this.dialog.modify = scope.row;
			}
		},
		mounted(){
			this.queryList()
		}
	}
</script>
<style lang="scss">
	.table-expand{
		.el-form-item{
			margin-bottom: 0;
			.el-form-item__label{
				font-size: 12px;
				color: #99a9bf;
			}
			.el-form-item__content{
				vertical-align: initial
			}
		}
	}
</style>