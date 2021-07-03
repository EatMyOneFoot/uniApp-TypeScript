<template>
  <view>
    <!-- logo -->
    <logo :title="title" />
    <view v-if="!!readResult">readResult: {{ readResult }}</view>
    <!-- #ifdef APP-PLUS -->
    <!-- 开启nfc读卡的按钮，条件编译 + 仅IOS端显示 -->
    <drag-button @onChange="onChange" @onTouchend="onTouchend">
      <view
        class="drag-button u-flex u-row-center"
        :style="dragStyle"
        @tap="readNfc"
        v-if="show"
      >
        <u-icon :name="nfc_white" color="#ffffff" size="36"></u-icon>
      </view>
    </drag-button>
    <!-- #endif -->
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import logo from "@/components/logo/index.vue";
import dragButton from "@/components/dragButton/index.vue";
import { itemList } from "@/api/index";
import { formatTime, platform } from "@/utils/common";
import { NfcModule } from "@/store/modules/nfc";
import NFC from "@/utils/nfc";
import nfc_white from "@/static/icons/nfc_white.png";
@Component({
  name: "index",
  components: {
    logo,
    dragButton,
  },
})
export default class Index extends Vue {
  private title: string = "Hello";
  onLoad() {
    // console.log('onLoad==>', 11111);
    // console.log(formatTime(1615116430, "yyyy-MM-dd hh:mm:ss"));
    // this.init();
    // #ifdef APP-PLUS
    NFC.NFCInit();
    // #endif
  }

  onShow() {
    // #ifdef APP-PLUS
    NfcModule.setState({
      state: "readyRead",
      value: true,
    });
    if (platform() === "ios") {
      this.show = true;
    }
    // #endif
  }

  get readResult() {
    return NfcModule.readResult;
  }

  private init() {
    console.log("init==>", 66666);
    itemList({})
      .then((res: any) => {
        console.log("res==>", res);
      })
      .catch((err: any) => {
        console.log("err==>", err);
      });
  }

  /* ------------drag-button------------ */
  get nfc_white() {
    return nfc_white;
  }
  // 控制nfc读卡的按钮显示
  private show = true;

  private dragStyle = {
    borderRadius: "50% 0 0 50%",
  };

  private onChange(e: any) {
    this.$set(this.dragStyle, "borderRadius", "50%");
  }

  private onTouchend(obj: any) {
    if (obj.x < obj.num) {
      this.$set(this.dragStyle, "borderRadius", "0 50% 50% 0");
    } else {
      this.$set(this.dragStyle, "borderRadius", "50% 0 0 50%");
    }
  }

  /**
   * 开启读nfc卡
   * */
  private readNfc() {
    console.log("开启读nfc卡");
    NFC.NFCInit();
  }
}
</script>

<style scoped lang="scss">
.drag-button {
  width: 100rpx;
  height: 100rpx;
  padding: 15rpx;
  background-color: #073f5a;
  // border-radius: 50% 0 0 50%;
  transition-property: border-radius;
  transition-duration: 0.1s;

  &:active {
    opacity: 0.8;
  }
}
</style>
