import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'

import { ag8 } from '../../config/config.dev'
import mergeClass from '../../utils/merge-class'
import withApi from '../../api'

import M from '../../components/common/m'
import SubPage from '../../components/common/sub-page'
import Block from '../../components/common/block'
import ButtonArea from '../../components/common/button-area'
import Slider from '../../components/common/slider'
import LocaledLink from '../../components/common/localed-router'
import TabMenu from '../../components/common/tab-menu'
import Ag8Link from '../../components/common/ag8-link'

import Banner from '../../components/index/banner'

import Photodesc from '../../components/shop/photodesc'
import Specification from '../../components/shop/specification'

const ibStyles = makeStyles(
  {
    root: {
      padding: 10,
      '& > h3': {
        fontSize: 14,
        lineHeight: '14px',
        paddingBottom: 10
      }
    }
  },
  { name: 'InfoBlock' }
)
const InfoBlock = ({
  title,
  children
}) => {
  const classes = ibStyles()
  return (
    <Block className={classes.root}>
      <h3>{title}</h3>
      {children}
    </Block>
  )
}

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    col2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    },
    integral: {
      fontSize: 15,
      color: primary.main,
      fontWeight: 500,
      lineHeight: '15px',
      '& > label': {
        fontSize: 12,
        marginLeft: 5
      }
    },
    inventory: {
      textAlign: 'right',
      fontSize: 12,
      lineHeight: '12px',
      color: '#999'
    },
    capacity: {
      display: 'grid',
      gridTemplateColumns: '50px 1fr',
      margin: '5px 0',
      alignItems: 'center',
      '& > label': {
        color: '#999',
        fontSize: 14
      },
      '& > ul': {
        display: 'flex'
      }
    },
    colors: {
      display: 'flex',
      '& > button': {
        display: 'inline-block',
        height: 40,
        width: 'unset'
      }
    },
    colorItem: {
      borderRadius: 5,
      overflow: 'hidden',
      border: '2px solid transparent',
      transition: 'all .3s ease-in-out',
      '& > i': {
        transition: 'all .3s ease-in-out',
        display: 'block',
        minWidth: 40,
        height: '100%',
        opacity: .8,
        color: '#000',
        lineHeight: '36px',
        padding: '0 10px',
        fontSize: 12,
        textShadow: '1px 1px 1px #fff'
      },
      '&:not(:first-child)': {
        marginLeft: 8
      }
    },
    colorActive: {
      border: `2px solid ${primary.main}`,
      '& > i': {
        opacity: 1
      }
    },
    sizes: {
      display: 'flex',
      marginTop: 3,
      '& > button': {
        display: 'inline-block',
        width: 'unset'
      }
    },
    sizeItem: {
      borderRadius: 5,
      border: '2px solid transparent',
      background: '#ebebeb',
      padding: '0 10px',
      lineHeight: '30px',
      transition: 'all .3s ease-in-out',
      fontSize: 12,
      '&:not(:first-child)': {
        marginLeft: 10
      }
    },
    sizeActive: {
      border: `2px solid ${primary.main}`,
    },
    footer: {
      height: 50
    },
    redeemBar: {
      position: 'fixed',
      height: 50,
      bottom: 0,
      width: '100%',
      background: '#fff',
      display: 'grid',
      gridTemplateColumns: '1fr 140px',
      alignItems: 'center',
      fontSize: 15,
      zIndex: 3,
      '& > button': {
        textAlign: 'center',
        background: primary.main,
        color: '#fff',
        height: 50
      }
    },
    addressContent: {
      display: 'inline-block',
      textAlign: 'left',
      lineHeight: '25px',
      padding: '14px 0 0 10px'
    },
    ownIntegral: {
      paddingLeft: 10,
      '& > span': {
        marginLeft: 5,
        color: primary.main
      }
    },
    submitBar: {
      background: '#fff',
      fontSize: 14,
      '& > ul': {
        padding: '0 10px'
      }
    },
    submitItem: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '60px 1fr',
      lineHeight: '50px',
      color: '#666',
      '& > div': {
        textAlign: 'right'
      },
      '& a': {
        color: '#0F4AD0'
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        display: 'block',
        height: 1,
        width: '200%',
        bottom: 0,
        left: 0,
        background: '#ddd',
        transform: 'scale(.5)',
        transformOrigin: 'left bottom'
      }
    },
    useIntegral: {
      color: primary.main
    },
    submitButton: {
      marginTop: 50,
      height: 50,
      background: primary.main,
      color: '#fff',
      textAlign: 'center',
      fontSize: 15
    },
    tabs: {
      position: 'relative',
      zIndex: 2,
      borderBottom: '1px solid #ccc',
      marginBottom: -1
    }
  }),
  { name: 'ProductPage' }
)

