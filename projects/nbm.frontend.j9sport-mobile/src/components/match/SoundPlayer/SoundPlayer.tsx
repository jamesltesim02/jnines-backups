import React from 'react';
import ReactDOM from 'react-dom';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import { loadFromStorage, saveToStorage } from '../../../utils/StorageUtils';
import { GoalSoundType } from '../../../consts/app';

import appStore from '../../../stores/app';
import matchStore from '../../../stores/matchs';

import notification from '../../common/Notification';

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

        notification.open({
          content: (
            <div
              className="goal-notification"
              onClick={() => history.push(`/detail/${match.matchId}`)}
            >
              <label>{intl.formatMessage({ id: 'match.goal_notify' })}</label>
              <div>{match.matchName}</div>
            </div>
          ),
          duration: 5
        });
      });
    },
    [intl, goalQueue, detail, history]
  );

  return ReactDOM.createPortal(
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
              loop
            >
              <source src={GoalsMp3} type="audio/ogg" />
              <source src={GoalsOgg} type="audio/mpeg" />
              <source src={GoalsWav} type="audio/wav" />
              {/* <source src="./resource/goals_sound.ogg" type="audio/ogg" />
              <source src="./resource/goals_sound.mp3" type="audio/mpeg" />
              <source src="./resource/goals_sound.wav" type="audio/wav" /> */}
            </audio>
          ))
        ) : null
      }
    </div>,
    document.body
  );
}

export default observer(SoundPlayer);
