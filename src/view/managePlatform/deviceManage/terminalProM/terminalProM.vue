<template>
	<div class="terminal">
        <!--权限操作工具栏  -->
          <cv-tool
          class="cv-tool"
          :name="$route.name"
          :data="$store.getters.manageMenus"
          :is-remove="false"
          :is-modify="false"
          :is-search="false"
          :is-export="false"
          @add="add"
          ></cv-tool>
          <!-- 表格 -->
          <cv-grid
          :options="grid.options" @load="listShow">
            <el-table border stripe :data="grid.table" v-loading="grid.loading">
                <el-table-column :label="$t('terminalProM.name')" prop="name" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column :label="$t('terminalProM.contactsPerson')" prop="manufacturerContacts" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column :label="$t('terminalProM.phoneNumber')" prop="manufacturerTel" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column :label="$t('terminalProM.remark')" prop="remark" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column :label="$t('action.operation')">
                    <template scope="scope">
						<cv-table-tool 
                        :name="$route.name"
                        :data="$store.getters.manageMenus"                       
						@remove="remove(scope)"
						@modify="modify(scope)"></cv-table-tool>
					</template>
                </el-table-column>
            </el-table>
          </cv-grid>
          <!-- 弹框 -->
          <el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
              <component :is="dialog.name" :options="dialog" @confirm="listShow"></component>
          </el-dialog>
    </div>
</template>
<script>
import common from '@/utils/mixins/common.js'
import addOrEditM from './addOrEditM.vue'
import port from './index.js'
export default {
    components:{
        addOrEditM,
    },
    mixins:[port,common],
    data(){
        return{
            grid:{
                options:{
                    current:1,
                    size:10,
                    total:0
                },
                loading:false,
                table:[]
            },
            dialog:{
                flag: false,
				name: 'addBrand',
				size: 'dialog-small',
                title: '--',
                isModify:false,
                rowInfo:[],
                addOrEdit:{
                    enterpriseId:this.$store.getters.user.id
                },
            }
        }
    },
    methods:{
        //厂商列表
        listShow(){
            let params = {
                current:this.grid.options.current,
                size:this.grid.options.size
            }
            this.grid.loading = true;
            this.findTerminalManufacturerPage(params).then(data=>{
               if(data.flag){
                    if(data.data.length !== 0){
                        this.grid.options.total = data.data.total;
                        this.grid.table = data.data.records;
                    }else{
                        this.grid.options.total = 0;
                        this.grid.table = data.data;
                    }
               }else{
                    this.grid.options.total = 0;
                    this.grid.table = [];
               }
                this.grid.loading = false
            })
        },
        //新增弹框
        add(val){
            this.dialog.title = val.title
            this.dialog.size = "dialog-tiny"
            this.dialog.name = 'addOrEditM'
            this.dialog.flag = true
            this.dialog.isModify = false
        },
        //删除
        remove(scope){
            this.confirmPrompt().then(()=>{
                let params = {
                    id:parseInt(scope.row.id)
                }
                this.grid.loading = true;
                this.deleteTerminalManufacturer(params).then(data=>{
                    if(data.flag){
                        this.$message.success(this.$t('action.removeSuccess'))
                        this.listShow()
                    }else{
                        this.$message.error(this.$t("error." + data.errorCode))
                        this.grid.loading = false;
                    }
                })
            })
        },
        //修改
        modify(scope){
            this.dialog.title = this.$t('power.modify')
            this.dialog.size = "dialog-tiny"
            this.dialog.name = 'addOrEditM'
            this.dialog.flag = true
            this.dialog.isModify = true
            this.dialog.rowInfo = scope.row
            this.dialog.name1 = scope.row.name
        }
    },
    //页面加载完成执行
    mounted(){
        this.listShow();
    }
}
</script>
<style>

</style>
