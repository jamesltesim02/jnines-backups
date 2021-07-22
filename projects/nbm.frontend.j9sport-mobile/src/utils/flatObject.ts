const __object_2_entries__ = (
  source: Object,
  parentKey: string | null = null
) => {
  if (!source) {
    return []
  }

  const sourceEntries = Object.entries(source)

  if (!sourceEntries || !sourceEntries.length) {
    return []
  }

  const entries:any[] = [] 
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

const flatObject = (source:Object): Record<string, string> => {
  const obj:Record<string, string> = {}
  __object_2_entries__(source).forEach(([key, value]) => {
    obj[key] = value
  })

  return obj
}

export default flatObject
