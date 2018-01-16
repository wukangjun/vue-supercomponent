<template>
<div class="">
    <!-- 表格 -->
    <cv-grid class="" :options="grid.options">
        <el-table border stripe :data="grid.table" v-loading="grid.loading" @selection-change="schange" :height="300">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column :label="$t('协议')" prop="protocolName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('平台')" prop="superiorPlatform" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
       </cv-grid>
       <el-col :span="24" class="dialog-footer" style="margin:10px 0;">
			<el-button type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</el-col>
   </div>
</template>
<script>
export default {
    props:{
        options:{}
    },
    components: {},
    mixins: [""],
    data() {
        return {
            selectRows:[],
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
            };
            this.grid.loading = true;
            this.$http({
                url:this.$COMMON.baseUrl+'/transfer/findProtocolTransferGroupPageInfo',
                params:params
            }).then(data => {
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
        confirm(){
            let superiorPlatformIds = [],
                superiorPlatformNames = [];
            this.selectRows.forEach(element => {
                superiorPlatformIds.push(element.id);
                superiorPlatformNames.push(element.superiorPlatform);
            });
            if(superiorPlatformIds.length == 0){
                this.$message.warning({message:this.$t('至少选择一条数据')});
                return false;
            }else{
                this.options.flag = false;
                this.options.superiorPlatformIds = superiorPlatformIds.join(',')
                this.options.superiorPlatformNames = superiorPlatformNames.join(',')
            }
        },
        schange(val){
            this.selectRows = val;
        }
    },
    mounted(){
        this.listLoad()
    },
    watch:{
        'options.flag'(newVal){
            if(!newVal){
                this.options.name = '';
            }
        }
    }
};
</script>
<style lang="scss">

</style>
