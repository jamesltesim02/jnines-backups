import React from 'react'
import Swiper from 'react-id-swiper'

import { makeStyles } from '@material-ui/core/styles'

import M from '../../common/m'
import Block from '../../common/block'
import MoreBar from '../../common/more-bar'

import GuruItem from '../../gurus/item'
import Pagination from './pagination'

const useStyles = makeStyles(
  {
    itemContainer: {
      padding: '0 10px',
      boxSizing: 'border-box'
    }
  },
  { name: 'Gurus' }
)

export default function Gurus ({ items }) {
  const classes = useStyles()
  const [index, setIndex] = React.useState(0)

  return (
    <Block>
      <MoreBar href="/gurus">
        <M id="gurus.blockTitle" />
      </MoreBar>
      <div className={classes.swiper}>
        <Swiper
          on={{
            slideChange () {
              setIndex(this.activeIndex)
            }
          }}
        >
          {
            items.map(item => (
              <div
                key={item.ticketId}
                className={classes.itemContainer}
              >
                <GuruItem
                  item={item}
                  followable
                />
              </div>
            ))
          }
        </Swiper>
        <Pagination
          count={items.length}
          index={index}
        />
      </div>
    </Block>
    )
}
