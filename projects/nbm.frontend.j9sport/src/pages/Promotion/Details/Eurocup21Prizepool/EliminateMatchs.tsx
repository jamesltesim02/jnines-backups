import React from 'react';
import BlockContainer from './BlockContainer';
import { PoolItem } from './Eurocup21Prizepool';
import MatchItem, { Ec21Match } from './MatchItem';

import IconCrown from './images/crown.svg';

function EliminateMatchs (
  {
    matchs,
    bonus
  }: {
    matchs: Ec21Match[],
    bonus: PoolItem[]
  }
) {
  return (
    <div className="eliminate-matchs">
      <div className="eliminate-match-list">
        {
          matchs.map(match => (
            <MatchItem
              key={match.index}
              match={match}
              pool={10000}
            />
          ))
        }
      </div>
      <div>
        <BlockContainer
          className="ec21pp-pool"
          title={<>闯关大奖池<b>15万</b>USDT</>}
        >
          <ul className="bonus-list">
            {
              bonus.map(bitem => (
                <li key={bitem.value}>
                  <label>
                    <img src={IconCrown} />
                    淘汰赛猜对<b>{bitem.value}</b>场
                  </label>
                  <ol>
                    <li>
                      <span>{bitem.totalAmount}</span>
                      <label>奖池奖金(USDT)</label>
                    </li>
                    <li>
                      <span>{bitem.accomplish}</span>
                      <label>达成人数(人)</label>
                    </li>
                    <li>
                      <span>{(bitem.totalAmount/(bitem.accomplish || 1)).toFixed(2).replace('.00', '')}</span>
                      <label>获得奖励(USDT)</label>
                    </li>
                  </ol>
                </li>
              ))
            }
          </ul>
          <div className="eliminate-description">
            <label>闯关大奖池</label>
            <ul>
              <li>用户在淘汰赛阶段，只需参与单场奖池，即可自动参与闯关大奖池</li>
              <li>根据用户在淘汰赛阶段的获胜场次，将会获得不同等级的奖池分享资格。</li>
            </ul>
          </div>
        </BlockContainer>
      </div>
    </div>
  );
}

export default EliminateMatchs;
