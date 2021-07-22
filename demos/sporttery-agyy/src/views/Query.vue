<template>
  <list-page class="query-page">
    <nav-bar :title="$t('pageQuery.queryTitle')" slot="header"></nav-bar>
    <query-select class="query-type-select" :data="typeData" :placeholder="$t('pageQuery.queryType')" />
    <date-select class="query-date-select" :data="dateData" @change="changeDateFun" />
    <v-touch tag="div" :class="`query-button${actFlag ? '-active' : ''} flex-center`" @tap="submitFun">
      {{$t('pageQuery.submit')}}
    </v-touch>
    <p class="query-alert flex-center">{{$t('pageQuery.queryAlert')}}</p>
  </list-page>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { getTypeData } from '@/utils/queryUtils';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import DateSelect from '@/components/QueryAndBank/DateSelect';
import QuerySelect from '@/components/QueryAndBank/QuerySelect';

export default {
  data() {
    return {
      id: 0,
      delDay: 15,
      actFlag: false,
      dateData: {
        from: this.$t('pageQuery.startDate'),
        to: this.$t('pageQuery.endDate'),
        min: '-2,0,0',
        max: '',
      },
      typeData: getTypeData(this.$t('pageQuery.queryType'), [[
        { value: '1', text: this.$t('pageQuery.deposit1') },
        { value: '2', text: this.$t('pageQuery.deposit2') },
        { value: '3', text: this.$t('pageQuery.deposit3') },
        { value: '4', text: this.$t('pageQuery.withdraw') },
        { value: '5', text: this.$t('pageQuery.washCode') },
        { value: '6', text: this.$t('pageQuery.betting') },
      ]]),
    };
  },
  computed: {
    ...mapState('query', {
      pickSelect: state => state.pickSelect,
      queryData: state => state.queryData,
    }),
    ...mapState('app', {
      user: state => state.userinfo,
      theme: state => state.theme,
    }),
    delSecond() {
      return (this.delDay - 1) * 86400000;
    },
    qType() {
      return this.queryData && this.queryData.type ? this.queryData.type : '';
    },
  },
  components: {
    ListPage,
    NavBar,
    DateSelect,
    QuerySelect,
  },
  watch: {
    pickSelect(v) {
      if (v && `${v.title}` === `${this.typeData.title}`) {
        this.typeData.default = v.default || '';
        const dt = this.queryData;
        dt.type = v.val && v.val.length ? v.val[0] : 0;
        this.checkAct(dt);
        this.setQueryData(dt);
      }
    },
  },
  methods: {
    ...mapMutations('query', ['setQueryData']),
    checkAct(v) {
      const rst = !!(v && v.type && v.from && v.to);
      const dlt = new Date(v.to).getTime() - new Date(v.from).getTime();
      this.actFlag = rst && dlt <= this.delSecond;
    },
    changeDateFun(from, to) {
      const dt = this.queryData;
      [dt.from, dt.to] = [from, to];
      this.checkAct(dt);
      this.setQueryData(dt);
    },
    submitFun() {
      if (this.actFlag) {
        this.$router.push(`/report/${this.qType}`);
      }
    },
  },
  mounted() {
    this.checkAct(this.queryData);
  },
};
</script>

<style lang="less">
.white .query-page{
  .query-date-select {
    border: .01rem solid #EBE9E9;
  }
  .query-button {
    color: #aaaaaa;
    background: linear-gradient(to bottom, #f9f9f9, #ffffff);
    border: .01rem solid #ecebeb;
  }
  .query-button-active {
    color: #fff;
    background: #ff5353;
  }
  .query-alert {
    color: #aaaaaa;
  }
}
.black .query-page {
  .query-date-select {
    border: .01rem solid #716d6d;
  }
  .query-button {
    color: #909090;
    background: #323136;
  }
  .query-button-active {
    color: #fff;
    background: #ff5353;
  }
  .query-alert {
    color: #909090;
  }
}
.query-page {
  .query-type-select {
    margin: .3rem auto 0;
  }
  .query-date-select {
    width: 3.5rem;
    margin: .12rem auto;
    border-radius: .04rem;
  }
  .query-button, .query-button-active {
    width: 3.5rem;
    height: .4rem;
    margin: .3rem auto;
    font-size: .14rem;
    border-radius: .06rem;
  }
  .query-alert {
    width: 3.5rem;
    height: .3rem;
    font-size: .12rem;
    margin: .3rem auto;
  }
}
</style>
