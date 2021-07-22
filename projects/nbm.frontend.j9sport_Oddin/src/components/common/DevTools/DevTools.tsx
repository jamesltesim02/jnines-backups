import { observer } from 'mobx-react';
import React from 'react';
import PushTester from './PushTester';

const MobxDebugger = observer(function MobxDebugger(props: any) {return (<></>)});

function DevTools () {
  return (
    <>
      {/* mobx调试 */}
      <MobxDebugger
        store={{
          appStore: require('../../../stores/app'),
          memberStore: require('../../../stores/member'),
          matchStore: require('../../../stores/matchs'),
          cartStore: require('../../../stores/cart'),
          singleStore: require('../../../stores/cart/SingleBet'),
          comboStore: require('../../../stores/cart/ComboBet'),
        }}
      />
      {/* 推送调试 */}
      <PushTester />
    </>
  );
}

export default DevTools;
