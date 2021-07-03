<template>
  <!-- 可拖动的悬浮按钮 -->
  <movable-area class="fixed-box">
    <movable-view
      class="fixed-button u-flex u-row-center"
      direction="all"
      damping="100"
      :x="axis.x"
      :y="axis.y"
      @touchend="onTouchend"
      @change="onChange"
    >
      <slot></slot>
    </movable-view>
  </movable-area>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "dragButton",
})
export default class DragButton extends Vue {
  @Prop({
    default: () => {
      return { x: 0, y: 300 };
    },
  })
  private axis!: object | any; // 悬浮按钮的位置

  created() {
    this.getScreenWidth();
  }

  // 屏幕宽度
  private screenWidth: number = 0;

  // 最新的按钮位置信息，@change触发时更新
  private newValue: any = {
    xAxis: 0,
    yAxis: 0,
  };

  // 获取屏幕宽度
  private getScreenWidth() {
    uni.getSystemInfo({
      success: (res) => {
        this.axis.x = this.screenWidth = res.screenWidth;
      },
    });
  }

  // 拖动过程中触发的事件
  private onChange(event: any) {
    // console.log(event.detail);
    this.$set(this.newValue, "xAxis", event.detail.x);
    this.$set(this.newValue, "yAxis", event.detail.y);
    if (event.detail.source === "touch") this.$emit("onChange", event.detail);
  }

  // 停止触摸时让按钮自动往侧边吸附
  private onTouchend() {
    let num = this.screenWidth / 2;
    // 这个时候也会触发 onChange()
    this.$set(this.axis, "x", this.newValue.xAxis);
    this.$set(this.axis, "y", this.newValue.yAxis);
    if (this.axis.x > num) {
      // 防止组件属性设置不生效
      this.$nextTick(() => {
        this.$set(this.axis, "x", this.screenWidth);
      });
    } else {
      this.$nextTick(() => {
        this.$set(this.axis, "x", 0);
      });
    }
    /**
     * onChange()中的$emit设置了source === "touch"的判断，
     * 但是当movable-view组件'快速划出'的时候，
     * 在onTouchend()之后还是会出现一次 source === "touch"
     */
    setTimeout(() => {
      let obj = {
        x: this.axis.x,
        num: num,
      };
      this.$emit("onTouchend", obj);
    }, 100);
  }
}
</script>

<style lang="scss" scoped>
.fixed-box {
  pointer-events: none; // 这里是重点，盒子可穿透操作
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100000;

  .fixed-button {
    touch-action: none;
    pointer-events: auto;
    width: max-content;
    height: auto;
    overflow: hidden;
    z-index: 9999;
  }
}

/* 适配iphonex 有底部横条的 */
@supports (bottom: constant(safe-area-inset-bottom)) or
  (bottom: env(safe-area-inset-bottom)) {
  .fixed-box {
    bottom: constant(safe-area-inset-bottom);
    bottom: env(safe-area-inset-bottom);
  }
}
</style>
