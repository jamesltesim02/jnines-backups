import React from 'react'
import NextLink from 'next/link'
import { withRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { inject } from 'mobx-react'

/**
 * 注入localedRouter的高阶组件
 * localedRouter主要改造push和replace函数,在地址前自动添加locale标识
 * 
 * ***localedRouter依赖store对象,所以子组件也会自动注入store对象,无需再次注入
 *s
 * @param {function} SubComponent 被注入的子组件
 */
export const withLocaledRouter = SubComponent => {
  const WrappedComponent = (props) => {
    const {
      router,
      store: {
        app: { locale }
      }
    } = props

    const makeAsurl = (url, as = url) => {
      if (!as.includes(`/${locale}/`)) {
        as = `/${locale}${as}`
      }

      return as
    } 

    const locacledRouter = {
      ...router,
      push (url, as, options = {}) {
        url = url.replace(new RegExp(`^\/${locale}`), '')

        router.push(
          url,
          makeAsurl(url, as),
          {
            scroll: true,
            ...options
          }
        )
      },
      replace (url, as, options = {}) {
        router.replace(
          url,
          makeAsurl(url, as),
          {
            scroll: true,
            ...options
          }
        )
      }
    }
    return (
      <SubComponent
        {...props}
        localedRouter={locacledRouter}
      />
    )
  }

  // init初始化
  WrappedComponent.getInitialProps = async (props) => {
    if (SubComponent.getInitialProps) {
      return await SubComponent.getInitialProps(props)
    }
  }
  return withRouter(inject('store')(WrappedComponent))
}

export const LocaledLink = ({
  children,
  href,
  as,
  intl = useIntl(),
  ...props
}) => {
  return (
    <NextLink
      href={href}
      as={`/${intl.locale}${as || href}`}
      { ...props }
    >{children}</NextLink>
  )
}

export default LocaledLink