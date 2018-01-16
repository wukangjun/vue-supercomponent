<template>
   <el-form :inline="true" ref="drivingScore" :model="formContent" label-width="80px" :rules="rules">
       <el-form-item :label="$t('急加速')" prop="acceleration">
           <el-input size="small" style="width:215px;" v-model="formContent.acceleration" :readonly="isRead"></el-input>
       </el-form-item>
       <el-form-item :label="$t('急减速')" prop="deceleration">
           <el-input size="small" style="width:215px;" v-model="formContent.deceleration" :readonly="isRead"></el-input>
       </el-form-item>
       <el-form-item :label="$t('急转弯')" prop="turning">
           <el-input size="small" style="width:215px;" v-model="formContent.turning" :readonly="isRead"></el-input>
       </el-form-item>
       <el-form-item :label="$t('超速行驶')" prop="hypervelocity">
           <el-input size="small" style="width:215px;" v-model="formContent.hypervelocity" :readonly="isRead"></el-input>
       </el-form-item>
       <el-form-item :label="$t('疲劳驾驶')" prop="fatigue">
           <el-input size="small" style="width:215px;" v-model="formContent.fatigue" :readonly="isRead"></el-input>
       </el-form-item>
       <el-form-item :label="$t('碰撞')" prop="collision">
           <el-input size="small" style="width:215px;" v-model="formContent.collision" :readonly="isRead"></el-input>
       </el-form-item>
       <el-form-item :label="$t('侧翻')" prop="rollover">
           <el-input size="small" style="width:215px;" v-model="formContent.rollover" :readonly="isRead"></el-input>
       </el-form-item>
       <el-form-item label="车组">
            <cv-dropdown-tree :is-fleet="true" style="width:215px;" v-model.trim="fleetName" :interface="$COMMON.baseUrl + '/fleet/findFleetInfoList'" :is-default="false"  :enterprise-id="enterpriseId" @label="selectFleet"></cv-dropdown-tree>
       </el-form-item>
       <el-form-item style="width:100%;text-align:center;">
           <el-button type="primary" style="width:100px;" :loading="loading" @click="save">保存</el-button>
       </el-form-item>
   </el-form>
</template>
<script>
import prot from "./index.js";
export default {
  components: {},
  mixins: [prot],
  data() {
    return {
      enterpriseId: "",
      fleetName: "",
      fleetId: "",
      loading:false,
      isRead:false,
      formContent: {
        acceleration: "1",
        deceleration: "1",
        turning: "1",
        hypervelocity: "1",
        fatigue: "1",
        collision: "1",
        rollover: "1"
      },
      rules: {
        acceleration: [
          {
            min: 0,
            max: 3,
            message: this.$filter.lanReplace(this.$t("filter.Length"), {
              min: 0,
              max: 3
            })
          },
          {
            pattern: /^[0-9]+$/,
            message: this.$t("filter.type2"),
            trigger: "blur,change"
          }
        ],
        deceleration: [
          {
            min: 0,
            max: 3,
            message: this.$filter.lanReplace(this.$t("filter.Length"), {
              min: 0,
              max: 3
            })
          },
          {
            pattern: /^[0-9]+$/,
            message: this.$t("filter.type2"),
            trigger: "blur,change"
          }
        ],
        turning: [
          {
            min: 0,
            max: 3,
            message: this.$filter.lanReplace(this.$t("filter.Length"), {
              min: 0,
              max: 3
            })
          },
          {
            pattern: /^[0-9]+$/,
            message: this.$t("filter.type2"),
            trigger: "blur,change"
          }
        ],
        hypervelocity: [
          {
            min: 0,
            max: 3,
            message: this.$filter.lanReplace(this.$t("filter.Length"), {
              min: 0,
              max: 3
            })
          },
          {
            pattern: /^[0-9]+$/,
            message: this.$t("filter.type2"),
            trigger: "blur,change"
          }
        ],
        fatigue: [
          {
            min: 0,
            max: 3,
            message: this.$filter.lanReplace(this.$t("filter.Length"), {
              min: 0,
              max: 3
            })
          },
          {
            pattern: /^[0-9]+$/,
            message: this.$t("filter.type2"),
            trigger: "blur,change"
          }
        ],
        collision: [
          {
            min: 0,
            max: 3,
            message: this.$filter.lanReplace(this.$t("filter.Length"), {
              min: 0,
              max: 3
            })
          },
          {
            pattern: /^[0-9]+$/,
            message: this.$t("filter.type2"),
            trigger: "blur,change"
          }
        ],
        rollover: [
          {
            min: 0,
            max: 3,
            message: this.$filter.lanReplace(this.$t("filter.Length"), {
              min: 0,
              max: 3
            })
          },
          {
            pattern: /^[0-9]+$/,
            message: this.$t("filter.type2"),
            trigger: "blur,change"
          }
        ]
      }
    };
  },
  methods: {
    selectFleet(val) {
      this.fleetId = val.id;
      this.isRead = true;
      this.queryPiccWeightsInfo({ vehicleTeamId: val.id }).then(data => {
        if (data.flag && data.data.length!=0) {
          for (let k in this.formContent) {
            switch (k) {
              case "acceleration":
                this.formContent[k] = data.data.acceleration;
                break;
              case "deceleration":
                this.formContent[k] = data.data.deceleration;
                break;
              case "turning":
                this.formContent[k] = data.data.turning;
                break;
              case "hypervelocity":
                this.formContent[k] = data.data.hypervelocity;
                break;
              case "fatigue":
                this.formContent[k] = data.data.fatigue;
                break;
              case "collision":
                this.formContent[k] = data.data.collision;
                break;
              case "rollover":
                this.formContent[k] = data.data.rollover;
                break;
            }
          }
        }else{
            for(let j in this.formContent){
                this.formContent[j] = '1'
            }
        }
        this.isRead = false;
      }).catch(_=>{
          this.isRed = false;
      });
    },
    save() {
       if(this.fleetId == ''){
           this.$message.warning({message:this.$t('请选择车组')});
           return false;
       } 
      let params = {
        acceleration: this.formContent.acceleration,
        collision: this.formContent.collision,
        deceleration: this.formContent.deceleration,
        fatigue: this.formContent.fatigue,
        hypervelocity: this.formContent.hypervelocity,
        rollover: this.formContent.rollover,
        turning: this.formContent.turning,
        vehicleTeamId: this.fleetId
      };
      let total = 0;
      for (let i in params) {
          if(i == 'vehicleTeamId'){
              break;
          }
          total = Number(params[i]) + total;
      }
      this.$refs["drivingScore"].validate(valid => {
        if (valid) {
          if (total > 100) {
            this.$message.warning({ message: this.$t("总分超过100，请重新输入") });
            return false;
          } else {
              this.loading = true;
            this.updatePiccWeightsInfo(params).then(data => {
              if(data.flag){
                  this.$message.success({message:this.$t('保存成功')})
              }
              this.loading = false;
            }).catch(_=>{
                this.loading = false;
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      console.log(total);
      //   this.updatePiccWeightsInfo(params).then(data => {
      //     console.log(data);
      //   });
    }
  },
  watch: {
    "formContent.acceleration"(newVal) {}
  },
  mounted() {
    this.enterpriseId = this.$store.getters.user.enterpriseId;
  }
};
</script>
<style lang="scss">

</style>
