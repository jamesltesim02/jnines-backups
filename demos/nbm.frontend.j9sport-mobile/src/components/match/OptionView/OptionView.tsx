import React, {useState} from 'react';
import {observer} from 'mobx-react';
import Market from '../../../stores/matchs/Market';
import Match from '../../../stores/matchs/Match';
import Option from '../../../stores/matchs/Option';
import {OptionStatus} from '../../../consts/match';
import mergeClass from '../../../utils/mergeClass';
import appStore from '../../../stores/app';
import LoadingBar from '../../common/LoadingBar';
import BetContainer from "../../betContainer";
import OptionName from '../OptionName';
import M from '../../common/m'
import FullQuickBet from "./FullQuickBet";

function OptionView(
  {
    option,
    market,
    match,
    fullscreen
  }: {
    option: Option,
    market: Market,
    match: Match,
    fullscreen?: boolean
  }
) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [positionInfo, setPositionInfo] = useState<any>();

  function quickPosition() {
    setPositionInfo(ref.current?.getBoundingClientRect())
  }

  const { combo } = appStore;

  return (
    <>
      <BetContainer
        matchInfo={match}
        market={market}
        option={option}
        combo={combo}
        fullscreen={fullscreen}
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
            // if (disabled) {
            //   return (
            //     <button className="option-view disabled">
            //       <M id="match.unavailable" />
            //     </button>
            //   );
            // }
            return (
              <button
                ref={ref}
                className={
                  mergeClass({
                    'option-view': true,
                    [String(option.oddsStatus)]: true,
                    quoting,
                    disabled,
                    checked: (combo ? comboCheck : checked),
                  })
                }
                onClick={() => {
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
                    ? <LoadingBar size="xs" />
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
