import React from 'react';
import { Sports, StateExtra } from '../../../consts/match';
import Drawer from '../../common/Drawer';
import { MatchFilter } from '../MatchHooks';
import DateFilter from './DateFilter';
import Orderby from './Orderby';
import TourFilter from './TourFilter';
import { TourFilterItem } from './TourFilter/TourFilter';

import M from '../../common/m'

function FilterDrawer (
  {
    open,
    filter = { sportId: Sports.SOCCER },
    tours,
    onClose,
    onChange = () => {}
  }: {
    open: boolean,
    filter?: MatchFilter,
    tours?: Array<TourFilterItem>
    onClose: () => void,
    onChange?: (newFilter: any) => void
  }
) {
  // 临时更新的条件
  const [tempFilter, setTempFilter] = React.useState<MatchFilter | undefined>(filter as MatchFilter);
  // 更新时修改到临时条件上
  const handleChange = (newFilter: any) => {
    setTempFilter({
      ...tempFilter,
      ...newFilter
    });
  }
  /* eslint-disable react-hooks/exhaustive-deps */
  // 当打开时重置临时条件内容
  React.useEffect(
    () => {
      if (open) {
        setTempFilter(filter as MatchFilter);
      } else {
        setTempFilter(undefined);
      }
    },
    [open]
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      className="filter-drawer"
    >
      <header>
        <M id="filter.condition" />
      </header>
        {
          tempFilter ? (
            <section>
              {
                (
                  tours?.length
                  ||
                  [
                    StateExtra.RESULT,
                    StateExtra.LIVE_LIST
                  ].includes(filter.matchState as StateExtra)
                ) ? null : (
                  <Orderby
                    filter={tempFilter}
                    onChange={handleChange}
                  />
                )
              }
              <DateFilter
                filter={tempFilter}
                onChange={handleChange}
              />
              <TourFilter
                tours={tours}
                filter={tempFilter}
                onChange={handleChange}
              />
            </section>
          ) : undefined
        }
        <footer>
          <button onClick={onClose}>
            <M id="filter.cancel" />
          </button>
          <button
            onClick={() => {
              onClose();
              onChange(tempFilter);
            }}
          >
            <M id="filter.ok" />
          </button>
        </footer>
    </Drawer>
  );
}

export default FilterDrawer;
