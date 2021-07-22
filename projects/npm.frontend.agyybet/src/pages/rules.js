import React, { Suspense } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

import NavBar from '../components/common/nav-bar'

const RuleContent = React.lazy(() => import('../components/other/rule-content'))

const RulesPage = () => (
  <>
    <NavBar titleKey="others.ruleTitle"  />
    <Suspense
      fallback={
        <div style={{
          textAlign: 'center',
          marginTop: 50
        }}>
          <CircularProgress
            size={30}
            color="primary"
          />
        </div>
      }
    >
      <RuleContent />
    </Suspense>
  </>
)

export default RulesPage
