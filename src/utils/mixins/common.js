/*
 * 每个页面相同共用的方法（业务逻辑层面）
 * name: wukangjun
 * time: 2017.07.14
 */
export default {
    methods: {
        // 提示用户是否确定要进行此次操作
        confirmPrompt(content) {
            let message = content || this.$t('action.confirmIsRemove');
            return new Promise((resolve, reject) => {
                this.$confirm(message, this.$t('action.tip'), {
                    confirmButtonText: this.$t('action.confirm'),
                    cancelButtonText: this.$t('action.cancel'),
                    type: 'warning'
                }).then(() => {
                    resolve()
                }).catch(() => {
                    return false
                })
            })
        },
        //时间限制天数的公共方法 2017-10-13 03:10:40
        timeLimitFunc(startTime,endTime,dayLength){
            //时间限制天数
            if(startTime && endTime){
                let days = (new Date(endTime) - new Date(startTime)) / 86400000;
                let num = days.toFixed(1);
                 //在规定范围内
                return  num <= dayLength ? true : this.$message.error({ message: this.$t("请选择时间范围在"+dayLength+'天内') });
            }else{
                this.$message.error({ message: this.$t('请选择时间范围') });
            }        
        },
        // 判断2个数组多了什么，少了什么
        addRemoveUnique(newVal, oldVal, param){
            let newLen = newVal.length, oldLen = oldVal.length;
            if(newLen > oldLen){
                /* add */
                return {
                    name: 'add',
                    data: this.$service.isUnique(newVal, oldVal, param)
                }
            }
            if(newLen < oldLen){
                /* remove */
                return {
                    name: 'remove',
                    data: this.$service.isUnique(oldVal, newVal, param)
                }
            }
            if(newLen == oldLen){
                /* equal*/
                return {
                    name: 'equal',
                    data: this.$service.isUnique(newVal, oldVal, param)
                }
            }           
        },
        // 鼠标移入显示提示信息
        mouseenterShowTip(event, name){
            const target = event.target;
            if(target.scrollWidth > target.offsetWidth){
                const tooltip = this.$refs[name];					
                /* 显示tooltip */
                tooltip.referenceElm = target;
                tooltip.$refs.popper.style.display = 'none';
                tooltip.doDestroy();
                tooltip.setExpectedState(true);
                tooltip.handleShowPopper();	
                return target.innerText;
            }	
        },
        // 鼠标移出隐藏提示信息
        mouseoverHideTip(name){
            const tooltip = this.$refs[name];
            if (tooltip) {
                tooltip.setExpectedState(false);
                tooltip.handleClosePopper();
            }
        }
    }
}