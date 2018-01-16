<template>
	<div class="vehicleMaster">
        <el-row>
            <cv-grid :options="grid.options" @load="load(false)">
                <el-table border stripe :data="grid.table" v-loading="grid.loading" @selection-change="handleSelectionChange" >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="协议名称" prop="protocolName" min-width='150' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="平台名称" prop="platName" min-width='150'  :show-overflow-tooltip="true"></el-table-column>
                </el-table>
            </cv-grid>	
        </el-row>
        <el-row style="margin-top:20px;">
            <div class='dialog-footer'>
                <el-button type="primary" :loading='submitFalg'  @click="save">{{ $t('action.confirm') }}</el-button>
                <el-button @click='options.flag=false'>{{ $t('action.cancel') }}</el-button>
            </div>
        </el-row>
        
	</div>
</template>
<script>
    import port from './index.js'
	export default{
		components: {},
        mixins: [port],
        props: {
			options: {}
		},
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
                selectArray:[],
                submitFalg:false
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
				this.queryOtherProtocolGroup({id:this.options.vehicleId,current:this.grid.options.current,size:this.grid.options.size}).then(data => {
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
            save(){
                if(this.selectArray.length > 0){
                    this.submitFalg=true;
                    this.addAttachPlat({ids:this.selectArray.join(','),id:this.options.vehicleId}).then(data=>{
                        if (data.flag){
							this.$message.success(this.$t('action.addSuccess'));
                            this.$emit('confirm');
                            this.options.flag=false;
						}else{
							this.$message.error(this.$t('error.'+data.errorCode));
                        }
                        this.submitFalg=false;
                    }).catch(_=>{
                         this.submitFalg=false;
                    })
                }else{
					this.$message.warning("请选择上级平台");
				}
                
            },
            handleSelectionChange(rows){
                this.selectArray=[];
                rows.forEach(el => {
                    this.selectArray.push(el.id);
                });
            }
        },
        //监听事件
		watch: {
			"options.flag" (newVal) {
				if (!newVal) {
					this.options.name = "";
				}
            }
        },
		mounted(){
			this.load();
		}
	}
</script>
<style lang='scss'>
.vehicleMaster{
	.cv-public-tree{
		top:60px;
	}
}
</style>


