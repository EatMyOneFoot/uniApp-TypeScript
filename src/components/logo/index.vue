<template>
  <view class="content">
    <image
      class="logo"
      src="../../static/logo.png"
      @tap="$u.debounce(btnAClick, 3000, true)"
    ></image>
    <view @tap="$u.throttle(click, 1000, true)">
      <u-icon name="fingerprint"></u-icon>
      <text class="title">{{ title }}</text>
      <text class="title">{{ text }}</text>
    </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";

@Component({
  name: "logo",
})
export default class logo extends Vue {
  @Model("change", { default: "" }) private title!: string;

  mounted() {
    UserModule.setState({ state: "name", value: "稳住哦" });
    console.log("mounted==>", UserModule.name);
    setTimeout(() => {
      UserModule.setState({ state: "name", value: "别浪" });
      this.$emit("change", "World");
    }, 2 * 1000);
  }

  get text() {
    return UserModule.name;
  }

  private btnAClick() {
    console.log("%c防抖，3秒==> 别人封装好的用起来还是香啊", "color:red");
  }

  private click() {
    console.log("%c节流，1秒==> 别人封装好的用起来还是香啊", "color:blue");
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .logo {
    height: 200rpx;
    width: 200rpx;
    margin: 200rpx auto 50rpx auto;
  }

  .title {
    font-size: 36rpx;
    color: #8f8f94;
    margin-left: 5rpx;
  }
}
</style>
