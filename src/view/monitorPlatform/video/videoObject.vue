<template>
   <div class="onlyOneVideo">
                  <!--  <iframe id='iframebar' src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0
                   style="position:absolute; visibility:inherit; top:0px;left:6px;width:100%; z-Index:0; "> -->
                    <OBJECT codebase=".\TLMDVRAx.CAB#version=1,0,5,3" :id='id' name="TLMDvrAx" CLASSID="CLSID:15AB9520-D6EF-499B-AB7F-906AB0BA04AD" events="true" HEIGHT=500 WIDTH=800 align="top">
                        <param value="/swf/park/1/1303872749292.swf" name="movie">
                        <param value="high" name="quality">
                        <param value="always" name="allowScriptAccess">
                        <param value="internal" name="allowNetworking">
                        <param value="transparent" name="wmode">
                        <embed height="600" width="940" wmode="transparent" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" allownetworking="internal" allowscriptaccess="always" quality="high" src="/swf/park/1/1303872749292.swf">
                   </OBJECT>
                  <!-- </iframe> -->
                    
                  
                       <!-- <param name="wmode" value="transparent"> -->
                   </div>
</template>

<script type="text/javascript">
export default {
    props: {
        id:{},
        data:{}
     },
    data(){
      return{    
      }
    },
    methods:{
    
    },
    watch: {
    },
    mounted(){
    }

}
</script>
<style lang="scss">
.onlyOne{
  float: left;
    width:800px;
    height:500px;
  .onlyOneVideo{
 position: absolute;
 z-index:0;
  // background:pink;
  height:500px;
  margin-left: 25px;

 }
 }
</style>