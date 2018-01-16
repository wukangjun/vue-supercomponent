<template>
	<div class="terminal-params-set">
		<cv-header>
			<el-form-item style="float:right;">
                <el-button size="small"  :disabled="upFlag" @click="update">上传</el-button>
                <el-button size="small"  :disabled="upFlag" @click="set">升级</el-button>
			</el-form-item>
		</cv-header>
		<cv-content >
			<cv-grid :options="grid.options" @load="load(false)">
                <el-table border stripe :data="grid.table" v-loading="grid.loading" ref="table">
                    <el-table-column label='固态版本' prop="appVersion" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label='硬件版本' prop="terminalVersion" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label='升级版本名称' prop="binName" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label='升级方式' prop="upgradeType" :show-overflow-tooltip="true" :formatter="upgradeType"></el-table-column>
                    <el-table-column label='升级时间' prop="upgradeDate" :show-overflow-tooltip="true" ></el-table-column>
                </el-table>
            </cv-grid>
		</cv-content>
        <el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="load(true)"></component>
		</el-dialog>
	</div>
</template>
<script>
import prot from "./index.js";
import updata from './updata.vue'
import setting from '@/components/instruction/model/remoteUpdata/setting'
export default {
  components: {
      updata,
      setting
  },
  mixins: [prot],
    data(){
        return{
            grid:{
                options:{
                    current: 1,
                    size:10,
                    total:0,
                    flag:false
                },
                vehicleId:'',
                table: [],
                loading: false
            },
            upFlag:true,
            dialog: {
                title: '--',
                flag: false,
                vehicleId:'',
                name: 'updata',
                size: 'dialog-full',
                id:"",
            }
        }
    },
    methods:{
        load(flag){
            if(flag){
                this.grid.options.flag = true;
                this.grid.options.current = 1;
            }else{
                this.grid.options.flag = false;
            }
            let params = {
                current: this.grid.options.current,
                size: this.grid.options.size,
                vehicleId:this.vehicleId,
            }
            this.grid.loading = true;
            this.queryList(params).then(data =>{
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
        update(){
            this.dialog.flag = true;
            this.dialog.title = '上传';
            this.dialog.name = 'updata';
            this.dialog.size = 'dialog-large';
        },
        set(){
            this.dialog.flag = true;
            this.dialog.title = '升级';
            this.dialog.name = 'setting';
            this.dialog.size = 'dialog-middle';
        },
        upgradeType(row){
            return row.upgradeType=="1" ? "平台主动" : "终端主动";
        }
    },
    watch: {
        "$store.getters.ptSingleCar"(newVal) {
            this.vehicleId=newVal.id;
            this.dialog.vehicleId=newVal.id;
            this.upFlag=false;
            this.load();
        }
    }
};
</script>
