export default (vm, { mid, data }) => {
  if (String(mid) === vm.matchInfo.matchID) {
    vm.matchInfo.matchTime = JSON.stringify(data);
  }
};
