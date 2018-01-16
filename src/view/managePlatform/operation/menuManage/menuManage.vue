<template>
	<div class="carFactory">
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
				<el-table-column :label="$t('mM.Menuname')" :show-overflow-tooltip="true" prop="title"></el-table-column>
				<el-table-column :label="$t('mM.addressUrl')" :show-overflow-tooltip="true" prop="href"></el-table-column>
				<el-table-column :label="$t('mM.menuType')" :show-overflow-tooltip="true" prop="menuType" :formatter="filterType"></el-table-column>
				<el-table-column :label="$t('UserManage.operation')">
					<template scope="scope">
						<cv-span type="success" @click.native="modify(scope)">{{$t('power.modify')}}</cv-span>
						<cv-span type="danger"  @click.native="remove(scope)">{{$t('power.remove')}}</cv-span>
					</template>
				</el-table-column>
			</el-table>
		</cv-grid>
	
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
		mixins: [common],
		data(){
			return{
				grid: {
					options:{
						current: 1,
						size: 10,
						total: 0,
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
						title:"",
						menuType:"",
						id:""
					},
					modify: {
						id:'',
						menuType:[],
						menuPower:[],
						id_:"",
						name:[],	
						icon:''	,
						value:"",
						
					
					}
				}
			}
		},
		methods: {
			dataList(){
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					//搜索的两个参数一上传，后台返回数据里面就是空的，注释掉返回数据就有了
					title:this.dialog.search.title,
					menuType:this.dialog.search.id
				}
				this.grid.loading = true;
				this.$store.dispatch('findMenuPageMenuInfo', params).then(data =>{
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
			load(flag){
				if(flag){
					this.grid.options.flag = true;
					this.grid.options.current = 1;
				}else{
					this.grid.options.flag = false;
				}
				this.dataList();
			},
		
			//打开添加弹框
			add(val){
				this.dialog.flag = true;
				this.dialog.title = val.title;
				this.dialog.name = val.name;
				this.dialog.size = 'dialog-small';
			},
			filterType(row){
				// console.log(row);
				switch(row.menuType){
					case 1:
					return this.$t('mM.menuMessage');
					break
					case 2:
					return this.$t('mM.menuMotinon');
					break
					case 3:
					return "APP";
					break
					case 4:
					return "CS"+this.$t('mM.customer');
					break
					default:
					break
				}

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
					this.$store.dispatch('deleteMenuByIdMenuInfo', scope.row.id).then(data => {
						if (!data.flag && !!data.errorCode){
								// this.$notify.error({message: this.$t("error."+data.errorCode)});
								this.$message.error({ message: this.$t("error."+data.errorCode) });
									}else{
									this.load();
									// this.$notify.success(this.$t('action.removeSuccess'));
									this.$message.success(this.$t('action.removeSuccess'));
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
			this.dataList();
		}
	}
</script>
<style lang="scss">
.table-expand {
	.el-form-item {
		margin-bottom: 0;
		.el-form-item__label {
			font-size: 12px;
			color: #99a9bf;
		}
		.el-form-item__content {
			vertical-align: initial
		}
	}
}
</style>





