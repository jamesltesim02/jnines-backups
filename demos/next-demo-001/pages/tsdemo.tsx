import Layout from '../components/common/layout'
import { NextPage } from 'next'

const TsDemo: NextPage<{userAgent: string}> = ({ userAgent }) => (
  <Layout title="Tsdemo page.">
    <h3>user agent is: {userAgent}</h3>
  </Layout>
)

TsDemo.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] || '' : navigator.userAgent
  return { userAgent }
}

export default TsDemo
