export default {
    data(){
        return {
            table: {
                size:10,
                total:0,
                current: 1,
                flag:false,
                loading:false,
                data: []
            }
        }
    },
    methods: {
        // 表格统一加载
        tableLoading(url, obj, flag){
            // 重新加载重置
            if(flag){
                this.table.flag = true;
                this.table.current = 1;
            }else{
                this.table.flag = false;
            }
            this.table.loading = true;
            const params = {
                current: this.table.current,
                size: this.table.size,
                ...obj
            };
            
            this.$http({url: this.$COMMON.baseUrl + url, params}).then(mess => {
                const {data, flag} = mess;
                if(flag && data.length != 0){
                    this.table.data = data.records;
                    this.table.total = data.total;
                    this.table.current = data.current;
                }else{
                    this.table.data = [];
                    this.table.total = 0;
                }
                this.table.loading = false;
            }).catch(err => {
                this.table.loading = false;
            })
        },
        // 表格过滤颜色
        tableFilterColor(row){
            return this.$filter.plateCodeColor(row.plateColor);
        },
        // 表格ic状态过滤
        tableFilterIcType(row){
            return this.$filter.icType(row.state);
        },
        // 表格ic结果过滤
        tableFilterIcResult(row){
            return this.$filter.icResult(row.readerresult);
        },
        // 疲劳驾驶报警类型过滤
        tableFilterTiredAlarm(row){
            return this.$filter.tiredAlarmType(row.alarm);
        }
    }
}