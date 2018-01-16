<template>
    <div class="cv-terminal-success">
        <cv-header>
            <el-form-item label="终端编号:">
                <el-input placeholder="终端编号" v-model.trim="searchOptions.terminalCode" size="small">
                </el-input>
            </el-form-item>
            <el-form-item label="车牌号:">
                <el-input  placeholder="车牌号" v-model.trim="searchOptions.plateCode"  size="small"></el-input>
            </el-form-item>
            <el-form-item label="运单内容:">
                <el-input  placeholder="运单内容" v-model.trim="searchOptions.ewaybillContent"   size="small"></el-input>
            </el-form-item>
            <el-form-item style='float:right'>
                <cv-tool  style='margin:0px;' :name="$route.name"  :data="$store.getters.monitorMenu"  :is-modify="false" 
                :is-remove="false"   :is-add='false'  :is-export='false' @search="loadGrid"></cv-tool>
            </el-form-item>
        </cv-header>
        <cv-content :fill="true">
            <cv-grid :options="gridOptions.options" @load="loadGrid(false)">
                <el-table :data="gridOptions.table" border stripe v-loading="gridOptions.loading">
                    <el-table-column :label="$t('cE.carNumber')" min-width="100" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column :label="$t('cE.carColor')" min-width="100" prop="plateColor" :formatter="plateColor"></el-table-column>
                    <el-table-column label="终端编号"  min-width="120" prop="terminalCode" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="创建时间"  min-width="150" prop="createtimeStr" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="是否发送到监管" min-width="150" prop="issendtomon" :show-overflow-tooltip="true" :formatter="issendtomon"></el-table-column>
					<el-table-column label="运单内容" min-width="150" prop="ewaybillContent" :show-overflow-tooltip="true"></el-table-column>
                </el-table>
            </cv-grid>
        </cv-content>
    </div>
</template>

<script>
import port from './index.js'
export default {
    mixins: [port],
    data(){
        return {
            // 搜索参数配置1
            searchOptions: {
                // 车牌号
                plateCode: '',
                terminalCode:'',
                ewaybillContent:''
            },
            // 表格参数配置
            gridOptions: {
                // 表格互动参数
                options: {
                    size: 10,
                    total: 0,
                    current: 1,
                    flag: false
                },
                table:[],
                loading: false
            }
        }
    },
    methods: {
        /**
         * @augments: flag判断搜索查询还是分页查询
         * @function 加载表格方法
         */
        loadGrid(flag){
            if (flag) {
                this.gridOptions.options.flag = true;
                this.gridOptions.options.current = 1;
            } else {
                this.gridOptions.options.flag = false;
            }
            let _params=this.getData();
            _params.current=this.gridOptions.options.current;
            _params.size=this.gridOptions.options.size;
            this.gridOptions.loading=true;
            this.queryData(_params).then(data => {
                if(data.flag){
                    this.gridOptions.table=data.data.records;
                    this.gridOptions.options.total = data.data.total;
                }else{
                    this.gridOptions.table =[];
                    this.gridOptions.options.total =0;
                }
                this.gridOptions.loading=false;
            }).catch(_ => {
                this.$message.error('网络异常')
                this.gridOptions.loading=false;
            })
        },
        getData(){
			let item={};
			item=this.searchOptions;
			return item;
        },
        issendtomon(row){
           return row.issendtomon == 0 ?"否" :"是";
        },
        plateColor(row){
            return this.$filter.plateCodeColor(row.plateColor);
        }
    },
    mounted(){
        this.loadGrid();
    }
}
</script>



