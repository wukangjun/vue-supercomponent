<template>
   <div class="drivingScore">
     <cv-content :fill="true" style="top:10px;">
         <driving-score style="width:620px;margin:10px auto;"></driving-score>
     </cv-content>
   </div>
</template>
<script>
import drivingScore from "./driveScore";
import port from "./index.js";
export default {
  components: {
    drivingScore
  },
  mixins: [port],
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="scss">
.drivingScore {
}
</style>
