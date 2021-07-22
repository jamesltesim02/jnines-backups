import { regpush } from '@/utils/PushUtil';
import handleNT1 from './handleNT1';
import handleNT2 from './handleNT2';
import handleNT4 from './handleNT4';
import handleNT15 from './handleNT15';

const handleMappings = {
  1: handleNT1,
  2: handleNT2,
  4: handleNT4,
  15: handleNT15,
};

export default (vm) => {
  regpush(
    {
      Matchs: [
        {
          Mids: [vm.mid],
          GameTypes: [-1],
        },
      ],
    },
    (msg) => {
      if (String(msg.mid) !== vm.mid) {
        return;
      }
      console.log(`handle nt${msg.nt}:`, msg);
      const ntProccesor = handleMappings[msg.nt];
      if (!ntProccesor) {
        console.warn(`Can not find proccesor for nt ${msg.nt}.`);
        return;
      }
      ntProccesor(vm, msg);
    },
  );
};
