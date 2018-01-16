<template>
	<div class="cv-predefined-info">
		<cv-header>
			<el-form-item style="float:right">
				<cv-tool
					style="margin: 0px"
					:name="$route.name"
					:data="$store.getters.monitorMenu"
					:is-modify="false"
					:is-remove="true"
					:is-export="false"
					@add="add"
					@remove="removeBatch"
					@search="search">
				</cv-tool>
			</el-form-item>
		</cv-header>
		<cv-content :fill="true">
		   <cv-grid :options="grid.options" @load="load(false)">
				<el-table border stripe :data="grid.table" v-loading="grid.loading" ref="table"   @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column :label="$t('predefinedInfo.type')" prop="type" :show-overflow-tooltip="true" :formatter="filterType"></el-table-column>
					<el-table-column :label="$t('predefinedInfo.msginfo')" prop="msginfo" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="操作" prop="operation" min-width="100px">
						<template scope="scope">
							<cv-span type="primary" @click.native="modify(scope)" >修改</cv-span>
							<cv-span type="danger" @click.native="remove(scope)" >删除</cv-span>
						</template>
					</el-table-column>
				</el-table>
		   </cv-grid>
		</cv-content>
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="load(true)"></component>
		</el-dialog>
	</div>
</template>

<script>
	import add from './add.vue'
	import search from './search.vue'
	import modify from './modify.vue'
	import common from '@/utils/mixins/common'
	import port from './'
	export default{
		components: {
			add,
			search,
			modify
		},
		mixins:[common, port],
		data(){
			return{
				grid: {
					options:{
						current: 1,
						size: 10,
						total:0,
						flag:false
					},
					table: [],
					loading: false,
					selectedData: []
				},
				dialog: {
					flag: false,
					title: '--',
					size: 'dialog-small',
					name: 'search',
					search: {
						msginfo:'',
						type:''
					},
					modify: {
						id:'',
						msginfo:'',
						type:''
					}
				},
				multipleSelection: []
			}
		},
		methods: {
		    toggleSelection(rows) {
				if (rows) {
				  	rows.forEach(row => {
				    	this.$refs.multipleTable.toggleRowSelection(row);
				  	});
				} else {
				  this.$refs.multipleTable.clearSelection();
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			getSelectedCount(){
				return this.multipleSelection.length
			},
			getSelectedIds(){
				let ids=[];
				this.multipleSelection.map((item)=> {
				ids.push(item.id);
				})
				return ids;
			},
			pageDataList(){
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					type:this.dialog.search.type,
					msginfo:this.dialog.search.msginfo
				};
				this.grid.loading = true;
				this.getPredefinedInfoPage(params).then(data =>{
					if(data.flag && data.data.length!=0){
						this.grid.table = data.data.records;
						this.grid.options.total = data.data.total;
					}else{
						this.grid.table =[];
						this.grid.options.total =0;
					}
					this.grid.loading = false;
					
				}).catch(error=>{
                     this.grid.loading = false;
                })		
			},
			load(flag) {
				if(flag){
					this.grid.options.flag = true;
					this.grid.options.current = 1;
				}else{
					this.grid.options.flag = false;
				}
				this.pageDataList()
			},
			add(val){
				this.dialog.flag = true;
				this.dialog.title = val.title;
				this.dialog.name = val.name;
				this.dialog.size = 'dialog-small';
			},
			search(val){
				this.dialog.flag = true;
				this.dialog.title = val.title;
				this.dialog.name = val.name;
				this.dialog.size = 'dialog-tiny';
			},
			remove(scope){
				this.confirmPrompt().then(() => {
					this.deletePredefinedInfoById(scope.row.id).then(data => {
						if (!data.flag && !!data.errorCode){
								this.$message.error({ message: this.$t("error."+data.errorCode) });
						}else{
							this.load();
							this.$message.success({ message: this.$t("action.removeSuccess") })
									
						}
					})
				})
			},
			removeBatch(){
			  if(this.getSelectedCount()>0){
			     this.confirmPrompt().then(() => {
					this.deletePredefinedInfoByBatch(this.getSelectedIds().join(',')).then(data => {
						
						if (!data.flag && !!data.errorCode){
						        this.$message.error({ message: this.$t("error."+data.errorCode) });
						}else{
							this.load();
							this.$message.success({ message: this.$t("action.removeSuccess") })
							
						}
					})
				})
			  }else{
			      this.$message.warning({ message: this.$t("eventInfo.alertToSelect") });
			  }
			
			},
			modify(scope){
				this.dialog.flag = true;
				this.dialog.title = this.$t('power.modify');
				this.dialog.name = 'modify';
				this.dialog.size = 'dialog-small';
				this.dialog.modify = scope.row;
			},
			filterType(row){
			   switch(row.type){
				    case 0:
				      return this.$t('predefinedInfo.selectOpt1');
				      break;
				    case 2:
				      return  this.$t('predefinedInfo.selectOpt2');
				      break;
				    case 3:
				      return this.$t('predefinedInfo.selectOpt3');
				      break;
				    case 4:
				      return this.$t('predefinedInfo.selectOpt4');
				      break;
			  }
			}
		},
		mounted(){
			this.pageDataList()
			
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