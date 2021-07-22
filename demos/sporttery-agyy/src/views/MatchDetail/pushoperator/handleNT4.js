export default (vm, {
  mid,
  data: {
    hs,
    as,
  },
}) => {
  if (String(mid) !== vm.mid) {
    return;
  }

  vm.matchInfo.matchScore = `${hs}:${as}`;
};
