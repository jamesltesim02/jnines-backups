import IconLed from './icon-led'
import IconConsecutive from './icon-consecutive'
import IconProfit from './icon-profit'
import IconCertificated from './icon-certificated'

const icons = {
  led: IconLed,
  consecutive: IconConsecutive,
  profit: IconProfit,
  certificated: IconCertificated
}

export default function IconMedal ({
  type,
  ...props
}) {
  const Component = icons[type]
  return <Component {...props} />
}
