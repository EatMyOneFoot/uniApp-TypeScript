<script lang="ts">
import Vue from "vue"
import { WeChatUpdateManager } from "@/utils/common"

export default Vue.extend({
  mpType: "app",
  onLaunch() {
    // console.log("App Launch")
    // #ifdef MP-WEIXIN
    WeChatUpdateManager()
    // #endif
  },
  onShow() {
    // console.log("App Show")
  },
  onHide() {
    // console.log("App Hide")
  },
})
</script>

<style lang="scss">
/*每个页面公共css */
/*引入uView基础样式 */
@import "uview-ui/index.scss";
</style>
