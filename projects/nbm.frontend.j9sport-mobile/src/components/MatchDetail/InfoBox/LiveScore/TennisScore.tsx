import { observer } from 'mobx-react';
import React from 'react';
import { useIntl } from 'react-intl';
import Match from '../../../../stores/matchs/Match';

function TennisScore (
  { match }: {
    match: Match
  }
) {
  const intl = useIntl();
  const list = [
    // 总盘数
    // {
    //   title: '总盘数',
    //   score: match.score
    // },
    // 各盘阶段
    ...match.gameScore.map((score: any, index) => ({
      title: intl.formatMessage(
        { id: 'match.games_index' },
        { index: index + 1 }
      ),
      score
    })),
    // 当前局的得分 (标题为 得分)
    {
      title: intl.formatMessage({ id: 'match.scores' }),
      score: match.liveScore?.setScore.split(':')
    },
    // 总局数
    {
      title: intl.formatMessage({ id: 'match.games' }),
      score: (
        match.gameScore.reduce(
          (previous, curr) => (
            [
              (
                (+previous[0] || 0)
                +
                (+curr[0] || 0)
              ),
              (
                (+previous[1] || 0)
                +
                (+curr[1] || 0)
              )
            ]
          ),
          [0, 0]
        )
      )
    }
  ];

  return (
    <ul className="tennis-score">
      {
        list.map((item, index) => (
          <li
            key={index}
            className="score"
          >
            <label>{item.title}</label>
            <div>{item.score[0]}</div>
            <div>{item.score[1]}</div>
          </li>
        ))
      }
    </ul>
  );
}

export default observer(TennisScore);
