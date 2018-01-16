<template>
	<div>
	<cv-header>
	   <el-form-item style="float:right">
	    <cv-tool
		style="margin: 0px"
		:name="$route.name"
		:data="$store.getters.monitorMenu"
		:is-modify="false"
		:is-remove="false"
		:is-export="false"
		:is-sendDelAll="true"
		:is-sendUpdate="true"
		@add="add"
		@search="search"
		@sendDelAll="sendDelAll"
		@sendUpdate="sendUpdate"
		@sendAdd="sendAdd"
		@sendEdit="sendEdit"
		></cv-tool>
	    </el-form-item>
	</cv-header>
	<cv-content>
		<cv-grid :options="grid.options" @load="load(false)">
			<el-table 
			border stripe 
			:data="grid.table" 
			v-loading="grid.loading" 
			ref="table"  @selection-change="handleSelectionChange">
			    <el-table-column type="selection" width="55"></el-table-column>
			    <el-table-column :label="$t('phoneBook.plateCode')" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('phoneBook.contactName')" prop="contactName" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('phoneBook.phoneNumber')" prop="phoneNumber" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('phoneBook.callStatus')" prop="callStatus" :show-overflow-tooltip="true" :formatter="filterCallStatus"></el-table-column>
				<el-table-column :label="$t('phoneBook.isSend')" prop="isSend" :show-overflow-tooltip="true" :formatter="filterSendStatus"></el-table-column>
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
					selectVehicleObject: null,
					search: {
						vehicleId:'',
					    plateCode:'',
						contactName:'',
                        phoneNumber:''
					},
					modify: {
						id:'',
						contactName:'',
						phoneNumber:''
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
			phoneBookList(vehicleId){
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					vehicleId:vehicleId?vehicleId:this.dialog.search.vehicleId,
					plateCode:this.dialog.search.plateCode,
					contactName:this.dialog.search.contactName,
					phoneNumber:this.dialog.search.phoneNumber
				}
				this.grid.loading = true;
				this.$store.dispatch('getPhonebookPage', params).then(data =>{
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
				this.phoneBookList();
			},
			filterCallStatus(row){
			   switch(row.callStatus){
					case 1:
					return "呼入";
					break
					case 2:
					return "呼出";
					break
					case 3:
					return "呼入呼出";
					break
					default:
					break
			    }
			},
			filterSendStatus(row){
			   switch(row.isSend){
					case 0:
					return "未发送";
					break
					case 1:
					return "已发送";
					break
					default:
					break
			    }
			},
			//打开添加弹框
			add(val){
		        if(!this.dialog.selectVehicleObject){
		           	this.$message.warning({ message: this.$t("vgPower.choseVehicle") });
			   		return;
		        }
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
					this.$store.dispatch('deletePhonebook', scope.row.id).then(data => {
						// console.log(data);
						if (!data.flag && !!data.errorCode){
							this.$message.error({ message: this.$t("error."+data.errorCode)});
							//this.$notify.error({message: this.$t("error."+data.errorCode)});
						}else{
							this.load();
							this.$message.success({ message: this.$t("action.removeSuccess") })
							// this.$notify.success(this.$t('action.removeSuccess'));
						}
					})
				})
			},
			// 发送删除所有
			sendDelAll(){
        		//  console.log(this.dialog.selectVehicleObject);
			     if(!this.dialog.selectVehicleObject){
			         this.$message.warning({ message: this.$t("vgPower.choseVehicle") });
					 return;
				 }
				 if(this.getSelectedIds().length == 0){
					 this.$message.warning({message:this.$t('请至少选择一条信息')})
					 return;
				 }
			     let params = {
			        vehicleId:this.dialog.selectVehicleObject.id,
				    type:0,
					ids: this.getSelectedIds().join(',')
			     };
			     this.confirmPrompt(this.$t("phoneBook.confirmIsSendDelAll")).then(() => {
			        this.$store.dispatch('sendPhonebookCmd', params).then(data => {
				        if (!data.flag && !!data.errorCode){
					        this.$message.error({ message: this.$t("error."+data.errorCode) });
					}else{
						this.load();
						this.$message.success({ message: this.$t("action.orderSuccess") })
					}
				})
			     })
			},
            // 发送更新
			sendUpdate(){
			    // console.log(this.dialog.selectVehicleObject);
			    if(!this.dialog.selectVehicleObject){
			        this.$message.warning({ message: this.$t("vgPower.choseVehicle") });
				 	return;
				}
				if(this.getSelectedIds().length == 0){
					 this.$message.warning({message:this.$t('请至少选择一条信息')})
					 return;
				 }
			    let params = {
			        vehicleId:this.dialog.selectVehicleObject.id,
					type:1,
					ids: this.getSelectedIds().join(',')
			    };
			    this.confirmPrompt(this.$t("phoneBook.confirmIsSendUpdate")).then(() => {
			        this.$store.dispatch('sendPhonebookCmd', params).then(data => {
				        if (!data.flag && !!data.errorCode){
					        this.$message.error({ message: this.$t("error."+data.errorCode) });
						}else{
							this.load();
							this.$message.success({ message: this.$t("action.orderSuccess") })
						}
					})
			    })
			},
            // 发送追加
			sendAdd(){
				 if(!this.dialog.selectVehicleObject){
			         this.$message.warning({ message: this.$t("vgPower.choseVehicle") });
					 return;
				 }
				 if(this.getSelectedIds().length == 0){
					 this.$message.warning({message:this.$t('请至少选择一条信息')})
					 return;
				 }
			    let params = {
			        vehicleId:this.dialog.selectVehicleObject.id,
					type:2,
					ids: this.getSelectedIds().join(',')
			    };
				if(this.getSelectedCount()>0){
					 this.confirmPrompt(this.$t("phoneBook.confirmIsSendAdd")).then(() => {
                        this.$store.dispatch('sendPhonebookCmd', params).then(data => {
							if (!data.flag && !!data.errorCode){
								this.$message.error({ message: this.$t("error."+data.errorCode) });
							}else{
								this.load();
								this.$message.success({ message: this.$t("action.orderSuccess") })
							}
						});
					 })
					
				}else{
 					this.$message.warning({ message: this.$t("eventInfo.alertToSelect") });
				}
			    
			},
            // 发送修改
			sendEdit(){
				 if(!this.dialog.selectVehicleObject){
			         this.$message.warning({ message: this.$t("vgPower.choseVehicle") });
					 return;
				 }
				 if(this.getSelectedIds().length == 0){
					 this.$message.warning({message:this.$t('请至少选择一条信息')})
					 return;
				 }
			    let params = {
			        vehicleId:this.dialog.selectVehicleObject.id,
					type:3,
					ids: this.getSelectedIds().join(',')
			    };		
				if(this.getSelectedCount()>0){
					 this.confirmPrompt(this.$t("phoneBook.confirmIsSendEdit")).then(() => {
                        this.$store.dispatch('sendPhonebookCmd', params).then(data => {
							if (!data.flag && !!data.errorCode){
								this.$message.error({ message: this.$t("error."+data.errorCode) });
							}else{
								this.load();
								this.$message.success({ message: this.$t("action.orderSuccess")})
							}
						});
					 })
                    
				}else{
					this.$message.warning({ message: this.$t("eventInfo.alertToSelect") });
				}	     
			   
			},
			//打开修改弹框
			modify(scope){
				this.dialog.flag = true;
				this.dialog.title = this.$t('power.modify');
				this.dialog.name = 'modify';
				this.dialog.size = 'dialog-tiny';
				this.dialog.modify = scope.row;
			}
		},
		watch: {
			'$store.getters.ptSingleCar'(newVal){
			    this.dialog.selectVehicleObject = newVal;
				// console.log(this.dialog.selectVehicleObject.plateCode);
				this.dialog.search.vehicleId=this.dialog.selectVehicleObject.id;
				this.dialog.search.contactName='';
				this.dialog.search.phoneNumber='';
				this.phoneBookList(this.dialog.selectVehicleObject.id);
			 }
		},
		mounted(){
			this.phoneBookList()
			
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

