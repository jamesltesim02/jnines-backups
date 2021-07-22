export default (vm, { data: { hs, as } }) => {
  vm.match.matchScore = `${hs}:${as}`;
};
