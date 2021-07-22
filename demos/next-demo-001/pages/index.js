
import Layout from '../components/common/layout'
import { useAmp } from 'next/amp'
import { FormattedMessage, useIntl } from 'react-intl'

export default ({intl = useIntl()}) => (
  <Layout title="Home page.">
    This is index page.<br />
    user amp: {useAmp()}<br />
    locale: {intl.locale}<br />
    i18n message &lt;FormattedMessage id="message"/&gt;: <FormattedMessage id="message"/><br />
    i18n message {`intl.formatMessage({id:'message'})`}:{ intl && intl.formatMessage({id:'message'}) }<br />
  </Layout>
)