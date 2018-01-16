<template>
   <div class="changeList">
        <el-row>
            <el-form :inline="true" :model="search">
                <el-form-item :label="$t('terminal.code')">
                    <el-input size='small' v-model.trim="search.code"></el-input>
                </el-form-item>
                <el-form-item :label="$t('terminal.terminalType2')">
                    <el-input size='small' v-model.trim="search.manufacturerModel"></el-input>
                </el-form-item>
                <el-form-item :label="$t('terminalProM.terminalCode1')">
                    <el-input size='small' v-model.trim="search.manufacturerNumber"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="queryList">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <cv-grid :options='grid.options' @load='queryList(false)'>
                <el-table border stripe :data='grid.table' v-loading="grid.loading" highlight-current-row  @current-change="selectIndex">
                    <el-table-column :label="$t('terminal.code1')" prop='code'></el-table-column>
                    <el-table-column :label="$t('terminal.terminalType')" prop='manufacturerModel'></el-table-column>
                    <el-table-column :label="$t('terminalProM.terminalCode')" prop='manufacturerNumber'></el-table-column>
                </el-table>
            </cv-grid>
        </el-row>
        <el-row>
            <div class='dialog-footer'>
                <el-button type="primary" :loading='submitFalg'  @click="confirm">{{ $t('action.confirm') }}</el-button>
                <el-button @click='options.flag=false'>{{ $t('action.cancel') }}</el-button>
            </div>
        </el-row>
   </div>
</template>
<script>
import {COMMON} from '@/utils'
	export default{
		props: {
			options: {}
		},
		data(){
			return {
                submitFalg:false,
                terminalId:"",
                grid: {
					options: {
						current: 1,
						size: 10,
                        total: 0  ,
                        flag:false
					},
					table: [],
					loading: false
				},
                search:{
                    enterpriseId:this.options.entId,
                    code:"",                
                    manufacturerModel:"",
                    manufacturerNumber:""
                }
			}
		},
        methods: {
            queryList(flag){//查询设备列表
                if(flag){
					this.grid.options.flag = true;
					this.grid.options.current = 1;
				}else{
					this.grid.options.flag = false;
				}
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					enterpriseId: this.search.enterpriseId,
					code: this.search.code,
					manufacturerModel: this.search.manufacturerModel,
                    manufacturerNumber:this.search.manufacturerNumber
				};
				this.grid.loading = true;
                this.$store.dispatch('findTerminalPage',params).then(data => {
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
            selectIndex(item){
                this.terminalId=item.id;
            },
            confirm(){
                if(this.terminalId != ""){
                    this.submitFalg=true;
                    this.$store.dispatch('replaceTerminal',{"vehicleId":this.options.id,"terminalId":this.terminalId}).then(data => {
                        if(data.flag){
                            this.$emit('confirm');
                            this.options.flag=false;
                            this.$message.success(this.$t('action.updateSuccess') )
                        }else{
                            this.$message.error(this.$t('action.updateError') )
                        }
                        this.submitFalg=false;
                    });
                }else{
                    this.$message.error(this.$t('cE.selectEqu') )
                }
            }
        },
        mounted(){
			this.queryList()
		},
        //监听事件
        watch: {
            "options.flag"(newVal){
                if(!newVal){
                    console.log(this.options)
                    this.options.name = "";
                }
            }
        }
	}
</script>

<style scoped lang="scss">

    .changeList  {
        .dialog-footer{
            margin-top: 20px;
        }
        .el-input{
            width: 170px;
        }
    }
 
</style>

