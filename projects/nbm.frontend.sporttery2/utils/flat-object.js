const __object_2_entries__ = (source, parentKey = null) => {
  if (!source) {
    return []
  }

  const sourceEntries = Object.entries(source)

  if (!sourceEntries || !sourceEntries.length) {
    return []
  }

  const entries = [] 
  sourceEntries.forEach(([k, v]) => {
    const key = `${parentKey ? `${parentKey}.` : ''}${k}`
    if (
      v
      && v.toString() === '[object Object]'
      && Object.keys(v).length
    ) {
      entries.push(...__object_2_entries__(v, key))
    } else {
      entries.push([key, v])
    }
  })
  return entries
}

const flatObject = (source) => {
  return Object.fromEntries(__object_2_entries__(source))
}

module.exports = flatObject
