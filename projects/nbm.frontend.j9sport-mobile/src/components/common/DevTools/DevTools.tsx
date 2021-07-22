import React from 'react';
import { observer } from 'mobx-react';
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
          ...(
            window['J9Sport' as any] ? ({}) : ({
              cartStore: require('../../../stores/cart/Cart'),
              singleStore: require('../../../stores/cart/SingleBet'),
              comboStore: require('../../../stores/cart/ComboBet'),
            })
          )
        }}
      />
      {
        // 推送调试
        window['J9Sport' as any]
        ? undefined
        : <PushTester />
      }
    </>
  );
}

export default DevTools;
