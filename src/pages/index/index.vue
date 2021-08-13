<template>
  <view>
    <!-- logo -->
    <logo :title="title" />
    <!-- #ifdef APP-PLUS -->
    <view v-if="!!readResult">readResult: {{ readResult }}</view>
    <!-- 开启nfc读卡的按钮，条件编译 + 仅IOS端显示 -->
    <drag-button @onClick="onClick" :buttonList="buttonList" v-if="show" />
    <!-- #endif -->
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import logo from "@/components/logo/index.vue";
import dragButton from "@/components/dragButton/index.vue";
import { itemList } from "@/api/index";
import { formatTime, platform } from "@/utils/common";
// #ifdef APP-PLUS
import { NfcModule } from "@/store/modules/nfc";
import NFC from "@/utils/nfc";
// #endif
import nfc_black from "@/static/icons/nfc_black.png";
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

  // #ifdef APP-PLUS
  get readResult() {
    return NfcModule.readResult;
  }
  // #endif

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
  get nfc_black() {
    return nfc_black;
  }
  // 控制nfc读卡的按钮显示
  private show = true;

  private buttonList = [
    {
      name: "读卡",
      icon: nfc_black,
      handleClick: this.readNfc,
    },
  ];

  /**
   * 开启读nfc卡
   * */
  private readNfc() {
    console.log("开启读nfc卡");
    NFC.NFCInit();
  }

  private onClick(item: any) {
    item.handleClick();
  }
}
</script>

<style scoped lang="scss">
</style>
