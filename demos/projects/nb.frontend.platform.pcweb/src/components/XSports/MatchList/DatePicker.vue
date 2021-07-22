<template>
  <ul
    :class="{
      'x-date-picker': true,
      available: available,
    }"
  >
    <li>
      <button
        :class="{
          prev: true,
          disabled: activeIndex <= 0,
        }"
        @click="toPrevDays"
      >prev</button>
    </li>
    <li
      ref="container"
      class="days-container"
      :style="{
        'justify-content': daysWidth >= containerWidth ? 'flex-start' : 'center',
      }"
    >
      <ol
        ref="days"
        :style="{
          'grid-template-columns': `repeat(${days.length}, ${itemWidth}px)`,
          'margin-left': `${rangePostion}px`,
        }"
      >
        <li
          v-for="(d, i) in days"
          :key="i"
          :class="{
            current: isMatch(d, today),
            active: isMatch(d, value),
          }"
          @click="$emit('change', d)"
        >
          <div
            v-if="!d"
            class="d1"
          >全部</div>
          <template v-else>
            <div class="d1">{{d | dateFormat('MM-dd')}}</div>
            <div class="d2">周{{dayText[d.getDay()]}}</div>
          </template>
        </li>
        <li
          class="shuttle"
          :style="{
            width: `${itemWidth}px`,
            left: `${valueIndex * itemWidth}px`,
          }"
        ></li>
      </ol>
    </li>
    <li>
      <button
        :class="{
          next: true,
          disabled: activeIndex >= days.length - maxItems,
        }"
        @click="toNextDays"
      >next</button>
    </li>
  </ul>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Date,
      default: null,
    },
    rangeTo: {
      type: Number,
    },
    startDate: {
      type: Date,
      default: () => new Date(),
    },
    available: {
      type: Boolean,
      default: false,
    },
    allDay: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      today: new Date(),
      dayText: ['日', '一', '二', '三', '四', '五', '六'],
      activeIndex: 0,
      itemWidth: 120,
      containerWidth: 0,
      daysWidth: 0,
      maxItems: 0,
      maxRightPosition: 0,
    };
  },
  computed: {
    sourceTime() {
      return this.startDate.getTime() - (this.startDate.getTime() % 86400000);
    },
    rangePostion() {
      return Math.min(0, Math.max(-this.activeIndex * this.itemWidth, this.maxRightPosition));
    },
    days() {
      const dayList = [];
      if (this.allDay) {
        dayList.push(null);
      }
      if (!this.rangeTo) {
        dayList.push(this.startDate);
      } else {
        const [min, max] = [
          Math.min(0, this.rangeTo),
          Math.max(0, this.rangeTo),
        ];
        for (let i = min; i <= max; i += 1) {
          const tdate = new Date(this.sourceTime + 86400000 * i);
          dayList.push(tdate);
        }
      }
      return dayList;
    },
    valueIndex() {
      return this.days.findIndex(d => this.isMatch(d, this.value));
    },
  },
  watch: {
    days() {
      this.$nextTick(() => {
        this.initWidth();
      });
    },
  },
  mounted() {
    this.initWidth();
    this.setActiveIndex(this.valueIndex - 4);
    if (!this.value && !this.allDay) {
      this.$emit('change', this.startDate);
    }
  },
  methods: {
    initWidth() {
      this.containerWidth = this.$refs.container.clientWidth;
      this.maxItems = parseInt(this.containerWidth / this.itemWidth, 10);
      this.daysWidth = this.$refs.days.clientWidth;
      this.maxRightPosition = -(this.daysWidth - this.containerWidth);
    },
    setActiveIndex(index) {
      this.activeIndex = Math.max(0, Math.min(index, this.days.length - this.maxItems));
    },
    isMatch(d1, d2) {
      if (d1 === d2) {
        return true;
      }
      if (!d1 || !d2) {
        return false;
      }

      return parseInt(d1.getTime() / 86400000, 10) === parseInt(d2.getTime() / 86400000, 10);
    },
    toPrevDays() {
      if (this.activeIndex <= 0) {
        return;
      }
      this.setActiveIndex(this.activeIndex - this.maxItems);
    },
    toNextDays() {
      if (this.activeIndex >= this.days.length - this.maxItems) {
        return;
      }
      this.setActiveIndex(this.activeIndex + this.maxItems);
    },
  },
};
</script>
<style lang="less">
.x-date-picker {
  padding: 0 15px 0 12px;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  opacity: 0;
  transition: all .25s ease-out;
  li {
    height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: all .25s ease-out;
  }
  &.available {
    opacity: 1;
    padding: 10px 15px 10px 12px;
    li {
      height: 60px;
    }
  }
  button {
    position: relative;
    width: 16px;
    height: 22px;
    font-size: 0;
    padding: 0;
    overflow: hidden;
    &::before {
      content: "";
      display: block;
      position: absolute;
      width: 20px;
      height: 20px;
      border-top: 3px solid #909090;
      border-left: 3px solid #909090;
      top: 50%;
      left: 5px;
      transform: translateY(-50%) rotate(-45deg);
      transition: all .25s ease-out;
    }
    &:hover::before {
      border-color: #ff5353;
    }
    &.disabled {
      opacity: .5;
      cursor: default;
      &:hover::before {
        border-color: #909090;
      }
    }
  }
  .next::before {
    transform: translateY(-50%) rotate(135deg);
    left: -12px;
  }
  .days-container {
    overflow: hidden;
  }
  ol {
    position: relative;
    top: 0;
    display: grid;
    text-align: center;
    font-size: 12px;
    color: #565656;
    line-height: 16px;
    transition: all .25s ease-out;
    li {
      flex-direction: column;
      position: relative;
      cursor: pointer;
      border-radius: 6px;
      background-color: rgba(255, 2555, 255, 0);
      transition: all .25s ease-out;
      z-index: 2;
    }
    li.current {
      background: #ecebeb;
    }
    li.active {
      background: transparent;
      color: #fff;
      div {
        transition: all .25s ease-out;
      }
      .d1 {
        font-size: 16px;
      }
      .d2 {
        margin-top: 3px;
        font-size: 14px;
      }
    }
    li.shuttle {
      position: absolute;
      background-color: #ff5353;
      z-index: 1;
    }
  }
}

.dark .x-date-picker {
  button:hover::before {
    border-color: #53fffd;
  }
  button.disabled:hover::before {
    border-color: #909090;
  }
  ol {
    color: #777;
    li.current {
      background-color: #2e2f34;
    }
    li.current.active {
      background-color: transparent;
    }
    li.shuttle {
      background-color: #00b5b3;
    }
  }
}
</style>
