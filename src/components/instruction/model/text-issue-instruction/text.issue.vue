<template>
<div class="instruction-textIssue">
	<el-form ref="textForm" label-width="100px;" :rules="rules" :model="formData">
		<el-form-item label="文本状态" style="margin-bottom:5px;">
			<el-checkbox-group v-model="checkBox" style="width:100px;margin-left: 150px;padding-top: 10px;">
        <el-checkbox ref='ckbox' v-for="box in checkBoxList" :label="box.label" :value="box.value" :key="box.id"></el-checkbox>
			</el-checkbox-group>
			<el-radio-group v-model="radioBox" style="width:100px;margin-left: 150px;">
				<el-radio ref='rbox' style="margin-left:15px;" label="中心导航信息(兼容北斗)"></el-radio>
				<el-radio ref='rbox' label="CAN故障码信息(兼容北斗)"></el-radio>
			</el-radio-group>
		</el-form-item>
		</el-form-item>
		<el-form-item label="文本内容" prop="textInfo">
			<el-input size="small" style="width:230px;margin-left:95px;" v-model="formData.textInfo"></el-input>
		</el-form-item>
	</el-form>
	<div class='dialog-footer'>
		<el-button type="primary" @click="confirm">{{ $t('action.confirm') }}</el-button>
		<el-button @click="options.flag=false">{{ $t('action.cancel') }}</el-button>
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
      checkBox: [],
      checkBoxList:[
        {label:'紧急',value:1},
        {label:'终端显示器显示',value:1},
        {label:'终端TTS播读',value:1},
        {label:'广告屏显示',value:1},
      ],
      radioBox: "",
      formData: {
        textInfo: ""
      },
      rules: {
        textInfo: [
          {
            required: true,
            message: this.$t("filter.notEmpty"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    confirm() {
      let tempArr = []
      this.$refs['ckbox'].forEach(_=>{
        _.isChecked?tempArr.push(_.value):tempArr.push(0)
      })
      tempArr.splice(1, 0, 0);
      this.radioBox == '中心导航信息(兼容北斗)' ? tempArr.push(0):tempArr.push(1)
      tempArr.reverse()
      let str = tempArr.join('')
      this.$refs["textForm"].validate(valid => {
        if (valid) {
          publicApi({
            url: "/sendOrder/text",
            params: {
              vehicleId: this.options.id,
              msgInfo: this.formData.textInfo,
              type: str,
              enterpriseId:this.options.enterpriseId
            }
          }).then(data => {
            instructCallback(data, this.options);
          });
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
   
  },
  watch:{
    // 'checkBox'(newVal){
    //   console.log(newVal)
    // }
  }
};
</script>

<style lang="scss">
.instruction-textIssue {
  .el-form{
    .el-checkbox-group{
      .el-checkbox:nth-child(1){
        margin-left: 15px;
      }
    }
  }
  .el-form-item__label {
    position: relative;
    left: 95px;
  }
  .el-form-item__error {
    left: 175px;
  }
  .el-form-item__content {
    line-height: normal;
  }
  .item {
    text-align: center;
    .el-checkbox,
    .el-radio {
      display: block;
      width: 100%;
      float: right;
    }
  }
}
</style>
