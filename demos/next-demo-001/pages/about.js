import axios from 'axios'
import Layout from '../components/common/layout'

// export default () => (
//   <Layout title="About page.">
//     This is about page.
//   </Layout>
// )

const About = ({ stars }) => (
  <Layout title="About page.">
    This is about page. stars: {stars}
  </Layout>
)

About.getInitialProps = async ({ req }) => {
  // const res = await fetch('https://api.github.com/repos/zeit/next.js')
  console.log('..........about init.')
  const res = await axios.get('https://api.github.com/repos/zeit/next.js')
  const json = res.data
  return { stars: json.stargazers_count }
}

export default About