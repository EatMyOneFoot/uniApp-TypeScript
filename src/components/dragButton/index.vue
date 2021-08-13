<template>
  <!-- 可拖动的悬浮按钮 -->
  <movable-area class="fixed-box">
    <movable-view
      class="fixed-button flex-all-center"
      direction="all"
      damping="100"
      :out-of-bounds="true"
      :x="axis.x"
      :y="axis.y"
      @touchend="onTouchend"
      @change="onChange"
      v-if="redraw"
    >
      <view
        class="drag-button"
        :style="{
          width: width + 'rpx',
        }"
      >
        <view
          class="drag-button-main flex-all-center"
          :style="{
            borderRadius: dragRadius,
            left: left,
            right: right,
          }"
          @tap.stop="clickMain"
        >
          <u-icon
            :name="showList ? 'grid-fill' : 'grid'"
            color="#ffffff"
            size="50"
          >
          </u-icon>
        </view>

        <view
          v-if="showList"
          class="button-list"
          :style="{
            left: left,
            right: right,
            padding: `0 ${axis.x == screenWidth ? 120 : 30}rpx 0 ${
              axis.x == screenWidth ? 30 : 120
            }rpx`,
          }"
        >
          <view
            v-for="(item, index) in buttonList"
            :key="index"
            @tap.stop="onClick(index, item)"
            class="list-item"
          >
            <u-icon :name="item.icon" color="#999999" size="40"></u-icon>
            <view class="item-name">
              {{ item.name }}
            </view>
          </view>
        </view>
      </view>
    </movable-view>
  </movable-area>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "dragButton",
})
export default class DragButton extends Vue {
  /** 按钮列表数据
   * @param {Array<Object>}
   * {name: "按钮名称", icon: "uView自带的字体图标名称",handleClick: 点击之后触发的事件}
   */
  @Prop({
    default: () => {
      return [];
    },
  })
  private buttonList!: Array<Object>;

  // 悬浮按钮的位置
  public axis: any = { x: 0, y: 300 };

  // 容器宽度
  get width() {
    return this.showList ? this.buttonList.length * 80 + 150 : 100;
  }

  // position定位的左边距
  private left: any = null;
  // position定位的右边距
  private right: any = null;

  @Watch("axis", { deep: true })
  onConnectState(newVal: any, oldVal: any) {
    // console.log(newVal, this.screenWidth);
    if (newVal.x == this.screenWidth || newVal.x == this.screenWidth + 0.01) {
      this.$set(this, "left", null);
      this.$set(this, "right", 0);
    } else {
      this.$set(this, "left", 0);
      this.$set(this, "right", null);
    }
  }

  created() {
    this.getScreenWidth();
  }

  // 屏幕宽度
  private screenWidth: number = 0;

  // 最新的按钮位置信息，@change触发时更新
  private newValue: any = {
    xAxis: -1,
    yAxis: -1,
  };

  /** 获取屏幕宽度 */
  private getScreenWidth() {
    uni.getSystemInfo({
      success: (res) => {
        this.$set(this.axis, "x", res.screenWidth);
        this.$set(this, "screenWidth", res.screenWidth);
      },
    });
  }

  /**
   * 用于控制movable-view组件重绘
   * 由于微信小程序端点击展开按钮列表之后，组件宽度发生变化，会把右侧内容挤出屏幕外
   * v-if重新渲染一下可以解决问题
   */
  private redraw = true;

  // 按钮圆角
  private dragRadius = "50% 0 0 50%";

  // 拖动过程中触发的事件
  private onChange(event: any) {
    // console.log(event.detail);
    this.$set(this.newValue, "xAxis", event.detail.x);
    this.$set(this.newValue, "yAxis", event.detail.y);
    if (event.detail.source === "touch") {
      this.$set(this, "dragRadius", "50%");
      this.$emit("onChange", event.detail);
    }
  }

  // 停止触摸时触发 让按钮自动往侧边吸附
  private onTouchend() {
    let num = this.screenWidth / 2;
    // 这个时候也会触发 onChange()
    if (this.newValue.xAxis !== -1 && this.newValue.yAxis !== -1) {
      this.$set(this.axis, "x", this.newValue.xAxis);
      this.$set(this.axis, "y", this.newValue.yAxis);
    }
    let x = this.axis.x;
    this.redraw = false;
    if (x > num || x == num) {
      // 防止组件属性设置不生效
      this.$set(this.axis, "x", this.screenWidth + 0.01);
      this.$nextTick(() => {
        this.redraw = true;
        this.$set(this.axis, "x", this.screenWidth);
      });
    } else {
      this.$set(this.axis, "x", -1);
      this.$nextTick(() => {
        this.redraw = true;
        this.$set(this.axis, "x", 0);
      });
    }
    /**
     * onChange()中的$emit设置了source === "touch"的判断，
     * 但是当movable-view组件'快速划出'的时候，
     * 在onTouchend()之后还是会出现一次 source === "touch",所以在这里加个延时
     */
    setTimeout(() => {
      if (this.showList) return;
      let obj = {
        x: this.axis.x,
        num: num,
      };
      if (obj.x < obj.num) {
        this.$set(this, "dragRadius", "0 50% 50% 0");
      } else {
        this.$set(this, "dragRadius", "50% 0 0 50%");
      }
      this.$emit("onTouchend", obj);
    }, 100);
  }

  // 是否显示按钮列表;
  private showList = false;

  // 点击主按钮
  private clickMain() {
    if (this.buttonList.length == 0) {
      // 如果没有设置按钮列表数据
      this.$emit("onClick", "");
      return;
    }
    this.$set(this, "showList", !this.showList);
    if (this.showList) {
      this.$set(this, "dragRadius", "50%");
    }
  }

  // 点击列表按钮
  private onClick(index: number, item: any) {
    this.$emit("onClick", item);
    this.clickMain();
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
  z-index: 99;

  .fixed-button {
    touch-action: none;
    pointer-events: auto;
    width: max-content;
    height: auto;
    overflow: hidden;
    padding: 10rpx 0;
    z-index: 9999;
  }
}

.drag-button {
  position: relative;
  height: 100rpx;
  transition: width 0.1s linear;
}

.drag-button-main {
  width: 100rpx;
  height: 100rpx;
  padding: 15rpx;
  background-color: #073f5a;
  transition-property: border-radius;
  transition-duration: 0.1s;
  position: absolute;
  z-index: 2;

  &:active {
    opacity: 0.8;
  }
}

.button-list {
  height: 100%;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 0 10rpx #888888;
  border-radius: 50rpx;
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .list-item {
    padding: 0 15rpx;

    .item-name {
      font-size: 24rpx;
      color: #999999;
      white-space: nowrap;
    }
  }
}

.flex-all-center {
  display: flex;
  align-items: center;
  justify-content: center;
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
