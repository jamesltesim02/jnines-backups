import React from 'react';
import { message } from 'antd';
import { observer } from 'mobx-react';

import mergeClass from '../../utils/mergeClass';

import { withApi } from '../../apis';
import Pull from '../../apis/Pull';

import IconFavorite from '../icons/IconFavorite';
import memberStore from '../../stores/member';
import { useIntl } from 'react-intl';
import { toSignin } from '../../utils/MainSiteUtils';

function FavoriteButton (
  {
    api: { pull },
    targetId,
    type,
    label,
    className,
  }: {
    api: { pull: Pull },
    targetId: string,
    type: number,
    label?: any,
    className?: string
  }
) {
  const intl = useIntl();

  const favorited = memberStore.isFavorited(targetId, type);
  const [loading, setLoading] = React.useState(false);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // 阻止事件冒泡
    event.stopPropagation();
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!memberStore.isLoged) {
      message.warn(
        intl.formatMessage({ id: 'common.sign_first' })
      );
      setTimeout(toSignin, 1500);
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

    const hide = message.loading(
      intl.formatMessage({ id: 'pages.faving' })
    );
    setLoading(true);
    try {
      const result = await api(params);
      message.success(
        intl.formatMessage({
          id: `pages.${favorited ? 'cancel' : 'fav'}_success`
        })
      );
      updateStore(targetId, type);
      memberStore.favCount = result.count;
    } finally {
      hide();
      setLoading(false);
    }

    return false;
  };

  return (
    <button
      className={mergeClass({
        'favorite-button': true,
        className
      })}
      onClick={handleClick}
      style={{
        transition: 'color .3s ease-out',
        color: favorited ? '#bd2b27' : 'inherit'
      }}
    >
      {label}
      <IconFavorite active={favorited} />
    </button>
  );
}

export default withApi({ pull: Pull })(
  observer(FavoriteButton)
);
