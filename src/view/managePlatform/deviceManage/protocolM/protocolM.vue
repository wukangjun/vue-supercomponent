<template>
	<div class="port">
		<cv-tool
		:name="$route.name"
        :data="$store.getters.manageMenus"
		:is-modify="false"
		:is-remove="false"
		:is-search="false"
		@add="add"
		></cv-tool>
			<el-table 
			border stripe 
			:data="table" 
			v-loading="loading" 
			:is-pagination='false'
			ref="table">
			<el-table-column :label="$t('companyManage.n')" prop="name"></el-table-column>
			<el-table-column :label="$t('dM.shortName')" prop="alias"></el-table-column>
			<el-table-column :label="$t('dM.remark')" prop="remark" ></el-table-column>
			<el-table-column :label="$t('dM.protocol')" prop="protocolVersion" ></el-table-column>
				<el-table-column :label="$t('UserManage.operation')">
					<template scope="scope">
						<cv-span class="cv-span-success" @click.native="modify(scope)">{{$t('power.modify')}}</cv-span>
						<cv-span class="cv-span-danger"  @click.native="remove(scope)">{{$t('power.remove')}}</cv-span>
                        <cv-span class="cv-span-warning"  @click.native="bing(scope)">{{$t('power.bing')}}</cv-span></cv-span>
					</template>
				</el-table-column>
			</el-table>
	
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="load"></component>
		</el-dialog>
	</div>
</template>

<script>
	import add from './add.vue'
    import modify from './modify.vue'
    import bing from './bing.vue'
	import port from './index.js'
	import common from '@/utils/mixins/common'
	import {COMMON} from '@/utils'
	export default{
		components: {
			add,
            modify,
            bing
		
		},
		mixins: [port,common],
		data(){
			return{
					table: [],
					loading: false,
				dialog: {
					flag: false,
					title: '--',
					size: 'dialog-small',
					name: 'search',
					id:"",//ID，用来区分新增和修改，以及修改传参
					modify:{
						name:'',
						alias:'',
						remark:'',
						protocolVersion:'',
						id:''
             },
          bing:{
						id:'',
					}
				
				}
			}
		},
		methods: {
			powerList(){
				let params = {}
				this.loading = true;
				this.findTerminalProtocolList(params).then(data => {	
					this.loading = false;
					if(data.flag){		
					let arr=[];
					for(var i=0;i<data.data.length;i++){
						arr.push(data.data[i])
					}
					this.table = arr;
					}else{
						return false
					}
					
				}).catch(()=>{
					this.loading=false
				});
			},
			load() {
				this.powerList()
			},
			//打开添加弹框
			addEvent(val){//打开新增弹框，val:{name:"",title:""}
				this.dialog.size = 'dialog-middle';
				this.dialog.id="";
				this.dialog.flag = true;
				this.dialog.name = val.name;
				this.dialog.title = val.title;	
			},
	
			remove(scope){
				this.confirmPrompt().then(() => {
					this. deleteTerminalProtocolById({"id":scope.row.id}).then(data => {
						if (!data.flag && !!data.errorCode){
							this.$message.error({message: this.$t("error."+data.errorCode)});	
						}else{
							this.load();
							this.$message.success(this.$t('action.removeSuccess'));
						
						
						}
					});
				});
			},
			//打开修改弹框
			modify(scope){
				this.dialog.size = 'dialog-small';
				this.dialog.flag = true;
				this.dialog.name = 'modify';
				this.dialog.title =this.$t('power.modify') ;
				this.dialog.modify=scope.row;
			},
			add(){
				this.dialog.size = 'dialog-small';
				this.dialog.flag = true;
				this.dialog.name = 'add';
				this.dialog.title =this.$t('power.add') ;
	
            },
            bing(scope){
                this.dialog.size = 'dialog-small';
				this.dialog.flag = true;
				this.dialog.name = 'bing';
                this.dialog.title =this.$t('power.bing') ;
                this.dialog.bing=scope.row;
            }
		},
		mounted(){
			this.powerList()
			
		}
	}
</script>
<style lang="scss">
</style>