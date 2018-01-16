<template>
    <div class='content'>
        <el-row>
          <span>请问您是否要对所选车辆进行该指令下发?</span>
        </el-row>
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
            vehicleId:this.options.id,
            enterpriseId: this.options.enterpriseId,
            cmdType:this.options.type,
        };
        this.loading = true;
        publicApi({
            url: this.options.url,
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
