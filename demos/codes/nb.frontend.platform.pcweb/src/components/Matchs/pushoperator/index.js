import handleNT1 from './handleNT1';
import handleNT2 from './handleNT2';
import handleNT4 from './handleNT4';
import handleNT9 from './handleNT9';
import handleNT11 from './handleNT11';
import handleNT15 from './handleNT15';

const handleMappings = {
  1: handleNT1,
  2: handleNT2,
  4: handleNT4,
  9: handleNT9,
  11: handleNT11,
  15: handleNT15,
};

const ntListener = (vm, msg) => {
  console.log(`handle nt${msg.nt}:`, msg);
  const ntProccesor = handleMappings[msg.nt];
  if (!ntProccesor) {
    console.warn(`Can not find proccesor for nt ${msg.nt}.`);
    return;
  }
  ntProccesor(vm, msg);
};

export default (vm) => {
  const regData = { Matchs: [] };
  if (vm.matchGroups && vm.matchGroups.length) {
    vm.matchGroups.forEach((mg) => {
      if (!mg.matchs || !mg.matchs.length) {
        return;
      }
      mg.matchs.forEach((m) => {
        regData.Matchs.push({
          Mids: [m.matchID],
          GameTypes: m.games.map(g => g.gameType),
          GroupType: 0,
        });
      });
    });
  }
  vm.$regpush(regData, (msg) => {
    ntListener(vm, msg);
  });
};
