<template>
  <view>
    <!-- logo -->
    <logo :title="title" />
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import logo from "@/components/logo/index.vue";
import { itemList } from "@/api/index";
import { formatTime } from "@/utils/common";

@Component({
  name: "index",
  components: {
    logo,
  },
})
export default class Index extends Vue {
  private title: string = "Hello";
  onLoad() {
    // console.log('onLoad==>', 11111);
    // console.log(formatTime(1615116430, "yyyy-MM-dd hh:mm:ss"));
    // this.init();
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
}
</script>

<style scoped lang="sass"></style>
