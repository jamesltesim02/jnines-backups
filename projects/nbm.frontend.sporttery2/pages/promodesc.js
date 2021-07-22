import { makeStyles } from '@material-ui/core/styles'
import { withLocaledRouter } from '../components/common/localed-router'

import withApi from '../api'

import SubPage from '../components/common/sub-page'

const useStyles = makeStyles(
  {
    root: {
      fontSize: 13
    }
  },
  { name: 'Promodesc' }
)

const PromodescPage = ({
  localedRouter,
  initDesc
}) => {
  if (!initDesc) {
    localedRouter.replace('/')
    return null
  }

  return (
    <SubPage title={initDesc.title}>
      <div
        dangerouslySetInnerHTML={{ __html: initDesc.content }}
        className={useStyles().root}
      />
    </SubPage>
  )
}

PromodescPage.getInitialProps = async ({
  query: { id },
  api: { info }
}) => {
  return {
    initDesc: await info.getPromodesc(id)
  }
}

export default withApi('info')(
  withLocaledRouter(PromodescPage)
)
