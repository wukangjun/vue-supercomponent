<template>
	<div>
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
					@search="search"></cv-tool>
			</el-form-item>
		</cv-header>
		<cv-content :fill='true'>
			<cv-grid :options="grid.options" @load="load(false)">
				<el-table 
				border stripe 
				:data="grid.table" 
				v-loading="grid.loading" 
				ref="table"   @selection-change="handleSelectionChange">
				    	<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column :label="$t('information.infoType')" prop="infoType" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('information.infoTypeContent')" prop="infoTypeContent" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('information.startSendTimeStr')" prop="startSendTimeStr" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('information.endSendTimeStr')" prop="endSendTimeStr" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('information.information')" prop="information" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column label="操作" prop="operation" min-width="100px">
							<template scope="scope">
								<cv-span type="primary" @click.native="modify(scope)" >修改</cv-span>
								<cv-span type="danger" @click.native="remove(scope)" >删除</cv-span>
							</template>
						</el-table-column>
				</el-table>
			</cv-grid>
		</cv-content>
		<!-- 一级弹框 -->
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
	export default{
		components: {
			add,
			search,
			modify
		},
		mixins:[common],
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
					size: 'dialog-tiny',
					name: 'search',
					search: {
						infoTypeContent:'',
						information:''
						},
					modify: {
						infoType:'',
						information:'',
						startSendTimeStr:''	,
						endSendTimeStr:''
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
			informationList(){
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					infoTypeContent:this.dialog.search.infoTypeContent,
					information:this.dialog.search.information
				}
				this.grid.loading = true;
				this.$store.dispatch('getInformationPage', params).then(data =>{
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
				this.informationList()
			},
			//打开添加弹框
			add(val){
				this.dialog.flag = true;
				this.dialog.title = val.title;
				this.dialog.name = val.name;
			},
			//打开搜索
			search(val){
				this.dialog.flag = true;
				this.dialog.title = val.title;
				this.dialog.name = val.name;
			},
			//删除单条数据
			remove(scope){
				this.confirmPrompt().then(() => {
					this.$store.dispatch('deleteInformationById', scope.row.id).then(data => {
						// console.log(data);
						if (!data.flag && !!data.errorCode){
								this.$message.error({ message: this.$t("error."+data.errorCode) });
					//this.$notify.error({message: this.$t("error."+data.errorCode)});
									}else{
									this.load();
									this.$message.success({ message: this.$t("action.removeSuccess") })
									// this.$notify.success(this.$t('action.removeSuccess'));
								}
					})
				})
			},
			//删除单条数据
			removeBatch(){
			  if(this.getSelectedCount()>0){
			     this.confirmPrompt().then(() => {
					this.$store.dispatch('deleteInformationByBatch',  this.getSelectedIds().join(',')).then(data => {
						// console.log(data);
						if (!data.flag && !!data.errorCode){
						        this.$message.error({ message: this.$t("error."+data.errorCode) });
						}else{
							this.load();
							this.$message.success({ message: this.$t("action.removeSuccess") })
							
						}
					})
				})
			  }else{
			    this.$message.warning({ message: this.$t("information.alertToSelect") });
			  }
			
			},
			//打开修改弹框
			modify(scope){
				this.dialog.flag = true;
				this.dialog.title = this.$t('power.modify');
				this.dialog.name = 'modify';
				this.dialog.modify = scope.row;
			}
		},
		mounted(){
			this.informationList()
			
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

