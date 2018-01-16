<template>
	<div>
	<cv-tool
		:name="$route.name"
        :data="$store.getters.manageMenus"
		:is-modify="false"
		:is-remove="false"
		:is-search="false"
		:is-export="false"
		@add="add"
		></cv-tool>
		<cv-grid :options="grid.options" @load="load">
			<el-table border stripe :data="grid.table" v-loading="grid.loading">
				
				
				<el-table-column :label="$t('pM.permissionName')" prop="name" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('pM.permissionCode')" prop="code" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('pM.addDate')" prop="createTime" :formatter="timeFormat" :show-overflow-tooltip="true" ></el-table-column>
				<el-table-column :label="$t('pM.addPerson')" prop="createUser" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('UserManage.operation')">
					<template scope="scope">
						<cv-span type="success" @click.native="modify(scope)">{{$t('power.modify')}}</cv-span>
						<cv-span class="cv-span-danger"  @click.native="remove(scope)">{{$t('power.remove')}}</cv-span>
					</template>
				</el-table-column>
			</el-table>
		</cv-grid>

		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="load"></component>	
		</el-dialog>
	</div>
</template>
<script>
	import add from './add.vue'
	import modify from './modify.vue'
	import common from '@/utils/mixins/common'
	export default{
		components: {
			add,
		  modify
		},
		mixins: [common],
		data(){
			return{
				grid: {
					options: {
						flag:false,
						current: 1,
						size: 10,
						total: 10
					},
					table: [],
					loading: false
				},
				dialog: {
					title: '--',
					flag: false,
					name: 'addClick',
					size: 'dialog-small',
					search: {
						carBrand: null,
						carMode: null
					},
					modify:{
						id:'',
						code:'',
						name:''

					}
				
				}
			}
		},
		methods: {
		timeFormat(row){
			return	this.$filter.format(row.createTime,'yyyy-MM-dd HH:mm:ss');
		},
		findMenuList(){
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
				
			}
				this.grid.loading = true;
				this.$store.dispatch('findActionPage', params).then(data => {
					this.grid.loading = false;
					if(data.flag && data.data.length!=0){
						this.grid.table = data.data.records;
						this.grid.options.total = data.data.total;
					}else{
						this.grid.table =[];
						this.grid.options.total =0;
					}
				}).catch(error=>{
              this.grid.loading = false;
            })	
			},
			load(){
				this.findMenuList()
			},
			//删除单条数据
			remove(scope){
				this.confirmPrompt().then(() => {
					this.$store.dispatch('deleteActionById', scope.row.id).then(data => {
						if (!data.flag && !!data.errorCode){
								// this.$notify.error({message: this.$t("error."+data.errorCode)});
								this.$message.error({ message: this.$t("error."+data.errorCode) });
									}else{
									this.load();
									// this.$notify.success(this.$t('action.removeSuccess'));
									 this.$message.success(this.$t('action.addSuccess'));
								
								}
					})
				})
			},
			add(val){
				this.dialog.size = 'dialog-small';
				this.dialog.name = val.name;
				this.dialog.title = val.title;
				this.dialog.flag = true;
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
			this.findMenuList()
		}
	}
</script>

<style lang="scss">
	label{
		font-size: 12px !important;
	};
	.add{
    float:right;
    margin:10px;
}
</style>