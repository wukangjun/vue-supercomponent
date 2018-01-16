<template>
<div class="">
    <cv-tool :name="$route.name" :data="$store.getters.manageMenus" @search="search" @add="add" class="cv-tool" :is-export="false" :is-remove="false" :is-modify="false"></cv-tool>
    <!-- 表格 -->
    <cv-grid class="" :options="grid.options">
        <el-table border stripe :data="grid.table" v-loading="grid.loading">
            <el-table-column :label="$t('协议')" prop="protocolName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('平台')" prop="superiorPlatform" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('action.operation')">
                <template scope="scope">
                    <cv-table-tool
                        :name="$route.name" :data="$store.getters.manageMenus"
                        @modify="modify(scope.row)"
                        @remove="remove(scope.row)"
                        ></cv-table-tool>
                    <div class="cv-table-tool">
						<cv-span type='success' @click.native="bindVehicle(scope.row)">车辆绑定</cv-span>
						<!-- <cv-span type='success' @click.native="bind809(scope.row)">809服务绑定</cv-span> -->
					</div>
                </template>
              </el-table-column>
          </el-table>
       </cv-grid>
        <!-- 新增弹框 -->
		<el-dialog :visible.sync="addDialog.flag" :title="addDialog.title" :custom-class="addDialog.size">
			<component :is="addDialog.name" :options="addDialog" @confirm="listLoad(true)"></component>
		</el-dialog>
        <!-- 新增弹框2 -->
		<el-dialog :visible.sync="addDialog.dialog2.flag" :title="addDialog.dialog2.title" :custom-class="addDialog.dialog2.size">
			<component :is="addDialog.dialog2.name" :options="addDialog.dialog2" @confirm="listLoad(true)"></component>
		</el-dialog>
   </div>
</template>
<script>
import common from '@/utils/mixins/common.js'
import prot from "./index.js";
import add from "./add.vue";
import bindVehicle from './bindVehicle.vue';
import bind809 from './bind809.vue';
import search from './search.vue';
export default {
    components: {
        add,
        bindVehicle,
        search,
        bind809
    },
    mixins: [prot, common],
    data() {
        return {
            grid: {
                options: {
                    current: 1,
                    size: 10,
                    total: 0,
                    flag: false
                },
                loading: false,
                table: []
            },
            addDialog: {
                flag: false,
                title: '上级平台管理添加',
                size: 'middle',
                name: 'add',
                isModify: false,
                modifyData: {},
                searchData: {
                    protocolName: '',
                    remark: ''
                },
                bindVehicle:{},
                bind809:{},
                dialog2:{
                    flag:false,
                    title:'--',
                    size:'dialog-middle',
                    name:'bind809',
                    eznId:'',
                    serviceName:''
                }
            }
        };
    },
    methods: {
        //列表加载
        listLoad(flag) {
            if (flag) {
                this.grid.options.flag = true;
                this.grid.options.current = 1;
            } else {
                this.grid.options.flag = false;
            }
            let params = {
                current: this.grid.options.current,
                size: this.grid.options.size,
                protocolName: this.addDialog.searchData.protocolName,
                superiorPlatform: this.addDialog.searchData.remark
            };
            this.findProtocolTransferGroupPageInfo(params).then(data => {
                if (data.flag) {
                    if (data.data.length !== 0) {
                        this.grid.options.total = data.data.total;
                        this.grid.table = data.data.records;
                    } else {
                        this.grid.options.total = 0;
                        this.grid.table = data.data;
                    }
                } else {
                    this.grid.options.total = 0;
                    this.grid.table = [];
                }
                this.grid.loading = false;
            });
        },
        //新增
        add() {
            this.addDialog.isModify = false;
            this.addDialog.flag = true;
            this.addDialog.title = '上级平台管理新增';
            this.addDialog.name = 'add'
        },
        //修改
        modify(val) {
            this.addDialog.isModify = true;
            this.addDialog.flag = true;
            this.addDialog.name = 'add';
            this.addDialog.title = '上级平台管理修改';
            this.addDialog.modifyData = val;
        },
        //删除
        remove(val) {
            let content;
            if(val.relationCount-0>0){
                content = '当前平台已绑定车辆，是否删除'
            }
            this.confirmPrompt(content).then(() => {
                this.grid.loading = true;
                this.deleteProtocolTransferGroupInfo({
                    id: val.id
                }).then(data => {
                    if (data.flag) {
                        this.$message.success(this.$t('action.removeSuccess'))
                        this.listLoad(true);
                    } else {
                        this.$message.error(this.$t('action.removeFail'))
                        this.grid.loading = false
                    }
                }).catch(_ => {
                    this.grid.loading = false;
                })
            })
        },
        //搜索
        search() {
            this.addDialog.flag = true;
            this.addDialog.size = 'dialog-tiny';
            this.addDialog.name = 'search';
        },
        //绑定车辆
        bindVehicle(val) {
            this.addDialog.flag = true;
            this.addDialog.size = 'dialog-large';
            this.addDialog.name = 'bindVehicle';
            this.addDialog.title='车辆绑定';
            this.addDialog.bindVehicle = val;
        },
        //809弹框
        // bind809(val){
        //     this.addDialog.flag = true;
        //     this.addDialog.size = 'dialog-middle';
        //     this.addDialog.name = 'bind809';
        //     this.addDialog.title='809服务绑定';
        //     this.addDialog.bind809 = val;
        // }
    },
    mounted() {
        this.listLoad(true);
    },
    watch: {

    }
};
</script>
<style lang="scss">

</style>
