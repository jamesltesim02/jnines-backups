export default (vm, { data: { state } }) => {
  const [isOver, isLive] = [/^3$/.test(state), /^[12]$/.test(state)];
  const sports = window.NBConfig.AVAILABLE_SPORTS;
  let showLive = window.NBConfig.SHOW_LIVE;
  for (let i = 0; i < sports.length; i += 1) {
    const sno = typeof sports[i] === 'object' ? sports[i].SNO || sports[i].SPORT_ID : sports[i];
    if (`${vm.matchInfo.sportID}` === `${sno}` && typeof sports[i] === 'object') {
      showLive = typeof sports[i].SHOW_LIVE === 'undefined' ? showLive : sports[i].SHOW_LIVE;
      break;
    }
  }
  if (isOver || (isLive && !showLive)) {
    vm.matchInfo.games = [];
    vm.$toast(vm.$t('message.matchClosed'));
    setTimeout(
      () => {
        this.$router.replace(this.lastPath || '/xsports/1');
      },
      20,
    );
  }
};
