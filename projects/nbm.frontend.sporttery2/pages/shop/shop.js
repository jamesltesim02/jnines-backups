import { inject, observer } from 'mobx-react'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'

import { ag8 } from '../../config/config.dev'
import withApi from '../../api'

import IconNotes from '../../components/icons/icon-notes'
import IconRedeemList from '../../components/icons/icon-redeem-list'

import M from '../../components/common/m'
import SubPage from '../../components/common/sub-page'
import ButtonArea from '../../components/common/button-area'
import LocaledLink from '../../components/common/localed-router'
import RemoteImg from '../../components/common/remote-img'
import Ag8Link from '../../components/common/ag8-link'

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      backgroundColor: '#fff'
    },
    infoHolder: {
      height: 100
    },
    infoContainer: {
      position: 'fixed',
      width: '100%',
      backgroundColor: primary.main,
      padding: '0 10px',
      zIndex: 2
    },
    info: {
      backgroundColor: '#ea5243',
      borderRadius: 5,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      padding: '28px 15px 18px',
      color: '#fff',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr'
    },
    integral: {
      '& > label': {
        display: 'block',
        fontSize: 12,
        lineHeight: '12px'
      },
      '& > span': {
        display: 'block',
        fontSize: 30,
        lineHeight: '30px',
        marginTop: 10
      }
    },
    options: {
      textAlign: 'right',
      paddingTop: 26,
      '& > button': {
        display: 'inline-flex',
        width: 100,
        height: 28,
        border: '1px solid #fff',
        borderRadius: 100,
        fontSize: 12,
        '& i': {
          marginRight: 5
        }
      }
    },
    products: {
      backgroundColor: '#fff',
      padding: 10,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridRowGap: 10,
      gridColumnGap: 10,
      '& > button': {
        boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.35)',
      }
    },
    item: {
      '& > img': {
        width: '100%'
      },
      '& > div': {
        padding: '10px 10px 8px'
      },
      '& h5': {
        fontSize: 14,
        lineHeight: '14px'
      },
      '& label': {
        display: 'block',
        marginTop: 7,
        fontSize: 13,
        lineHeight: '13px',
        color: '#666'
      },
      '& span': {
        display: 'block',
        color: primary.main,
        fontSize: 12,
        marginTop: 4,
        '& > var': {
          fontSize: 15,
          marginRight: 3,
          fontWeight: 500
        }
      }
    }
  }),
  { name: 'ShopPage' }
)

const ShopPage = ({
  store: {
    member: {
      isLoged,
      memberInfo
    }
  },
  products = []
}) => {
  const classes = useStyles()

  return (
    <SubPage
      titleKey="shop.title"
      padding={0}
      // options={
      //   <LocaledLink href="/promodesc?id=5e27c15c71d4d2219e7f3dad">
      //     <IconButton color="inherit">
      //       <IconNotes />
      //     </IconButton>
      //   </LocaledLink>
      // }
      classes={{ content: classes.root }}
    >
      <div className={classes.infoHolder}>
        <section className={classes.infoContainer}>
          <ul className={classes.info}>
            <li className={classes.integral}>
              <label><M id="shop.myIntegral" /></label>
              {
                isLoged
                ? <span>{memberInfo.integral || 0}</span>
                : <span>0</span>
              }
            </li>
            <li className={classes.options}>
              {
                isLoged
                ? (
                  <LocaledLink href="/shop/history">
                    <ButtonArea ripple="white">
                      <span><IconRedeemList /><M id="shop.history" /></span>
                    </ButtonArea>
                  </LocaledLink>
                ) : (
                  <Ag8Link href={ag8.signin}>
                    <ButtonArea ripple="white">
                      <span>立即登录</span>
                    </ButtonArea>
                  </Ag8Link>
                )
              }
            </li>
          </ul>
        </section>
      </div>
      <section className={classes.products}>
      {
        products.map(prod => {
          return (
            <LocaledLink
              href={`/shop/product?id=${prod._id}`}
              key={prod._id}
            >
              <ButtonArea>
                <div className={classes.item}>
                  <RemoteImg
                    src={prod.photo}
                  />
                  <div>
                    <h5>{prod.wareName}</h5>
                    <label>
                      <M id={`shop.type.${prod.type}`} />
                    </label>
                    <span><var>{prod.needIntegral}</var><M id="shop.integral" /></span>
                  </div>
                </div>
              </ButtonArea>
            </LocaledLink>
          )
        })
      }
      </section>
    </SubPage>
  )
}

ShopPage.getInitialProps = async ({
  api: { shop }
}) => {
  const products = await shop.listProducts()
  return { products }
}

export default inject('store')(
  observer(
    withApi('shop')(ShopPage)
  )
)
