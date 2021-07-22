import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { dateFormat } from '../../utils/get-locale-date'
import withApi from '../../api'

import M from '../../components/common/m'
import SubPage from '../../components/common/sub-page'
import RemoteImage from '../../components/common/remote-img'
import ButtonArea from '../../components/common/button-area'
import MoreButton from '../../components/common/more-button'

const useStyles = makeStyles(
  {
    item: {
      marginBottom: 10,
      backgroundColor: '#fff',
      padding: '0 10px',
      '& > header::after, & > footer::after': {
        content: '""',
        position: 'absolute',
        display: 'block',
        width: '200%',
        height: 1,
        background: '#ddd',
        transform: 'scale(.5)'
      },
      '& > header': {
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr 50px',
        fontSize: 12,
        lineHeight: '35px',
        '& > span': {
          textAlign: 'right'
        },
        '&::after': {
          transformOrigin: 'left bottom',
          bottom: 0,
        }
      },
      '& > section': {
        padding: '10px 0',
        display: 'grid',
        gridTemplateColumns: '100px 1fr'
      },
      '& img': {
        width: '100%'
      },
      '& > footer': {
        position: 'relative',
        textAlign: 'right',
        lineHeight: '40px',
        fontSize: 12,
        color: '#666',
        '&::after': {
          transformOrigin: 'left top',
          top: 0
        }
      }
    },
    billinfo: {
      fontSize: 12,
      color: '#666',
      paddingLeft: 10,
      '& > time, & > span': {
        marginTop: 1,
        display: 'block'
      },
      '& > div': {
        color: '#333',
        fontSize: 14,
        fontWeight: 400,
        '& > var': {
          marginLeft: 4,
          fontSize: 12
        }
      }
    },
    button: {
      position: 'relative',
      display: 'inline-block',
      width: 'unset',
      height: 25,
      lineHeight: '25px',
      padding: '0 10px',
      marginLeft: 15,
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '200%',
        height: '200%',
        border: '1px solid #ddd',
        borderRadius: 5,
        transform: 'translate(-50%, -50%) scale(.5)'
      }
    }
  },
  { name: 'RedeemHistoryPage' }
)

const RedeemHistoryPage = ({
  store: { toast },
  api: { shop },
  initData
}) => {
  const classes = useStyles()
  const intl = useIntl()

  // 是否正在查询更多
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState(initData)

  const loadMore = async () => {
    setLoading(true)
    try {
      const newData = await shop.redeemHistory({
        pageSize: data.currentCount,
        pageIndex: data.currentPage + 1
      })
      setData({
        ...newData,
        list: [...data.list, ...newData.list]
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text, result) => {
    if (result) {
      toast.success(intl.formatMessage(
        { id: 'sundires.copySuccess' },
        { text }
      ))
      
      return
    }
    toast.warning(toast.success(intl.formatMessage({ id: 'sundires.copyFail' })))
  }

  return (
    <SubPage
      titleKey="shop.history"
      padding={'10px 0'}
    >
      {
        data.list.map(item => {
          const express = item.expressCom ? ({
            ...JSON.parse(item.expressCom),
            num: item.trackingNum
          }) : null
          
          return (
            <div
              key={item._id}
              className={classes.item}
            >
              <header>
                <div>
                  <M id="shop.billno" />
                  {item.orderNum}
                  <CopyToClipboard
                    text={item.orderNum}
                    onCopy={handleCopy}
                  >
                    <ButtonArea className={classes.button}>
                      <M id="sundires.copy" />
                    </ButtonArea>
                  </CopyToClipboard>
                </div>
                <span><M id={`shop.state.${item.state || 1}`} /></span>
              </header>
              <section>
                <RemoteImage src={item.photo} />
                <div className={classes.billinfo}>
                  <div>
                    {item.wareName}
                    <var>({item.integral}<M id="shop.integral" />)</var>
                  </div>
                  <time><M id="shop.time" />: {dateFormat(item.createTime)}</time>
                  <span><M id="shop.address" />: {item.address}</span>
                </div>
              </section>
              {
                express ? (
                  <footer>
                    <a
                      href={`https://m.kuaidi100.com/result.jsp?nu=${express.num}&com=${express.name}`}
                      target="_blank"
                    >{express.value}: {express.num}</a>
                    <CopyToClipboard
                      text={express.num}
                      onCopy={handleCopy}
                    >
                      <ButtonArea className={classes.button}><M id="shop.copybillno" /></ButtonArea>
                    </CopyToClipboard>
                    </footer>
                ) : null
              }
            </div>
          )
        })
      }
      <MoreButton
        data={data}
        loading={loading}
        onClick={loadMore}
      />
    </SubPage>
  )
}

RedeemHistoryPage.getInitialProps = async ({
  api: { shop }
}) => ({
  initData: await shop.redeemHistory()
})

export default withApi('shop')(
  inject('store')(
    observer(RedeemHistoryPage)
  )
)
