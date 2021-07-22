import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import IconButton from '@material-ui/core/IconButton'

import toSignin from '../../utils/to-signin'
import withApi from '../../api'

import IconFavoriteLite from '../icons/icon-favorite-lite'

const FavoriteToggle = ({
  store: {
    member,
    favorite,
    toast
  },
  api: { pull },
  objId,
  favorited,
  type = 1,
  iconType,
  iconSize,
  className,
}) => {
  const intl = useIntl()

  const handleFavToggle = async e => {
    e.stopPropagation()

    if (!member.isLoged) {
      toast.warning(
        intl.formatMessage({ id: 'message.needLogin' })
      )
      setTimeout(toSignin, 300)
      return
    }

    const api = (favorited ? pull.cancelFavorite : pull.addFavorite).bind(pull)
    const setStore = favorited ? favorite.cancelFav : favorite.addFav

    try {
      toast.loading()
      const result = await api({
        objId,
        favType: type
      })

      setStore(objId, type)
      favorite.setCounts(result.count)
      toast.success(
        intl.formatMessage({
          id: `matchs.${favorited ? 'cancel' : 'add'}FavSuccess`
        })
      )
    } catch (e) {
      // toast.error(`${text}收藏失败`)
      console.log(e)
    } finally {
      toast.loading(false)
    }

    return false
  }
  return (
    <IconButton
      onClick={handleFavToggle}
      className={className}
    >
      <IconFavoriteLite
        active={favorited}
        type={iconType}
        size={iconSize}
      />
    </IconButton>
  )
}

export default withApi('pull')(
  inject('store')(
    observer(FavoriteToggle)
  )
)
