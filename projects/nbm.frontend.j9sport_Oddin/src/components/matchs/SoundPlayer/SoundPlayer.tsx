import React from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { notification } from 'antd';

import { loadFromStorage, saveToStorage } from '../../../utils/StorageUtils';
import { GoalSoundType } from '../../../consts/app';

import appStore from '../../../stores/app';
import matchStore from '../../../stores/matchs';

const GoalsMp3 = require('./resource/goals_sound.mp3');
const GoalsOgg = require('./resource/goals_sound.ogg');
const GoalsWav = require('./resource/goals_sound.wav');

const LAST_SOUNDS_KEY = 'last_sounds_key';

function SoundPlayer () {
  const { goalQueue, detail } = matchStore;

  const intl = useIntl();
  const history = useHistory();
  const [soundsQueue, setSoundsQueue] = React.useState<Array<string>>([]);

  React.useEffect(
    () => {
      if (!goalQueue.length) {
        return;
      }
      const _q = [...goalQueue];
      matchStore.clearGoal();

      _q.forEach(match => {
        // 使用storage去重
        const key = `${match.matchId}_${match.score?.join(':')}`;
        const last_key = loadFromStorage(LAST_SOUNDS_KEY);
        if (key === last_key) {
          return;
        }

        saveToStorage(LAST_SOUNDS_KEY, key);
        setSoundsQueue(queue => ([...queue, key]));
        setTimeout(
          () => setSoundsQueue(queue => queue.slice(1)),
          2100
        );

        if (match.matchId === detail?.matchId) {
          return;
        }

        const time = match.liveTime || {}

        notification.warn({
          key, 
          duration: 8,
          className: 'goal-notification',
          placement: 'bottomRight',
          message: intl.formatMessage({ id: 'match.goal_notify' }),
          description: (
            <section>
              <header className="tour">
                {match.tournamentName}
                <time>
                  {time.runTime}
                  {
                    +time.stoppageTime > 0 ? (
                      `+${time.stoppageTime}`
                    ) : ''
                  }
                  {intl.formatMessage({ id: 'common.minute' })}
                </time>
              </header>
              <ul className="match-info">
                <li className="team">
                  <span>{match.score[0]}</span>
                  <label>{match.team1}</label>
                </li>
                <li>VS</li>
                <li className="team">
                  <span>{match.score[1]}</span>
                  <label>{match.team2}</label>
                </li>
              </ul>
            </section>
          ),
          onClick () {
            history.push(`/detail/${match.matchId}`);
            notification.close(key);
          }
        });
      });
    },
    [intl, goalQueue, detail, history]
  );

  return (
    <div style={{ display: 'none' }}>
      {
        (
          appStore.goalSound
          ===
          GoalSoundType.UNMUTED
        ) ? (
          soundsQueue.map(s => (
            <audio
              key={s}
              autoPlay
            >
              <source src={GoalsMp3} type="audio/ogg" />
              <source src={GoalsOgg} type="audio/mpeg" />
              <source src={GoalsWav} type="audio/wav" />
            </audio>
          ))
        ) : null
      }
    </div>
  );
}

export default observer(SoundPlayer);
