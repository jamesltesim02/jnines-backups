import Link from 'next/link'
import Head from 'next/head'
import { useAmp } from 'next/amp'
import { inject, observer } from 'mobx-react'

export default inject('store')(
  observer(
    ({
      children,
      title = 'A default title',
      store: {
        messages
      }
    }) => (
      <div>
        <Head>
          <meta charSet="utf8" />
          {/* { useAmp() && <script async src="https://cdn.ampproject.org/v0.js"></script> } */}
          <title>{title}</title>
          {/* <link rel="canonical" href="https://amp.dev/documentation/guides-and-tutorials/start/create/basic_markup/" /> */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui"></meta>
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "http://schema.org",
              "@type": "NewsArticle",
              "headline": "Open-source framework for publishing content",
              "datePublished": "2015-10-07T12:02:41Z",
              "image": [
                "logo.jpg"
              ]
            })
          }}></script>
          <style amp-boilerplate dangerouslySetInnerHTML={{
            __html: `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`
          }}></style>
          <noscript>
            <style amp-boilerplate dangerouslySetInnerHTML={{
              __html: `body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`
            }}></style>
          </noscript> */}
        </Head>

        <header>
          <nav>
            <Link href="/" scroll={false}>
              <a title="home page">Home</a>
            </Link>
            |
            <Link href="/about">
              <a>About</a>
            </Link>
            |
            <Link href="/profile">
              <a>Profile</a>
            </Link>
            |
            <Link href="/todolist">
              <a>Todolist</a>
            </Link>
            |
            <Link href="/messages">
              <a>Messages ({messages.unReadCount})</a>
            </Link>
            |
            <Link href="/toast">
              <a>Toast</a>
            </Link>
            |
            <Link href="/tsdemo">
              <a>Tsdemo</a>
            </Link>
            |
            <Link href="/aaaa">
              <a>Aaaa</a>
            </Link>
          </nav>
        </header>
        {children}
        <footer>page footer.</footer>
        <style jsx>{`
          nav a {
            margin: 10px;
          }
        `}</style>
      </div>
    )
  )
)
