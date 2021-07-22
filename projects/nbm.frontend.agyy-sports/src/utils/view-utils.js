export const invalidScroll =  invalid => {
  const cl = document.body.classList
  cl[invalid ? 'add' : 'remove']('unscrollable')
}

const BODY_WHITE_BOUNDS = 'white-bounds'

export const toggleWhiteBounds = (contrl) => {
  const cl = document.body.classList
  if (typeof contrl === 'undefined') {
    cl.toggle(BODY_WHITE_BOUNDS)
    return
  }

  cl[contrl ? 'add' : 'remove'](BODY_WHITE_BOUNDS)
}
