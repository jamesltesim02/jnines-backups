import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/styles'

const polyfillCodes = `
(function (d,h,w) {
  function b(s, c) {
    var e = document.createElement('script');
    c && e.addEventListener('load', c);
    e.src = s;
    d.head.appendChild(e)
  };
  h.indexOf('debug=true') > -1 && b('/public/vconsole.min.js', function () { new VConsole() });
  !w.Intl && b('/public/Intl.js', function() { w.Intl.locale = 'zh-CN' })
})(document, location.search, window)
`.replace(/\n(\s+)?/gm, '')

export default class extends Document {
  static async getInitialProps(context) {
    const {
      req: { locale },
      renderPage: originalRenderPage
    } = context

    const sheets = new ServerStyleSheets()

    context.renderPage = () => originalRenderPage({
        enhanceApp: App => props => sheets.collect(<App {...props} />)
      })

    const props = await super.getInitialProps(context)

    return {
      ...props,
      locale,
      styles: [
        <React.Fragment key="styles">
          {props.styles}
          {sheets.getStyleElement()}
        </React.Fragment>
      ]
    }
  }
  
  render () {
    return (
      <html>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
          <script dangerouslySetInnerHTML={{
            __html: polyfillCodes
          }}></script>
        </Head>
        <body>
          <Main />
          <NextScript />
          <div style={{ display: 'none' }}>{process.env.NODE_ENV}</div>
        </body>
      </html>
    )
  }
}
