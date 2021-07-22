import React, {useState} from 'react';
import {observer} from 'mobx-react';
import Market from '../../../stores/matchs/Market';
import Match from '../../../stores/matchs/Match';
import Option from '../../../stores/matchs/Option';
import {OptionStatus} from '../../../consts/match';
import mergeClass from '../../../utils/mergeClass';

import LoadingBar from '../../common/LoadingBar';
import BetContainer from '../../betContainer';
import OptionName from '../OptionName';
import FullQuickBet from "./FullQuickBet";

function OptionView(
  {
    option,
    market,
    match,
    combo = false,
    fullscreen = false
  }: {
    option: Option,
    market: Market,
    match: Match,
    combo?: boolean,
    fullscreen?: boolean
  }
) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [positionInfo, setPositionInfo] = useState<any>();

  function quickPosition() {
    setPositionInfo(ref.current?.getBoundingClientRect())
  }

  return (
    <>
      <BetContainer
        matchInfo={match}
        market={market}
        option={option}
        combo={combo}
      >
        {
          (
            {
              quoting,
              checked,
              comboCheck,
              onToggle
            }: any
          ) => {
            const disabled = (
              option.status === OptionStatus.DISABLED
              ||
              (combo && market.combo < 2)
            );
            return (
              <button
                ref={ref}
                className={
                  mergeClass({
                    'option-view': true,
                    disabled,
                    [String(option.oddsStatus)]: true,
                    quoting,
                    checked: (combo ? comboCheck : checked),
                  })
                }
                onClick={() => {
                  if (disabled) {
                    return;
                  }
                  onToggle();
                  quickPosition();
                }}
              >
                <label>
                  <OptionName
                    marketType={market.marketType}
                    marketGroup={market.marketGroup}
                    betBar={market.betBar}
                    betOption={option.betOption}
                  />
                </label>
                <span>{option.getOdds(combo)}</span>
                {
                  quoting
                    ? <LoadingBar/>
                    : null
                }
                {
                  (checked && fullscreen) ?
                    <FullQuickBet
                      positionInfo={positionInfo}
                    /> : null
                }
              </button>
            );
          }
        }
      </BetContainer>
    </>

  );
}

export default observer(OptionView);
