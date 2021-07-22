import React from 'react';
import { Toast } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { useApi } from '../../../apis';
import Pull from '../../../apis/Pull';
import { ExtraMenu, FavoriteType } from '../../../consts/match';
import IconFavorite from '../../icons/IconFavorite';

import memberStore from '../../../stores/member';
import matchStore from '../../../stores/matchs';
import { useHistory, useLocation } from 'react-router';

function FavoriteToggle (
  {
    targetId,
    type
  }: {
    targetId: string,
    type: FavoriteType
  }
) {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const [pull] = useApi([Pull]);
  const [loading, setLoading] = React.useState(false);

  const favorited = memberStore.isFavorited(targetId, type);

  const handleFavorite = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (loading) {
      return;
    }

    if (!memberStore.isLoged) {
      Toast.fail(
        intl.formatMessage({ id: 'common.sign_first' })
      );
      setTimeout(
        () => history.replace(`/login?from=${location.pathname}`),
        1500
      );
      return;
    }

    const updateStore = (
      favorited
      ? memberStore.cancelFav
      : memberStore.addFav
    ).bind(memberStore);

    const api = (
      favorited
      ? pull.cancelFavorite
      : pull.addFavorite
    ).bind(pull);

    const params = {
      objId: targetId,
      favType: type as number
    };

    Toast.loading(
      intl.formatMessage({ id: 'pages.faving' })
    );

    setLoading(true);
    try {
      const result = await api(params);
      Toast.success(
        intl.formatMessage({
          id: `pages.${favorited ? 'cancel' : 'fav'}_success`
        })
      );
      updateStore(targetId, type);
      matchStore.countsOfSports = {
        ...matchStore.countsOfSports,
        [ExtraMenu.FAVORITE]: result.count
      };
    } finally {
      Toast.hide();
      setLoading(false);
    }
  }
  return (
    <button
      className="favorite-toggle"
      onClick={handleFavorite}
    >
      <IconFavorite active={favorited} />
    </button>
  );
}

export default FavoriteToggle;
