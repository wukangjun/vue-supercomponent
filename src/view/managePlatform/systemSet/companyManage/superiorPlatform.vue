<template>
<div class="">
    <!-- 表格 -->
    <cv-grid class="" :options="grid.options">
        <el-table border stripe :data="grid.table" v-loading="grid.loading" @row-click="rclick" :height="300">
            <el-table-column :label="$t('协议')" prop="protocolName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('平台')" prop="superiorPlatform" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
       </cv-grid>
       <!-- <el-col :span="24" class="dialog-footer" style="margin:10px 0;">
			<el-button type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</el-col> -->
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
        //列表行点击
        rclick(val){
            this.options.flag = false;
            this.options.superiorPlatformId = val.id;
            this.options.superiorPlatform = val.superiorPlatform;
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
