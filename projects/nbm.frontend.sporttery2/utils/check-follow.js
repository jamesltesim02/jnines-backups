export default function (item, memberInfo) {
  if (item.betState === 3) {
    return false
  }
  if (item.ticketType === 3) {
    return false
  }
  if (item.displayTime <= Date.now()) {
    return false
  }
  if (!memberInfo) {
    return true
  }
  return item.userId !== memberInfo.userId
}