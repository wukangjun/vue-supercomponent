<template>
<div class="">
    <span>查岗内容:{{options.mess.message}}</span>
    <textarea style="width:100%;display:block;text-indent:1em;box-sizing:border-box;padding:5px;" name="" id="" cols="30" rows="10" v-model.trim="info"></textarea>
    <el-button style="float:right;margin:20px 0;" type="primary" @click="answer">回复</el-button>
</div>
</template>
<script>
export default {
    props: {
        options: {}
    },
    mixins: [''],
    data() {
        return {
            info: ''
        }
    },
    methods: {
        answer() {
            if (this.info == '') {
                this.$message.warning('请输入应答内容');
                return false;
            }
            let params = {
                userId:Number(this.$store.getters.user.id), //应答用户id
                answer: this.info, //应答内容
                inspectId: Number(this.options.mess.inspectId), //查岗id
                inspectType: Number(this.options.mess.inspectType), //查岗类型
                enterpriseId: Number(this.$store.getters.user.enterpriseId), //企业id
                answerTime: this.$filter.format(new Date(), "yyyy-MM-dd HH:mm:ss"), //应答时间
                infoId: Number(this.options.mess.infoId), //上级平台查岗id
                superPlatId: Number(this.options.mess.superPlatId), //上级平台id,
                inspectPostId:Number(this.options.mess.userIdAndInspectPostId[this.$store.getters.user.id])
            }
            this.$http({
                url: this.$COMMON.baseUrl + '/inspectTheSentry/insertInspectSentryAnswer',
                params: params
            }).then(data => {
                if(data.flag){
                    this.options.flag = false;
                    this.options.name = ''
                }
            })
            this.$http({
                url: this.$COMMON.baseUrl + '/inspectTheSentry/sendInspectSentryAnswer',
                params: params
            }).then(data => {
                if(data.flag){
                    this.options.flag = false;
                    this.options.name = ''
                }
            })
        }
    },
    mounted() {
    },
    watch:{
        'options.flag'(newVal){
            if(!newVal){
                this.options.name = ''
            }
        }
    }
}
</script>
<style lang="scss">

</style>
