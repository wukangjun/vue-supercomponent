<template>
    <div>
        <cv-header>
            <el-form-item label="车牌号码:">
                <el-input placeholder="车牌号" v-model="searchOptions.plateCode" size="small"></el-input>
            </el-form-item>
            <el-form-item label='文本内容:'>
                <el-input placeholder="文本内容" v-model="searchOptions.msginfo" size="small"></el-input>
            </el-form-item>
            <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false"   :is-export ="false"
                :is-add='false' @search="load" style='margin:0px;'></cv-tool>
        </cv-header>
        <cv-content :fill="true">
            <cv-grid :options="gridOptions.options" @load="load(false)">
                <el-table :data="gridOptions.table" border stripe v-loading="loading">
                    <el-table-column :label="$t('cE.carNumber')" min-width="100" prop="plateCode" ></el-table-column>
                    <el-table-column :label="$t('cE.carColor')" min-width="100" prop="plateColor" :formatter='plateCodeAndColor'></el-table-column>
                    <el-table-column :label="$t('reportForm.mileageStatic.blenterprise')"  min-width="120" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="发送时间"  min-width="150" prop="sendTime" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="文本内容" min-width="150" prop="msginfo" :show-overflow-tooltip="true"></el-table-column>
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
            // 搜索参数配置
            searchOptions: {
                plateCode: '',
                msginfo: ''
            },
            loading:false,
            // 表格参数配置
            gridOptions: {
                // 表格传入配置
                options: {
                    size: 10,
                    current: 1,
                    total: 0,
                    flag: false
                },
                table: []
            }
        }
    },
    methods: {
        load(flg){
            if (flg) {
                this.gridOptions.options.flag = true;
                this.gridOptions.options.current = 1;
            } else {
                this.gridOptions.options.flag = false;
            }
            let _params=this.searchOptions;
            _params.current=this.gridOptions.options.current;
            _params.size=this.gridOptions.options.size;
            this.loading=true;
            this.queryData(_params).then(data => {
                if(data.flag){
                    this.gridOptions.table=data.data.records;
                    this.gridOptions.options.total = data.data.total;
                }else{
                    this.gridOptions.table =[];
                    this.gridOptions.options.total =0;
                }
                this.loading = false;
            }).catch(_ => {
                this.$message.error('网络异常')
                this.loading = false
            })
        },
        plateCodeAndColor(row){
            return this.$filter.plateCodeColor(row.plateColor);
        },
    },
    mounted () {
        this.load();
    }
}
</script>

