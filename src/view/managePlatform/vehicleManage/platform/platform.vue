<template>
	<div class="vehicleMaster">
		<cv-tool :name="$route.name" :data="$store.getters.manageMenus" :is-remove="false" :is-export="false" :is-modify="false" @add="add" :is-search="false"></cv-tool>
		<public-tree ref="publicTree"></public-tree>
		<cv-content ref='content'>
			<cv-grid :options="grid.options" @load="load(false)">
				<el-table border stripe :data="grid.table" v-loading="grid.loading" >
					<el-table-column label="协议名称" prop="protocolName" min-width='150' :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="平台名称" prop="platName" min-width='150'  :show-overflow-tooltip="true"></el-table-column>
					<el-table-column :label="$t('action.operation')" width='250'>
						<template scope="scope">
							<cv-table-tool 
							:name="$route.name"
							:data="$store.getters.manageMenus"
							:is-modify='false'
							@remove="remove(scope)"></cv-table-tool>
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
	import publicTree from '@/components/public-tree/public.tree.vue'  
	import cvContent from '@/components/cv-content/cv.content.vue'  
    import add from './add.vue'
    import port from './index.js'
    import common from '@/utils/mixins/common'
	import { COMMON } from '@/utils'
	export default{
		components: {
			publicTree,
			cvContent,
            add
		},
		mixins: [port,common],
		data(){
			return{
				grid: {
					options: {
						current: 1,
						size: 10,
						total: 0,
						flag:false
					},
					table: [],
					loading: false
				},
				dialog: {
					vehicleId:'',
					title: '--',
					flag: false,
					name: 'add',
					size: 'dialog-full',
				}
			}
		},
		methods: {
            load(flg){
                if(flg){
					this.grid.options.flag = true;
					this.grid.options.current = 1;
				}else{
					this.grid.options.flag = false;
				}
				this.grid.loading = true;
				this.queryList({id:this.dialog.vehicleId,current:this.grid.options.current,size:this.grid.options.size}).then(data => {
					if(data.flag){
						if(data.data.length!=0){
                            this.grid.table = data.data.records;
							this.grid.options.total = data.data.total;
						}else{
							this.grid.table =[];
							this.grid.options.total =0;
						}
					}else{
						this.grid.table =[];
						this.grid.options.total =0;
					}
					this.grid.loading = false;
				}).catch(_=>{
					this.grid.loading = false;
				});
            },
            remove(scope){
                this.confirmPrompt().then(() => {
					this.delitem({ids:scope.row.id}).then(data => {
						if (data.flag){
							this.$message.success(this.$t('action.removeSuccess'));
							this.load();
						}else{
							this.$message.error(this.$t('error.'+data.errorCode));
						}
					});
				});
            },
            add(val){
				if(this.dialog.vehicleId){
					this.dialog.flag = true;
					this.dialog.size = 'dialog-small';
					this.dialog.name = val.name;
					this.dialog.title = val.title;
				}else{
					this.$message.warning("请选择车辆");
				}
            },
		},
		watch:{
			'$store.getters.ptSingleCar'(newVal) {
				this.dialog.vehicleId=newVal.id;
				this.load();
			},
			'$store.getters.isToggleTree'(newVal){
				let tree=this.$refs['publicTree'].$el;
				let content=this.$refs['content'].$el;
				newVal ? (this.$myJq.css(tree,"margin",'15px 0px 0px -2px'),this.$myJq.css(content,"margin",'15px 5px 0px 0px')): (this.$myJq.css(tree,"margin",'15px 0px 0px 15px'),this.$myJq.css(content,"margin",'15px 5px 0px 15px'));
			}
		}
	}
</script>
<style lang='scss'>
.vehicleMaster{
	.cv-public-tree{
		top:60px;
		margin: 15px 0px 0px 15px;
    	border-left: 1px solid #d1dbe5;
	}
	.cv-content{
		margin: 15px 5px 0px 15px;
	}
}
</style>