const ProductPage = ({
  initProduct,
  store: {
    toast,
    member
  },
  api: { shop }
}) => {
  const classes = useStyles()
  const intl = useIntl()

  const {
    isLoged,
    memberInfo
  } = member

  const [product, setProduct] = React.useState(initProduct)

  const [color, setColor] = React.useState(null)
  const [size, setSize] = React.useState(null)
  const [open, setOpen] = React.useState(false)
  const [address, setAddress] = React.useState(null)

  const pbanner = (product.bannerList || []).map((thumbnail, i) => ({
    _id: i,
    thumbnail
  }))

  const openAddress = async () => {
    try {
      if (color === null || !size) {
        toast.warning(intl.formatMessage({ id: 'shop.needCapacity' }))
        return
      }
      toast.loading()
      if (!address) {
        setAddress(await shop.getAddress())
      }
      setOpen(true)
    } finally {
      toast.loading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      if (!address) {
        toast.warning(intl.formatMessage({ id: 'shop.needAddress' }))
        return
      }
      if (product.inventory < 1) {
        toast.warning(intl.formatMessage({ id: 'shop.numNotEnough' }))
        return
      }
      if (memberInfo.integral < product.needIntegral) {
        toast.warning(intl.formatMessage({ id: 'shop.integralNotEnough' }))
        return
      }
      toast.loading()
      await shop.redeem({
        wareId: product._id,
        wareNum: 1,
        size,
        color: JSON.stringify(product.wareColor[color]),
        addressId: address._id
      })
      toast.success(intl.formatMessage({ id: 'shop.success' }))

      member.updateMemberInfo({ integral: Math.max(memberInfo.integral - product.needIntegral, 0) })
      setProduct({
        ...product,
        inventory: product.inventory - 1
      })
      setOpen(false)
      setColor(null)
      setSize(null)
    } catch (e) {
      toast.error(e.msg || '')
    } finally {
      toast.loading(false)
    }
  }

  const hasDesc = product.detailPhoto && product.detailPhoto.length
  const [tab, setTab] = React.useState(hasDesc ? 1 : 2)
  const menus = []
  if (hasDesc) {
    menus.push({
      value: 1,
      labelKey: 'shop.prodDesc'
    })
  }
  if (product.description) {
    menus.push({
      value: 2,
      labelKey: 'shop.prodSpecify'
    })
  }

  return (
    <SubPage
      titleKey="shop.detailTitle"
      padding={0}
    >
    <Block>
      {
        (pbanner && pbanner.length)
        ? <Banner items={pbanner} />
        : null
      }
    </Block>
    <InfoBlock title={product.wareName}>
      <ul className={classes.col2}>
        <li className={classes.integral}>
          {product.needIntegral}
          <label><M id="shop.integral" /></label>
        </li>
        <li className={classes.inventory}>
          <M
            id="shop.inventory"
            values={{ value: product.inventory }}
          />
        </li>
      </ul>
    </InfoBlock>
    <InfoBlock title={intl.formatMessage({ id: 'shop.capacityLabel' })}>
      <section className={classes.capacity}>
        <label><M id="shop.color" /></label>
        {
          (product.wareColor && product.wareColor.length)
          ? (
            <div className={classes.colors}>
              {product.wareColor.map((c, i) => (
                <ButtonArea
                  key={c.value}
                  onClick={() => setColor(i === color ? null : i)}
                  className={
                    mergeClass(
                      classes.colorItem,
                      color === i ? classes.colorActive : null
                    )
                  }
                >
                  <i style={{ background: c.value }}>{c.name}</i>
                </ButtonArea>
              ))}
            </div>
          )
          : <span><M id="shop.none" /></span>
        }
      </section>
      <section className={classes.capacity}>
        <label><M id="shop.size" /></label>
        {
          (product.size && product.size.length)
          ? (
            <div className={classes.sizes}>
              {product.size.map(s => (
                <ButtonArea
                  key={s}
                  onClick={() => setSize(s === size ? null : s)}
                  className={
                    mergeClass(
                      classes.sizeItem,
                      size === s ? classes.sizeActive : null
                    )
                  }
                >{s}</ButtonArea>
              ))}
            </div>
          )
          : <span><M id="shop.none" /></span>
        }
        <ul></ul>
      </section>
    </InfoBlock>
    {
      menus.length ? (
        <Block>
          <TabMenu
            menus={menus}
            value={tab}
            className={classes.tabs}
            onChange={v => setTab(v)}
          />
          {
            tab === 1 ? (
              <Photodesc
                photos={product.detailPhoto}
              />
            ) : null
          }
          {
            tab === 2 ? (
              <Specification
                type={product.wareSource}
                content={product.description}
              />
            ) : null
          }
        </Block>
      ) : null
    }
    <footer className={classes.footer}>
      <div className={classes.redeemBar}>
        <div className={classes.ownIntegral}>
          <M id="shop.myIntegral" />:
          {
            isLoged
            ? <span>{memberInfo.integral || 0}</span>
            : <span>0</span>
          }
        </div>
        {
          isLoged
          ? (
            <ButtonArea
              ripple="white"
              onClick={openAddress}
            >
              <M id="shop.doRedeem" />
            </ButtonArea>
          ) : (
            <Ag8Link href={ag8.signin}>
              <ButtonArea ripple="white">立即登录</ButtonArea>
            </Ag8Link>
          )
        }
      </div>
    </footer>
    <Slider
      open={open}
      onClose={() => setOpen(false)}
    >
      <div className={classes.submitBar}>
        <ul>
          <li className={classes.submitItem}>
            <label><M id="shop.useIntegral" /></label>
            <div className={classes.useIntegral}>{product.needIntegral}</div>
          </li>
          <li className={classes.submitItem}>
            <label><M id="shop.address" /></label>
            {
              address ? (
                <div>
                  <span className={classes.addressContent}>
                    {address.recipient} {address.tel},
                    {address.address},
                    <M id="shop.postCode" />: {address.postCode}
                  </span>
                </div>
              ) : (
                <div>
                  <M id="shop.noAddress" />，
                  <LocaledLink href="/shop/address">
                    <a><M id="shop.setAddress" /></a>
                  </LocaledLink>
                </div>
              )
            }
          </li>
        </ul>
        <ButtonArea
          ripple="white"
          className={classes.submitButton}
          onClick={handleSubmit}
        ><M id="sundires.ok" /></ButtonArea>
      </div>
    </Slider>
    </SubPage>
  )
}

ProductPage.getInitialProps = async ({
  api: { shop },
  query: { id }
}) => ({
  initProduct: await shop.getProduct(id)
})

export default withApi('shop')(
  inject('store')(
    observer(ProductPage)
  )
)
