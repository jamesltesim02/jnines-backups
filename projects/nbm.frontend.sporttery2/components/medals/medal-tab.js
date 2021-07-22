import TabMenu from '../common/tab-menu'

const tabs = [
  // 带红人数
  {
    value: 0,
    labelKey: 'medal.led'
  },
  // 最高连红
  {
    value: 1,
    labelKey: 'medal.consecutive'
  },
  // 累计中奖
  {
    value: 2,
    labelKey: 'medal.profit'
  },
  // 认证大神
  {
    value: 3,
    labelKey: 'medal.certificated'
  }
]

export default function MedalTab (props) {
  return (
    <TabMenu
      menus={tabs}
      {...props}
    />
  )
}
