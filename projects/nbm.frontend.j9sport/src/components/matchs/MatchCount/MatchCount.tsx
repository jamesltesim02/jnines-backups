import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { withApi } from '../../../apis';
import Pull from '../../../apis/Pull';

import M from '../../common/m';

function MatchCount (
  {
    api: { pull },
    sportId
  }: {
    api: { pull: Pull},
    sportId?: number
  }
) {

  const intl = useIntl();
  const [counts, setCounts] = React.useState<any>({
    topTours: 0,
    top12: 0
  });

  React.useEffect(
    () => {
      if (!sportId) {
        return;
      }
      pull.getCountsBySports(sportId).then(result => {
        setCounts({
          topTours: result.leagueCount,
          top12: result.earlyCount
        });
      });
    },
    [pull, sportId, setCounts]
  );

  if (!counts.top12 && !counts.topTours) {
    return null;
  }

  return (
    <div className="match-count">
      {
        ['topTours', 'top12'].map(type => (
          <Link
            key={type}
            to={
              `/category/${sportId}/${type}/${intl.formatMessage({ id: `match.${type}`})}`
            }
          >
            <div>
              <var>{counts[type]}</var>
              <label><M id="match.chang" /></label>
            </div>
            <div><M id={`match.${type}`} /></div>
          </Link>
        ))
      }
    </div>
  );
}

export default withApi({ pull: Pull })(MatchCount);
