<template>
    <div>
        <cv-header>
            <el-form-item label="查询问题:">
                <el-input v-model="searchOptions.askInfo" size="small"></el-input>
            </el-form-item>
            <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false"   :is-export ="false"
                @add='addQuestion' @search="load" style='margin:0px;'></cv-tool>
        </cv-header>
        <cv-content >
            <cv-grid :options="gridOptions.options" @load="load(false)">
                <el-table :data="gridOptions.table" border stripe v-loading="loading">
                    <el-table-column label="显示方式"  min-width="120" prop="sendFlag" :show-overflow-tooltip="true" :formatter="showSendFlag"></el-table-column>
                    <el-table-column label="问题"  min-width="150" prop="askinfo" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="选项答案" min-width="150" prop="" :show-overflow-tooltip="true" :formatter="showAnswer"></el-table-column>
                    <el-table-column label="回答答案" min-width="150" prop="" :show-overflow-tooltip="true" :formatter="showAnswerC"></el-table-column>
					<el-table-column label="发送时间" min-width="150" prop="sendTime" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="反馈时间" min-width="150" prop="backTime" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="反馈状态" min-width="150" prop="sendFlag" :show-overflow-tooltip="true" :formatter="sendFlag"></el-table-column>
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
import add from '@/components/instruction/model/askQuestion/add'
import port from './index.js'
export default {
    components: {add},
    mixins: [port],
    data(){
        return {
            // 搜索参数配置
            searchOptions: {
                askInfo: '',
                vehicleId:''

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
            },
            dialog: {
                title: '--',
                flag: false,
                name: 'add',
                carId:"",
                size: 'dialog-full',
            }
        }
    },
    methods: {
        load(flg){
            if(!this.searchOptions.vehicleId){
                this.$message.warning('请先选择车辆');
                return false;
            }
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
        showAnswer(row){
            let html=""
            row.vehicleAskDetails.forEach(el => {
                html+=el.answerInfo+","
            });
            html=html.substring(0,html.length-1);
            return html;
        },
        showAnswerC(row){
            let html=""
            row.vehicleAskDetails.forEach(el => {
                el.answered == 1 && (html+=el.answerInfo+",")
            });
            html=html.substring(0,html.length-1);
            return html;
        },
        addQuestion(val){
            if(this.searchOptions.vehicleId){
                this.dialog.flag = true;
                this.dialog.size = 'dialog-small';
                this.dialog.name = val.name;
                this.dialog.title = val.title;
            }else{
                this.$message.warning('请先选择车辆');
            }
            
        },
        sendFlag(row){
            let html="";
            if(row.sendFlag==1){
                html="下发成功";
            }else{
                html='下发失败';
            }
            return html;
        },
        showSendFlag(row){
            let text="";
            switch(row.flag){
                case 1:
                    text= "紧急";
                    break
                case 8:
                    text= "终端TTS播读";
                    break
                case 9:
                    text= "紧急+终端TTS播读"
                    break
                case 17:
                    text= "紧急+广告屏显示"
                    break
                case 24:
                    text= "终端TTS播读+广告屏显示"
                    break
                case 25:
                    text= "全部"
                    break
                case 16:
                    text= "广告屏显示"
                    break
            }
            return text;
        }
    },
    watch: {
        '$store.getters.ptSingleCar'(newVal){
            this.dialog.carId=newVal;
            this.searchOptions.vehicleId =newVal.id;
            this.load(true);
		},
    }
}
</script>