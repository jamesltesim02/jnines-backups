export default (vm, { data: { state } }) => {
  if (state === 3) {
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
