<template>
<component :is="options.name" :options="options"></component>
</template>

<script>
import fenceMain from "./fenceMain.vue"
import fenceAction from "./fenceAction.vue"
export default {
    components:{fenceMain,fenceAction},
    data() {
        return {
            options:{
                name:"fenceMain",
                power:[],
                id:""
            },
        }
    }
}
</script>

<style lang="scss" scoped>

</style>