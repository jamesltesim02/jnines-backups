const checkFocus = (targetId, memberInfo) => {
  if (!memberInfo) {
    return {
      visible: true,
      focused: false
    }
  }

  const { userId, focus } = memberInfo
  return {
    visible: userId !== targetId,
    focused: focus.includes(targetId)
  }
}

export default checkFocus
