<template>
    <cv-scrollbar class="fence-lineSet">
        <el-form label-width="120px">
            <div class="line-item" v-for="data in options" :key="data.num">
                <el-form-item label="编号">
                    <el-input v-model="data.sectionsId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="属性">
                    <el-checkbox-group v-model="data.areaAttributes">
                        <el-checkbox label="1" name="type">{{'行驶时间'}}</el-checkbox>
                        <el-checkbox label="2" name="type" >{{'限速'}}</el-checkbox>
                        <img src="../../../../assets/img/gouxuan2.png" alt="" title="" style="width:23px;height:20px;top:5px;position:relative"/>东经
                         <img src="../../../../assets/img/gouxuan2.png" alt="" title="" style="width:23px;height:20px;top: 5px;position:relative"/>北纬
                    </el-checkbox-group>

                </el-form-item>
                <el-form-item label="拐点编号">
                    <el-input v-model="data.inflectionId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="行驶过长阀值">
                    <el-input v-model="data.desconds"></el-input>
                </el-form-item>
                <el-form-item label="行驶不足阀值">
                    <el-input v-model="data.dlowseconds"></el-input>
                </el-form-item>
                <el-form-item label="最高速度">
                    <el-input v-model="data.aspeed"></el-input>
                </el-form-item>
                <el-form-item label="超速持续时间">
                    <el-input v-model="data.aseconds"></el-input>
                </el-form-item>
                <el-form-item label="宽度">
                    <el-input v-model="data.width"></el-input>
                </el-form-item>
                <el-form-item label="限制转速">
                    <el-input v-model="data.limitrpm"></el-input>
                </el-form-item>
            </div>
        </el-form>
    </cv-scrollbar>
</template>

<script>
export default {
    props: {
        options: {}
    }
}
</script>

<style lang="scss">
    .fence-lineSet{
        height: 490px;
        background: #fff;
        .line-item{
            margin-top: 10px;
            border-bottom: 1px solid #ccc;
        }
        .el-input{
            width: 250px;
        }
    }
</style>




