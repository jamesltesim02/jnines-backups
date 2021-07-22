import Document, { Head, Main, NextScript } from 'next/document'


export default class extends Document {
  // static async getInitialProps(context) {
  //   const props = await super.getInitialProps(context)

  //   const {
  //     req: { locale, localeDataScript }
  //   } = context

  //   return {
  //     ...props,
  //     locale,
  //     localeDataScript
  //   }
  // }

  render () {
    console.log('...自定义 document, 初始化时只执行一次')
    // Polyfill Intl API for older browsers
    // const polyfill = `https://cdn.polyfill.io/v3/polyfill.min.js?features=Intl.~locale.${
    //   this.props.locale
    // }`

    return (
      <html>
        <Head/>
        <body>
          <Main />
          {/* <script src={polyfill} />
          <script
            dangerouslySetInnerHTML={{
              __html: this.props.localeDataScript
            }}
          /> */}
          <NextScript />
          <div style={{
            display: 'none'
          }}>
            {process.env.NODE_ENV}
          </div>
        </body>
      </html>
    )
  }
}
