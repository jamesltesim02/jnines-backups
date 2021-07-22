
export const MODES = [
  { min: 0, max: 599, mode: 'xsmall'},
  { min: 600, max: 1023, mode: 'small'},
  { min: 1024, max: 1439, mode: 'medium'},
  { min: 1440, max: 1919, mode: 'large'},
  { min: 1920, max: Infinity, mode: 'xlarge'},
]

export const MODE_SIZE = Object.fromEntries(
  MODES.map(
    ({ mode, min, max }) => [mode, { min, max}]
  )
)

/**
 * 获取宽度在栅格系统中对应的值  
 * 栅格对应值请在README.md中查看  
 * 
 * @param { number } width 对应宽度
 */
export default width => (
  MODES.find(
    ({
      min,
      max
    }) => {
      return (
        width >= min
        &&
        width <= max
      )
    }
  ).mode
)
