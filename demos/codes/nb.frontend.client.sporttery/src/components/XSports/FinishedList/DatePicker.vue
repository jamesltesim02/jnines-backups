<template>
  <div class="x-date-picker">
    <v-touch
      tag="button"
      class="btn-prev"
      :class="{ disable: noPrep }"
      @tap="prevDay"
    >prev day</v-touch>
    <v-touch class="flex-between" @tap="showSelect">
      <button class="btn-calendar">
        <icon-calendar />
      </button>
      <div class="day-text" v-html="exText"></div>
    </v-touch>
    <v-touch
      tag="button"
      class="btn-next"
      :class="{ disable: noNext }"
      @tap="nextDay"
    >next day</v-touch>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import IconCalendar from './icons/IconCalendar';

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
      default: -30,
    },
    expand: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState('query', ['pickSelect']),
    text() {
      return this.format(this.value);
    },
    exText() {
      return `${this.text}${this.expand || ''}`;
    },
    days() {
      const [dt, qt] = [[], new Date().getTime()];
      const [min, max] = [
        Math.min(0, this.rangeTo),
        Math.max(0, this.rangeTo),
      ];

      for (let i = min; i <= max; i += 1) {
        const iDay = new Date(qt + 86400000 * i);
        dt.push({
          value: iDay.getTime(),
          text: this.format(iDay),
        });
      }

      return dt;
    },
    noPrep() {
      return this.compareDate(this.value, new Date(this.days[0].value)) <= 0;
    },
    noNext() {
      return this.compareDate(this.value, new Date(this.days[this.days.length - 1].value)) >= 0;
    },
  },
  watch: {
    pickSelect(n) {
      this.$emit('change', new Date(n.val[0]));
    },
  },
  components: { IconCalendar },
  mounted() {
    if (!this.value) {
      this.$emit('change', new Date());
    }
  },
  methods: {
    ...mapMutations('query', ['setPickerData']),
    initDateRange() {

    },
    format(source) {
      if (!source) {
        return '';
      }
      return `${
        this.$options.filters.dateFormat(source, 'yyyy年MM月dd日')
      } 星期${
        '日一二三四五六'.charAt(source.getDay())
      }`;
    },
    compareDate(a, b) {
      return parseInt(a.getTime() / 86400000, 10) - parseInt(b.getTime() / 86400000, 10);
    },
    prevDay() {
      // 减去一天 一天毫秒数为 1000 * 60 *60 *24 = 86400000
      if (!this.noPrep) {
        this.$emit('change', new Date(this.value.getTime() - 86400000));
      }
    },
    nextDay() {
      // 减去一天 一天毫秒数为 1000 * 60 *60 *24 = 86400000
      if (!this.noNext) {
        this.$emit('change', new Date(this.value.getTime() + 86400000));
      }
    },
    showSelect() {
      this.setPickerData({
        hide: false,
        title: '选择日期',
        join: ';',
        default: this.text,
        data: [this.days],
      });
    },
  },
};
</script>
<style lang="less">
.x-date-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: .33rem;
  button {
    font-size: 0;
    display: flex;
    align-items: center;
  }
  .btn-prev, .btn-next {
    padding: .08rem;
    &::before {
      content: "";
      display: block;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
    }
  }
  .btn-prev::before {
    border-right: 7px solid #909090;
  }
  .btn-prev.disable::before {
    border-right: 7px solid #d8d8d8;
  }
  .btn-next::before {
    border-left: 7px solid #909090;
  }
  .btn-next.disable::before {
    border-left: 7px solid #d8d8d8;
  }
  .btn-calendar {
    padding: .04rem .02rem;
  }
  .day-text {
    position: relative;
    margin: 0 .04rem;
    padding-top: .01rem;
    color: #565656;
    font-size: .12rem;
    white-space: nowrap;
    text-align: center;
  }

  .date-change-lower-enter-active,
  .date-change-lower-leave-active,
  .date-change-upper-enter-active,
  .date-change-upper-leave-active {
    will-change: transform;
    transition: all 25s ease-out;
    position: absolute;
  }
  .date-change-lower-enter, .date-change-upper-leave {
    transform: translateX(100%);
  }
  .date-change-upper-enter, .date-change-lower-leave {
    transform: translateX(-100%);
  }
}
.blue .x-date-picker {
  .day-text { color: #909090; }
  .btn-prev::before {
    border-right: 7px solid #909090;
  }
  .btn-prev.disable::before {
    border-right: 7px solid #434249;
  }
  .btn-next::before {
    border-left: 7px solid #909090;
  }
  .btn-next.disable::before {
    border-left: 7px solid #434249;
  }
}
</style>
