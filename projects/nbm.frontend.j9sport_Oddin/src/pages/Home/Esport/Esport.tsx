import React from 'react';

import MatchFilter from '../../../components/matchs/MatchFilter';
import MatchList from '../../../components/matchs/MatchList';
import { Sports } from '../../../consts/match';

function EsportPage () {

  const [filter, setFilter] = React.useState<any>({
    sportId: Sports.ESPORTS
  });


  return (
    <MatchList
      filter={
        <MatchFilter
          checked={filter}
          onChange={setFilter}
          statable
          dateable
        />
      }
      params={filter}
    />
  )
}

export default EsportPage;
