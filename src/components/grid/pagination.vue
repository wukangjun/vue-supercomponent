<template>
<div class="cv-grid-pagination">
<el-pagination 			
    layout="total, sizes, prev, pager, next" 
    small
    v-show="options.total > 5 ? true : false"
    v-if='isPagination'
    :page-size="options.size"
    :page-sizes="[10,20,30,40,50]"
    :total="options.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"></el-pagination>
</div>
</template>
<script>
   export default {
        props: {
            options: {
                default(){
                    return {
                        current: 1,
                        size: 10,
                        total: 0,
                        flag: false
                    }
                }
            },
            isPagination: {
                type: Boolean,
                default: true
            }
        },
        methods: {
			handleSizeChange(val){
				this.options.size = val;
				this.$emit('load')
			},
			handleCurrentChange(val){
				this.options.current = val;
				this.$emit('load')
			}
		}
   }
</script>
<style lang="scss">
    .cv-grid-pagination{
		.el-pagination{
            float: right;
            margin-top: 10px;
            .el-select .el-input{
                width: 68px;
            }
            .el-pager li{
                line-height: 22px;
                height: 22px;
                min-width:15px;
            }
            button[type='button']{
                margin-top:3px;
            }
            ul{
                margin-top: 3px;
            }
        }
	}
</style>
