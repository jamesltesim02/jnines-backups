// import React, { useContext } from "react"
// import { useTransition, animated } from "react-spring"
// import { withRouter } from "next/router"

// const Context = React.createContext()
// const Provider = ({ router, children }) => (<Context.Provider value={router}>{children}</Context.Provider>)

// export const useRouter = () => useContext(Context)
// export const RouterContextProvider = withRouter(Provider)

// /**
//  * 针对路由页面切换动画
//  */
// export function PageTransition ({ children, ...props }) {
//   const router = useRouter()
//   // 创建动画对象
//   const transitions = useTransition(router, router => router.pathname, {
//     from: { opacity: 0 },
//     enter: { opacity: 1 },
//     leave: () => {
//       return {
//         position: 'fixed',
//         width: '100vw',
//         height: '100vh',
//         opacity: 0
//       }
//     },
//   })

//   return (
//     <>
//       {transitions.map(({ item, props: style, key }) => {
//         const { Component, props } = (item.components || {})[item.pathname] || {}
//         return (
//           <animated.div
//             key={key}
//             style={style}
//           >
//             {children(
//               item ? { Component, pageProps: props && props.pageProps } : {}
//             )}
//           </animated.div>
//         )
//       })}
//     </>
//   )
// }

import React from 'react'
import { Switch, useLocation } from 'react-router'
import { Transition } from 'react-spring/renderprops'

const AnimatedSwitch = ({ children }) => {
  const location = useLocation()
  return (
    <Transition
      keys={location.hash}
      from={{ opacity: 0 }}
      enter={{ opacity: 1 }}
      leave={() => {
          return {
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            opacity: 0
          }
        }
      }
    >
    {
      style => (
        <Switch location={location}>
          {children}
        </Switch>
      )
    }
    </Transition>
  )
}

export default AnimatedSwitch
