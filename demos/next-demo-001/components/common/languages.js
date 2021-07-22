import { Fragment } from 'react'
import Link from 'next/link'
import { withRouter } from 'next/router'
import M from '../common/m'
import devConfig from '../../configs/config.dev'

export default withRouter(({ router: { pathname } }) => (
  <div>
    {
      devConfig.locales.map((locale, i) => (
        <Fragment key={locale}>
          {
            i > 0
            ? <Fragment>&nbsp;|&nbsp;</Fragment>
            : null
          }
          <Link
            href={`/${locale}${pathname}`}
            prefetch={false}
          >
            <a type="primary">
              <M id={`common.languages.${locale}`} />
            </a>
          </Link>
        </Fragment>
      ))
    }
  </div>
))
