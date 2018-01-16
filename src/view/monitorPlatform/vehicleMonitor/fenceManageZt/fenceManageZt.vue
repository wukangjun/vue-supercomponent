<template>
<component :is="options.name" :options="options"></component>
</template>

<script>
import fenceMainZt from "./fenceMainZt.vue"
import fenceActionzt from "./fenceZt"
export default {
    components:{fenceMainZt,fenceActionzt},
    data() {
        return {
            options:{
                name:"fenceMainZt",
                power:[],
                id:""
            },
        }
    }
}
</script>

<style lang="scss" scoped>

</style>