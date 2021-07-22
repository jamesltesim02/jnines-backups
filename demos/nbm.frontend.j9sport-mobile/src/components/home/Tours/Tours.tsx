import React from 'react';
import { Link } from 'react-router-dom';
import IconTeam from '../../icons/IconTeam';

import appStore from '../../../stores/app';
import { ResourceDir } from '../../../consts/network';

function Tours (
  {
    tours
  }: {
    tours: Array<any>
  }
) {

  if (!tours.length) {
    return null;
  }

  return (
    <section className="tours horizontal-scrollable">
      <ul
        style={{
          width: tours.length * 155 + 20,
          gridTemplateColumns: `repeat(${tours.length}, 1fr)`
        }}
      >
        {
          tours.map(tour => {
            const name = tour.language[appStore.locale];
            const param = {
              sportId: tour.sportId,
              name,
              logo: tour.logo,
              tourIds: tour.tournaments.map((t: any) => t.tournamentId)
            };
            return (
              <li key={tour.categoryId}>
                <Link to={`/tours/${tour.sportId}/${JSON.stringify(param)}`}>
                  <IconTeam
                    src={tour.logo}
                    name={name}
                    size={25}
                    type={ResourceDir.CATEGORY}
                  />
                  <label className="text-ellipsis">{name}</label>
                </Link>
              </li>
            )
          })
        }
      </ul>
    </section>
  );
}

export default Tours;
