export default (vm, { data: { state } }) => {
  if (state === 3) {
    vm.match.games = [];
    vm.$toast(vm.$t('message.matchClosed'));
    setTimeout(
      () => {
        vm.$router.replace(vm.lastLocation || '/sports');
      },
      20,
    );
  }
};
