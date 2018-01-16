<template>
	<div class="vehicleList">
        <cv-grid :options="grid.options" @load="load(false)">
			<el-table border stripe :data="grid.table" v-loading="grid.loading" >
				<el-table-column label="车牌号" prop="plateCode" width='150':show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="车辆颜色" prop="plateColor" :show-overflow-tooltip="true" :formatter="plateCodeAndColor"></el-table-column>
				<el-table-column label="联系人电话" prop="contactTel"></el-table-column>
			</el-table>
		</cv-grid>	
        <div class='dialog-footer' style='margin-top:20px'>
			<el-button @click='options.flag=false'>{{ $t('action.cancel') }}</el-button>
		</div>
	</div>
</template>
<script>
    import port from './index.js'
	export default{
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
                id:''
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
				this.findVehicleInfo({id:this.id,size:this.grid.options.size,current:this.grid.options.current}).then(data => {
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
			plateCodeAndColor(row){
				return row.plateCode+"("+this.$filter.plateCodeColor(row.plateColor)+")";
			},
        },
        watch: {
			"options.flag"(newVal){
				if(!newVal){
					this.options.name = "";
				}
			}
		},
		mounted(){
            this.id=this.options.id;
			this.load();
		}
	}
</script>

