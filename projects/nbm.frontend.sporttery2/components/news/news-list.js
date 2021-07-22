import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { dateFormat } from '../../utils/get-locale-date'
import mergeClass from '../../utils/merge-class'

import LocaledLink from '../common/localed-router'
import ButtonArea from '../common/button-area'
import SmallFont from '../common/small-font'
import RemoteImg from '../common/remote-img'

import IconTime from '../icons/icon-time'
import IconPopularity from '../icons/icon-popularity'

const useStyles = makeStyles(
  {
    root: {
      borderTop: '1px solid rgba(220, 220, 229, .4)',
      '&:first-child': {
        borderTop: 'none'
      }
    },
    item: {
      display: 'grid',
      gridTemplateColumns: '100px 1fr',
      padding: 10,
      backgroundColor: '#fff'
    },
    img: {
      height: 68,
      width: 100,
      borderRadius: 4
    },
    content: {
      paddingLeft: 10
    },
    title: {
      fontSize: 13
    },
    desc: {
      marginTop: 15,
      fontSize: 12,
      lineHeight: '13px',
      color: '#989898',
      '& > div': {
        display: 'inline-block',
        marginRight: 22,
        '& > img': {
          height: 13,
          width: 13,
          marginRight: 4
        },
        '& > time, & > span': {
          marginTop: 0,
        }
      }
    }
  },
  { name: 'News' }
)

export default function NewsList ({
  items = [],
  itemClass
}) {
  const classes = useStyles()

  return  (
    <>
      {
        items.map(item => (
          <LocaledLink
            key={item._id}
            href={`/news/detail?id=${item._id}`}
          >
            <ButtonArea className={classes.root}>
              <div className={mergeClass(classes.item, itemClass)}>
                <RemoteImg
                  src={item.thumbnail}
                  className={classes.img}
                />
                <section className={classes.content}>
                  <h4 className={classes.title}>{item.title}</h4>
                  <div className={classes.desc}>
                    <div>
                      <IconTime style={{ marginRight: 4 }} />
                      <SmallFont
                        size={11}
                        tag="time"
                      >{dateFormat(item.createTime, 'MM月dd日')}</SmallFont>
                    </div>
                    <div>
                      <IconPopularity style={{ marginRight: 4 }}/>
                      <SmallFont size={11}>{item.popularity}</SmallFont>
                    </div>
                  </div>
                </section>
              </div>
            </ButtonArea>
          </LocaledLink>
        ))
      }
    </>
  )
}
