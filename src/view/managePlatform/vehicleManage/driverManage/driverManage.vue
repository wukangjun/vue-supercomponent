<template>
	<div>
		<cv-tool
		:name="$route.name"
        :data="$store.getters.manageMenus"
		:is-modify="false"
		:is-remove="false"
		:is-export="false"
		@add="add"
		@search="search"></cv-tool>
		<cv-grid :options="grid.options" @load="load(false)">
			<el-table 
			border stripe 
			:data="grid.table" 
			v-loading="grid.loading" 
			ref="table">
				<el-table-column :label="$t('dm.company')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('dM.driveName')" prop="username" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('dM.sex')" prop="sex" :formatter="filterSex"></el-table-column>
				<el-table-column :label="$t('dM.tel')" prop="mobilephone" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('dM.driveCode')" prop="driverlicenseno" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('dM.startmode')" prop="accountStatus" :show-overflow-tooltip="true" :formatter="filterStuas"></el-table-column>
				
					<el-table-column :label="$t('UserManage.operation')">
					<template scope="scope">
						<cv-table-tool 
						:name="$route.name"
        		:data="$store.getters.manageMenus"
						@remove="remove(scope)"
						@modify="modify(scope)"
						:is-remove="scope.row.vehicleId!=null?false:true"
						></cv-table-tool>
					</template>
				</el-table-column>
			</el-table>
		</cv-grid>
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
					size: 'dialog-small',
					name: 'search',
					search: {
						enterpriseName:'',
						id: "",
						username:""
							
						},
					modify: {
						id:'',
						sex:''					
					}
				}
			}
		},
		methods: {
			driveList(){
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					//搜索的两个参数一上传，后台返回数据里面就是空的，注释掉返回数据就有了
					enterpriseId: this.dialog.search.id,
					username:this.dialog.search.username
				}
				this.grid.loading = true;
				this.$store.dispatch('findDriverPage', params).then(data =>{
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
				this.driveList()
			},
			filterSex(row){
				switch(row.sex){
					case '1':
					return "男";
					break
					case '0':
					return "女";
					break
					default:
					break

				}

			},
			filterStuas(row){
				switch(row.accountStatus){
					case 0:
					return "启用";
					break
					case 1:
					return "未启用";
					break
					default:
					break
				}
			},
			//打开添加弹框
			add(val){
				this.dialog.flag = true;
				this.dialog.title = val.title;
				this.dialog.name = val.name;
				this.dialog.size = 'dialog-small';
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
					this.$store.dispatch('deleteDriver', scope.row.id).then(data => {
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
			//打开修改弹框
			modify(scope){
				this.dialog.flag = true;
				this.dialog.title = this.$t('power.modify');
				this.dialog.name = 'modify';
				this.dialog.size = 'dialog-small';
				this.dialog.modify = scope.row;
			}
		},
		mounted(){
			this.driveList()
			
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

