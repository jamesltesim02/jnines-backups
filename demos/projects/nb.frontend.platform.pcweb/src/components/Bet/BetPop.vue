<template>
  <div class="nb-bet-pop" >
    <bet-history />
    <bet-cart />
    <bet-match-his />
    <input id="hide-input-for-copy" type="text" readonly />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { getMultMaxBetList } from '@/api/quote';
import BetCart from '@/components/Bet/BetCart';
import BetHistory from '@/components/Bet/BetHistory';
import BetMatchHis from '@/components/Bet/BetMatchHis';

export default {
  inheritAttrs: false,
  name: 'BetPop',
  computed: {
    ...mapState({
      betFlag: state => state.bet.betFlag,
      betList: state => state.bet.betList,
      pushData: state => state.bet.pushData,
      slipSts: state => state.bet.slipStatus,
    }),
    ...mapState('app', { userinfo: state => state.userinfo }),
    token() {
      return !!(this.userinfo && this.userinfo.token);
    },
    betLen() {
      return this.betList.length;
    },
  },
  watch: {
    token() {
      this.changeInputFlag();
      if (this.token) this.checkLogin();
      setTimeout(() => { this.changeInputFlag(); }, 50);
    },
    betFlag() {
      this.startPush();
    },
    betLen() {
      this.startPush();
    },
    async slipSts() {
      if (this.token && /^[02-9]$/.test(this.slipSts)) {
        await this.tranBalToNB(true);
        this.getNBUser(true);
      }
    },
  },
  components: { BetCart, BetHistory, BetMatchHis },
  methods: {
    ...mapActions(['makePushPara', 'tranBalToNB', 'getNBUser']),
    ...mapMutations(['pushBetOption', 'changeInputFlag']),
    ...mapMutations('app', ['updateUserinfo']),
    startPush() {
      this.checkLogin();
      this.makePushPara();
      this.$regpush(this.pushData, (msg) => { this.pushBetOption(msg); }, true);
    },
    checkLogin() {
      this.checkMaxRtn();
      this.getNBUser();
    },
    async checkMaxRtn() {
      if (!this.userinfo || !this.userinfo.token) return;
      const [user, nowt, maxt] = [this.userinfo, Date.now(), 43200000];
      if (!user.rtn || !user.rtn.t || nowt - user.rtn.t > maxt) {
        try {
          const data = await getMultMaxBetList();
          if (this.userinfo && this.userinfo.token) {
            user.rtn = Object.assign({}, user.rtn || {}, data || {}, { t: nowt });
            this.updateUserinfo(user);
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    getPosit(e) {
      let touch = e.targetTouches ? e.targetTouches[0] : e;
      touch = e.changedTouches ? e.changedTouches[0] : touch;
      return [touch.pageX, touch.pageY];
    },
    copyTarget(e, ev, flag) {
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      const input = document.getElementById('hide-input-for-copy');
      const [x, y] = this.getPosit(e);
      if (!flag) this.posit = [x, y];
      const pass = Date.now() - ev.t < ev.max && Math.abs(x - ev.x) < 5 && Math.abs(y - ev.y) < 5;
      if (!e.button && pass && /copy-flag/i.test(cName)) {
        const target = e.target.parentNode.querySelector('.copy-target') || e.target;
        const alert = e.target.parentNode.querySelector('.copy-alert');
        input.value = target.innerText;
        input.focus();
        input.setSelectionRange(0, input.value.length);
        document.execCommand('Copy');
        input.value = '';
        input.blur();
        this.$toast(alert ? alert.innerText : this.$t('pageBet.copySucc'));
      }
    },
  },
  mounted() {
    this.startPush();
    const ev = Object.assign({ t: 0, max: 300 }, { x: 0, y: 0 });
    document.addEventListener('mousedown', (e) => {
      ev.t = Date.now();
      [ev.x, ev.y] = this.getPosit(e);
    });
    document.addEventListener('mouseup', (e) => {
      this.copyTarget(e, ev, true);
    });
  },
};
</script>

<style lang="less">
#hide-input-for-copy { position: absolute;  width: 10px; height: 5px; opacity: 0; top: 0; left: 0; }
</style>
