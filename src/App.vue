<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  mpType: "app",
  onLaunch() {
    console.log("App Launch");
    // #ifdef MP-WEIXIN
    // 微信小程序线上版本检查更新
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateReady((res2) => {
          uni.showModal({
            title: "更新提示",
            content: "发现新版本，是否重启应用?",
            cancelColor: "#eeeeee",
            confirmColor: "#FF0000",
            success(res2) {
              if (res2.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              }
            },
          });
        });
      }
    });
    updateManager.onUpdateFailed((res) => {
      // 新的版本下载失败
      uni.showModal({
        title: "提示",
        content: "检查到有新版本，但下载失败，请检查网络设置",
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        },
      });
    });
    // #endif
  },
  onShow() {
    console.log("App Show");
  },
  onHide() {
    console.log("App Hide");
  },
});
</script>

<style lang="scss">
/*每个页面公共css */
/*引入uView基础样式 */
@import "uview-ui/index.scss";
</style>
