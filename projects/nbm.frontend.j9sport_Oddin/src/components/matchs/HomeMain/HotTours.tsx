import React from 'react';
import range from 'lodash/range';
import BlockHeader from '../../common/BlockHeader';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import appStore from '../../../stores/app';
import IconTeam from '../../icons/IconTeam';
import { ResourceDir } from '../../../consts/network';
import { IconSport } from '../../icons';

import M from '../../common/m';

const Empty = () => (
  <div className="item empty">
    <M id="common.norecords" />
  </div>
);

const fillEmpty = (array: Array<any>, max: number) => {
  if (array.length === max) {
    return array;
  }
  if (array.length > max) {
    return array.slice(0, max);
  }
  return [
    ...array,
    ...range(array.length, max)
  ];
};

function TourItem (
  {
    item,
    second = false,
  }: any
) {
  if (typeof item === 'number') {
    return <Empty />
  }
  const name = item.language[appStore.locale];
  const param = {
    sportId: item.sportId,
    name,
    tourIds: item.tournaments.map((t: any) => t.tournamentId)
  };
  return (
    <Link
      to={`/tours/${item.sportId}/${JSON.stringify(param)}`}
      className="item"
    >
      {
        second ? (
          <IconSport type={item.sportId} />
        ) : (
          <IconTeam
            src={item.logo}
            name={name}
            size={40}
            type={ResourceDir.CATEGORY}
          />
        )
      }
      <label>{name}</label>
    </Link>
  );
}

function HotTours (
  {
    tours
  }: {
    tours: Array<any>
  }
) {
  const firstLevel = fillEmpty(tours.slice(0, 6), 6);
  const secondLevel = fillEmpty(tours.slice(6, 10), 4);

  return (
    <section className="hot-tours">
      <BlockHeader titleKey="match.home_tours" />
      <div className="first-level-tours">
        {
          firstLevel.map((item, i) => (
            <TourItem
              key={i}
              item={item}
            />
          ))
        }
      </div>
      <div className="second-level-tours">
        {
          secondLevel.map(
            (item, i) => (
              <TourItem
                key={i}
                item={item}
                second
              />
            )
          )
        }
      </div>
    </section>
  )
}

export default observer(HotTours);
