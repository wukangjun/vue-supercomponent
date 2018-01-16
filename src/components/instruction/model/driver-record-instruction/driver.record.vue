<template>
	<div>
		<public-timer ref="timer"></public-timer>
		<div class="dialog-footer">
			<el-button type="primary" @click="save" :loading="loading">确认</el-button>
			<el-button  @click="options.flag=false">取消</el-button>
		</div>
	</div>
</template>
<script>
import publicTimer from "../public-time-dialog/public.time";
import { getEventInfoPage } from "../../src/instruction.other.api";
import { publicApi, instructCallback } from "../../src/instruction.public.api";
export default {
  components: { publicTimer },
  props: {
    options: {}
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    save() {
		publicApi({
			url: "/grapherOrderSend/sendGrapherOrderTwo",
			params: {
				vehicleId:this.options.id,
				enterpriseId:this.options.enterpriseId,
				type:"08",
				maxDataCount:65535,
				startTime: this.$refs["timer"].getTimer().starttimer,
				endTime: this.$refs["timer"].getTimer().endtimer
			}
		}).then(data => {
			instructCallback(data, this.options);
			this.loading = false;
		}).catch(_ => {
			this.options.flag = false;
			this.loading = false;
		});
    }
  }
};
</script>
