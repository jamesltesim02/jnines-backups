export default (vm, { data: { hs, as } }) => {
  vm.matchInfo.matchScore = `${hs}:${as}`;
};
