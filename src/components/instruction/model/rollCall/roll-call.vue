<template>
    <div>
        <span>请问您是否要对所选车辆进行点名?</span>
        <div class="dialog-footer">
            <el-button type="primary"  @click="confirm" :loading="loading">确认</el-button>
            <el-button @click='options.flag=false'>取消</el-button>
        </div>
    </div>
</template>

<script>
import { publicApi, instructCallback } from "../../src/instruction.public.api";
export default {
  props: {
    options: {}
  },
  data() {
    return {
      loading:false
    }
  },
  methods: {
    confirm() {
        let params = {
            vehicleId: this.options.id
        };
        this.loading = true;
        publicApi({
            url: "/sendOrder/queryVehicleLocationCmd",
            params: params
        }).then(data => {
            instructCallback(data, this.options);
            this.loading = false;
            this.options.flag=false;
        });
    }
  }
};
</script>
<style lang="scss">

</style>
