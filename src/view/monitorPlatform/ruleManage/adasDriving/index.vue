<template>
    <tiredDriving api="/driver/queryAdas" mapName="adasDriving"></tiredDriving>
</template>

<script>
import tiredDriving from '../tiredDriving/index.vue'     
export default {
    components: {tiredDriving}
}
</script>

