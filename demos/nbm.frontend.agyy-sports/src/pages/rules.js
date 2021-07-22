import React from 'react'

import SubPage from '../components/common/sub-page'
import RuleContent from '../components/other/rule-content'

const RulesPage = () => (
  <SubPage
    navProps={{
      titleKey: 'others.ruleTitle',
      links: [
        { to: '/', textKey: 'common.home' },
        { textKey: 'others.ruleTitle' }
      ]
    }}
  >
    <RuleContent />
  </SubPage>
)

export default RulesPage
