<template>
  <el-table
      :data="commandData" height="250"
      style="width: 100%">
      <el-table-column
        prop="plateCode"
        width="110"
        :label="$t('common.vehicle.plateCode')">
      </el-table-column>
      <el-table-column
        prop="orderType"
        :show-overflow-tooltip="true"
        :label="$t('common.order.type')"
        width="150"
        :formatter="orderTypeFormatter">
      </el-table-column>
      <el-table-column
        prop="sendDate"
        min-width="100"
        :label="$t('common.order.sendDate')">
      </el-table-column>
      <el-table-column
        prop="sendFlag"
        min-width="100"
       :label="$t('common.order.orderContent')"
        :formatter="contentFormatter">
      </el-table-column>
    </el-table>
</template>
<script>
export default {
  data() {
    return {
      commandData: []
      //{"id":5029400866843566,"msgType":"W","orderType":"WCF0x8606","plateCode":"势A06521","ruleName":"折线测试123","sendDate":"2017-08-17 11:21:27","sendFlag":1}
    };
  },
  methods: {
    getSatus(sendFlag) {
      switch (sendFlag) {
        case 0:
          return this.$t("common.order.status.0");
        case 1:
          return this.$t("common.order.status.1");
        case 2:
          return this.$t("common.order.status.2");
        case 3:
          return this.$t("common.order.status.3");
        case 4:
          return this.$t("common.order.status.4");
        case 5:
          return this.$t("common.order.status.5");
        case 6:
          return this.$t("common.order.status.6");
        case 7:
          return this.$t("common.order.status.7");
        default:
          return "";
      }
    },
    getOrderType(orderType) {
      switch (orderType) {
        case "WCF0x8600":
          return this.$t("common.order.orderType.WCF0x8600");
        case "WCF0x8602":
          return this.$t("common.order.orderType.WCF0x8602");
        case "WCF0x8604":
          return this.$t("common.order.orderType.WCF0x8604");
        case "WCF0x8606":
          return this.$t("common.order.orderType.WCF0x8606");
        case "WCF0x8601":
          return this.$t("common.order.orderType.WCF0x8601");
        case "WCF0x8801":
          return this.$t("common.order.orderType.WCF0x8801");
        case "WCF0x8300":
          return this.$t("common.order.orderType.WCF0x8300");
        case "WCF0x8804":
          return this.$t("common.order.orderType.WCF0x8804");
        case "WCF0x8201":
          return this.$t("common.order.orderType.WCF0x8201");
        case "WCF0x8400":
          return this.$t("common.order.orderType.WCF0x8400");
        case "WCF0x8104":
          return this.$t("common.order.orderType.WCF0x8104");
        case "WCF0x8103":
          return this.$t("common.order.orderType.WCF0x8103");
        case "WCF0x8001":
          return this.$t("common.order.orderType.WCF0x8001");
        case "WCF0x86FF":
          return this.$t("common.order.orderType.WCF0x86FF");
        case "WCF0x8203":
          return this.$t("common.order.orderType.WCF0x8203 ");
        case "WCF0x8F800x19":
          return this.$t("common.order.orderType.WCF0x8F800x19");
        case "WCF0x87000x0808":
          return this.$t("common.order.orderType.WCF0x87000x0808");
        case "WCF0x87000x0809":
          return this.$t("common.order.orderType.WCF0x87000x0809");
        case "WCF0x87000x0816":
          return this.$t("common.order.orderType.WCF0x87000x0816");
        case "WCF0x87000x0817":
          return this.$t("common.order.orderType.WCF0x87000x0817");
        case "WCF0x87000x0818":
          return this.$t("common.order.orderType.WCF0x87000x0818");
        case "WCF0x87000x0819":
          return this.$t("common.order.orderType.WCF0x87000x0819");
        case "WCF0x87000x0820":
          return this.$t("common.order.orderType.WCF0x87000x0820");
        case "WCF0x87000x0821":
          return this.$t("common.order.orderType.WCF0x87000x0821");
        case "WCF0x87000x0800":
          return this.$t("common.order.orderType.WCF0x87000x0800");
        case "WCF0x87000x0801":
          return this.$t("common.order.orderType.WCF0x87000x0801");
        case "WCF0x87000x0802":
          return this.$t("common.order.orderType.WCF0x87000x0802");
        case "WCF0x87000x0803":
          return this.$t("common.order.orderType.WCF0x87000x0803");
        case "WCF0x87000x0804":
          return this.$t("common.order.orderType.WCF0x87000x0804");
        case "WCF0x87000x0805":
          return this.$t("common.order.orderType.WCF0x87000x0805");
        case "WCF0x87000x0806":
          return this.$t("common.order.orderType.WCF0x87000x0806");
        case "WCF0x87000x0807":
          return this.$t("common.order.orderType.WCF0x87000x0807");
        case "WCF0x8803":
          return this.$t("common.order.orderType.WCF0x8803");
        case "WCF0x880101":
          return this.$t("common.order.orderType.WCF0x880101");
        case "WCF0x87000x0820":
          return this.$t("common.order.orderType.WCF0x87000x0820");
        case "WCF0x87000x0821":
          return this.$t("common.order.orderType.WCF0x87000x0821");
        case "WCF0x87000x0819":
          return this.$t("common.order.orderType.WCF0x87000x0819");
        case "WCF0x87000x0820":
          return this.$t("common.order.orderType.WCF0x87000x0820");
        case "WCF0x87000x0821":
          return this.$t("common.order.orderType.WCF0x87000x0821");
        case "WCF0x87000x0819":
          return this.$t("common.order.orderType.WCF0x87000x0819");
        case "WCF0x87000x0820":
          return this.$t("common.order.orderType.WCF0x87000x0820");
        case "WCF0x87000x0821":
          return this.$t("common.order.orderType.WCF0x87000x0821");
        //位置信息查询
        case "WCF0x8201":
          return this.$t("common.order.orderType.WCF0x8201");
        //临时位置跟踪控制
        case "WCF0x8202":
          return this.$t("common.order.orderType.WCF0x8202");
        //电话本设置地址
        case "WCF0x8401":
          return this.$t("common.order.orderType.WCF0x8401");
        //事件设置
        case "WCF0x8301":
          return this.$t("common.order.orderType.WCF0x8301");
        //提问下发
        case "WCF0x8302":
          return this.$t("common.order.orderType.WCF0x8302");
        //数据透传下发
        case "WCF0x8900":
          return this.$t("common.order.orderType.WCF0x8900");
        //单条存储多媒体数据检索上传命令
        case "WCF0x8805":
          return this.$t("common.order.orderType.WCF0x8805");
        //信息点播菜单设置
        case "WCF0x8303":
          return this.$t("common.order.orderType.WCF0x8303");
        case "WCF0x8302":
          return this.$t("common.order.orderType.WCF0x8302");
        //采集记录仪执行标准版本
        case "WCF0x87000x0000":
          return this.$t("common.order.orderType.WCF0x87000x0000");
        //采集当前驾驶人信息
        case "WCF0x87000x0001":
          return this.$t("common.order.orderType.WCF0x87000x0001");
        //采集记录仪实时时间
        case "WCF0x87000x0002":
          return this.$t("common.order.orderType.WCF0x87000x0002");
        //采集累计行驶里程
        case "WCF0x87000x0003":
          return this.$t("common.order.orderType.WCF0x87000x0003");
        //采集记录仪脉冲系数
        case "WCF0x87000x0004":
          return this.$t("common.order.orderType.WCF0x87000x0004");
         //采集车辆信息
        case "WCF0x87000x0005":
          return this.$t("common.order.orderType.WCF0x87000x0005");
         //采集记录仪状态信号配置信息
        case "WCF0x87000x0006":
          return this.$t("common.order.orderType.WCF0x87000x0006");
         //采集记录仪唯一性编号
        case "WCF0x87000x0007":
          return this.$t("common.order.orderType.WCF0x87000x0007");
         //采集指定的行驶速度记录
        case "WCF0x87000x0808":
          return this.$t("common.order.orderType.WCF0x87000x0808");
         //采集指定的位置信息记录
        case "WCF0x87000x0809":
          return this.$t("common.order.orderType.WCF0x87000x0809");
         //采集指定的事故疑点记录
        case "WCF0x87000x0816":
          return this.$t("common.order.orderType.WCF0x87000x0816");
         //采集指定的超时驾驶记录
        case "WCF0x87000x0817":
          return this.$t("common.order.orderType.WCF0x87000x0817");
          //采集指定的驾驶人身份记录
        case "WCF0x87000x0818":
          return this.$t("common.order.orderType.WCF0x87000x0818");
        //采集指定的外部供电记录
        case "WCF0x87000x0819":
          return this.$t("common.order.orderType.WCF0x87000x0819");
        //采集指定的参数修改记录
        case "WCF0x87000x0820":
          return this.$t("common.order.orderType.WCF0x87000x0820");
        //采集指定的速度状态日志
        case "WCF0x87000x0821":
          return this.$t("common.order.orderType.WCF0x87000x0821");
        //03版指令当前驾驶人
        case "WCF20030x87000x0101":
          return this.$t("common.order.orderType.WCF20030x87000x0101");
        //采集记录仪的实时时钟
        case "WCF20030x87000x0102":
          return this.$t("common.order.orderType.WCF20030x87000x0102");
        //车辆设置信息
         case "WCF0x87000x82":
          return this.$t("common.order.orderType.WCF0x87000x82");
        //GB2012设置记录仪初次安装日期
          case "WCF0x87000x830":
          return this.$t("common.order.orderType.WCF0x87000x830");
          //设置状态量配置信息
          case "WCF0x87000x84":
          return this.$t("common.order.orderType.WCF0x87000x84");
          //设置记录仪时间
          case "WCF0x87000x831":
          return this.$t("common.order.orderType. WCF0x87000x831 ");
          //设置记录仪脉冲系数
          case "WCF0x87000xC3":
          return this.$t("common.order.orderType.WCF0x87000xC3");
            //设置初始里程
          case "WCF0x87000xC4":
          return this.$t("common.order.orderType.WCF0x87000xC4");
          //车辆控制
          case "WCF0x8500":
          return this.$t("common.order.orderType.WCF0x8500");
          //多媒体检索
          case "WCF0x8802":
          return this.$t("common.order.orderType.WCF0x8802");
          //多媒体上传 
          case "WCF0x8803":
          return this.$t("common.order.orderType.WCF0x8803");
          //查询终端属性 
          case "WCF0x8107":
          return this.$t("common.order.orderType.WCF0x8107");
          //上报驾驶员身份信息请求
          case "WCF0x8702":
          return this.$t("common.order.orderType.WCF0x8702");
          case "WCF0x81051":
          return this.$t("common.order.orderType.WCF0x81051");
          case "WCF0x8108":
          return this.$t("common.order.orderType.WCF0x8108");
          case "WCF0x81052":
          return this.$t("common.order.orderType.WCF0x81052");
          case "WCF0x81053":
          return this.$t("common.order.orderType.WCF0x81053");
          case "WCF0x81054":
          return this.$t("common.order.orderType.WCF0x81054");
          case "WCF0x81055":
          return this.$t("common.order.orderType.WCF0x81055");
          case "WCF0x81056":
          return this.$t("common.order.orderType.WCF0x81056");
          case "WCF0x81057":
          return this.$t("common.order.orderType.WCF0x81057");
        default:
          return "";
      }
    },
    orderTypeFormatter(row, column) {
      return this.getOrderType(row.orderType);
    },
    contentFormatter(row, column) {
      // return this.getOrderType(row.orderType)+"："+this.getSatus(row.sendFlag);
      return this.getSatus(row.sendFlag);
    }
  },
  mounted() {
    this.commandData = this.$store.getters.sendDirective;
  }
};
</script>
<style lang="sass" scoped>

</style>