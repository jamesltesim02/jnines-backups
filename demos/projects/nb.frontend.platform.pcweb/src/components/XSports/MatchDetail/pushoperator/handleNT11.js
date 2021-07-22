export default (vm, { mid, data }) => {
  if (String(mid) === vm.match.matchID) {
    vm.match.matchTime = JSON.stringify(data);
  }
};
