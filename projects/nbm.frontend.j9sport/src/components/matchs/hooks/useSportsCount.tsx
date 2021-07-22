import fromPairs from 'lodash/fromPairs';
import React from 'react';
import { useApi } from '../../../apis';
import Pull from '../../../apis/Pull';
import { ExtraMenu } from '../../../consts/match';
import { ApiConst } from '../../../consts/network';

import memberStore from '../../../stores/member';

/* eslint-disable react-hooks/exhaustive-deps */
function useSportsCount (
  type: string,
  autoRefresh: boolean = false
) {
  const { isLoged } = memberStore;
  const [counts, setCounts] = React.useState<any>({});
  const [pull] = useApi([Pull])

  React.useEffect(
    () => {
      const apis: any = {
        'inplay': pull.getInplaySportsCount.bind(pull),
        'combo': pull.getComboSportsCount.bind(pull),
        'total': pull.getTotalSportsCount.bind(pull),
      };
      const queryCount = async () => {
        const results = await apis[type]();
        if (!results?.length) {
          setCounts({ loaded: 1 });
          return;
        }
        if (isLoged) {
          const favCount = results.find(
            (record: any) => record.sportId === ExtraMenu.FAVORITE
          );

          if (favCount) {
            memberStore.favCount = favCount.count;
          }
        }
        setCounts({
          loaded: 1,
          ...fromPairs(
            results.map((item: any) => ([item.sportId, item.count]))
          )
        });
      }
      queryCount();
      if (autoRefresh) {
        const refreshTimer = setInterval(queryCount, ApiConst.CACHE_REFRESH_DELAY);
        return () => clearInterval(refreshTimer);
      }
    },
    [pull, isLoged, autoRefresh]
  );

  return counts;
}

export default useSportsCount;
