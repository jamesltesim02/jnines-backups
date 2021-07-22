import { throttle } from 'lodash';
import React from 'react';
import { useApi } from '../../../../apis';
import Theme from '../../../../apis/Theme';
import LoadingBar from '../../../../components/common/LoadingBar';
import mergeClass from '../../../../utils/mergeClass';
import EliminateMatchs from './EliminateMatchs';
import GroupMatchs from './GroupMatchs';
import { Ec21Match } from './MatchItem';

export class PoolItem {
  value: number;
  totalAmount: number;
  accomplish: number;
  obtainAmount: number;
  constructor (source: string) {
    const values = source.split(':');
    [
      this.value,
      this.totalAmount,
      this.accomplish,
      this.obtainAmount
    ] =[
      Number(values[0]),
      Number(values[1]) + Number(values[4]),
      Number(values[2]) + Number(values[5]),
      Number(values[3]) + Number(values[6])
    ];
  }
}

function parseList <T> (source: string = '', Type: any) {
  return (
    source.replace(
      /^\[\{|\}\]$/gi,
      ''
    ).split(
      '},{'
    ).map<T>(
      matchStr => new Type(matchStr)
    )
  ); 
}

function Eurocup21Prizepool () {

  const { theme }: { theme: Theme } = useApi({ theme: Theme });

  const [eliminateMode, setEliminateMode] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [matchList1, setMatchList1] = React.useState<Ec21Match[]>([]);
  const [matchList2, setMatchList2] = React.useState<Ec21Match[]>([]);
  const [bonusList, setBonusList] = React.useState<PoolItem[]>([]);


  React.useEffect(
    () => {
      setLoading(true);
      Promise.all([
        theme.getEurocup21PrizepoolMatchs(),
        theme.getEurocup21PrizepoolElimination(),
        theme.getEurocup21PrizepoolBonus()
      ]).then(([result1, result2, result3]) => {
        setMatchList1(
          parseList<Ec21Match>(result1, Ec21Match)
        );
        setMatchList2(
          parseList<Ec21Match>(result2, Ec21Match)
        )
        setBonusList(
          parseList(result3 || '', PoolItem)
        )
      }).finally(
        () => setLoading(false)
      )
    },
    [theme]
  );


  return (
    <div className="ec21pp-container">
      <header className="ec21pp-banner">
        <button
          className={mergeClass({
            'mode1-button': true,
            active: !eliminateMode
          })}
          onClick={() => setEliminateMode(false)}
        >小组赛奖池</button>
        <button
          className={mergeClass({
            'mode2-button': true,
            active: eliminateMode
          })}
          onClick={() => setEliminateMode(true)}
        >淘汰赛奖池</button>
      </header>
      <section className="ec21pp-content">
        {
          loading ? (
            <LoadingBar />
          ) : (
            eliminateMode
            ? <EliminateMatchs matchs={matchList2} bonus={bonusList} />
            : <GroupMatchs matchs={matchList1} />
          )
        }
      </section>
    </div>
  );
}

export default Eurocup21Prizepool;
