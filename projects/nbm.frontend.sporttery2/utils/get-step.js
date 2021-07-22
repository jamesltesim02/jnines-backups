export default function getStep (value, values) {
  if (!value || !values || !values.length) {
    return 0
  }
  const index = values.findIndex(step => step > value)
  if (index == -1) {
    return values[values.length - 1]
  }

  return index === 0 ? 0 : values[index - 1]
}
