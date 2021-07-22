import Head from 'next/head'
import Menus from './menus'
import Languages from './languages'
import Version from './version'

export default ({
  children,
  title = 'A default title'
}) => (
  <div>
    <Head>
      <title>{title}</title>
    </Head>

    <header>
      <Menus />
    </header>
    <hr />
    {children}
    <hr />
    <Languages />
    <footer>
      page footer.
      <Version />
    </footer>
  </div>
)