<template>
  <el-table
      :data="dataList" height="250"
      style="width: 100%"
      :min-width='400'
      :default-sort="{prop:'time',order:'descending'}">
      <el-table-column
        prop="plateCode"
        :label="$t('common.vehicle.plateCode')"
        sortable :show-overflow-tooltip="true" >
      </el-table-column>
      <el-table-column
        prop="alarmTypeName"
       :label="$t('common.alarm.alarmTypeName')"
       sortable :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="time"
        :label="$t('common.alarm.time')"
        sortable :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="messageText"
        :label="$t('common.alarm.messageText')" :show-overflow-tooltip="true">
      </el-table-column>
        <el-table-column :label="$t('action.operation')">
                <template scope="scope">
                    <el-button  type='text' @click="handelEvent(scope)" v-loading="scope.row.idp==1?true:false" v-show="scope.row.action=='1'?true:false">确认</el-button>
                </template>
        </el-table-column>
    </el-table>
</template>
<script>
import { COMMON} from '@/utils'
export default {
   props:{
         dataList:Array,

    },
    data(){
      return{
        beShow:true
      }

    },
  methods:{
    handelEvent(scope,data){
      scope.row.idp=1; 
            let params={
                sim:scope.row.simCode
            }
       this.$http({url:  COMMON.baseUrl + '/sendOrder/alarmNotarize', method: 'POST',params:params}).then((data)=>{
             if (data.flag){
					this.$message.success(this.$t('action.noticeSuccess'));				
			}else{
					this.$message.error(this.$t('action.noticeFail'));
					}			
     scope.row.idp=0;
         })
     
    },
  getAlarms(){
      return this.$store.getters.onlineList;
    }
  },
  mounted(){

  },

}
</script>
<style lang="sass" scoped>

</style>