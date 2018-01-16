<template>
<el-row class="container" :gutter="20">
  <el-col :span="24">
    <el-form :model="formData" label-position="top" :inline="false" :rules="rules" ref="modifyForm">
      <!-- 服务IP  -->
      <el-col :span="12">
        <el-form-item label="809服务IP" prop="ip">
          <el-input v-model.trim="formData.ip" size="small"></el-input>
        </el-form-item>
      </el-col>
      <!-- 服务端口  -->
      <el-col :span="12">
        <el-form-item label="809服务端口" prop="portStr">
          <el-input v-model="formData.portStr" size="small" :maxlength='4'></el-input>
        </el-form-item>
      </el-col>
      <!-- 自动重连 -->
      <el-col :span="12">
        <el-form-item label="自动重连" prop="autoReconn">
          <!-- <el-radio-group v-model="formData.autoReconn">
            <el-radio :label=1>{{'是'}}</el-radio>
            <el-radio :label=0>{{'否'}}</el-radio>
          </el-radio-group> -->
          <el-switch v-model="formData.autoReconn" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="自动连接" prop="autoConn">
          <!-- <el-radio-group v-model="formData.autoConn">
            <el-radio :label=1>{{'是'}}</el-radio>
            <el-radio :label=0>{{'否'}}</el-radio>
          </el-radio-group> -->
          <el-switch v-model="formData.autoConn" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-col>
      <!-- 服务名称  -->
      <el-col :span="12">
        <el-form-item label="809服务名称" prop="name">
          <el-input v-model.trim="formData.name" size="small" :maxlength='32767'></el-input>
        </el-form-item>
      </el-col>
    </el-form>
  </el-col>
  <el-col :span="24" class="dialog-footer">
    <el-button :loading="loading" type="primary" @click="confirm">{{$t('action.save')}}</el-button>
    <el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
  </el-col>
</el-row>
</template>
<script>
import {
  COMMON
} from "@/utils";
export default {
  props: {
    options: {}
  },
  data() {
    return {
      formData: {
        ip: '',
        portStr: '',
        autoReconn: '',
        autoConn: '',

      },
      loading: false,
      rules: {
        ip: [{
            required: true,
            message: this.$t("filter.noempty"),
            trigger: "blur,change"
          },
          {
            pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/,
            message: this.$t('filter.type13')
          }
        ],
        portStr: [{
            required: true,
            message: this.$t("filter.noempty"),
            trigger: "blur,change"
          },
          {
            pattern: /^[1-9]\d*$/,
            message: this.$t("filter.type14")
          }
        ],
        name: [{
          required: true,
          message: this.$t("filter.noempty"),
          trigger: "blur,change"
        }]
      }
    };
  },
  methods: {
    confirm() {
      this.$refs["modifyForm"].validate(valid => {
        if (valid) {
          let params = {
            autoReconn: this.formData.autoReconn?'1':'0',
            autoConn: this.formData.autoConn?'1':'0',
            ip: this.formData.ip,
            portStr: this.formData.portStr,
            name: this.formData.name,
            id: this.options.modifyData.id
          };
          this.loading = true;
          this.$http({
              url: this.$COMMON.baseUrl + "/serviceManagement/updateEznService",
              params: params
            })
            .then(data => {
              this.loading = false;
              if (!data.flag && !!data.errorCode) {
                this.$message.error({
                  message: this.$t("error." + data.errorCode)
                });
              } else {
                this.$emit("confirm");
                this.$message.success(this.$t("action.modifySuccess"));
                this.options.flag = false;
              }
            })
            .catch(error => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    this.formData.ip = this.options.modifyData.ip;
    this.formData.portStr = this.options.modifyData.portStr;
    this.formData.autoReconn = this.options.modifyData.autoReconn=='1'?true:false;
    this.formData.autoConn = this.options.modifyData.autoConn=='1'?true:false;
    this.formData.name = this.options.modifyData.name;
  },
  watch: {
    "options.flag" (newVal) {
      if (!newVal) {
        this.options.name = ''
      }
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
